import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugImageMismatches() {
  console.log('🔍 Debugging image mismatches...\n');

  try {
    // Get all products with their image fields
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery, content');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📊 Found ${products.length} products in database\n`);

    // Collect all unique image filenames from database
    const dbImages = new Set();
    const missingImages = [];
    const foundImages = [];

    products.forEach(product => {
      // Check product_hero_image
      if (product.product_hero_image) {
        dbImages.add(product.product_hero_image);
        foundImages.push(product.product_hero_image);
      }

      // Check product_gallery (array of images)
      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        product.product_gallery.forEach(img => {
          if (img) {
            dbImages.add(img);
            foundImages.push(img);
          }
        });
      }

      // Check content field for any image references
      if (product.content) {
        // Look for image patterns in content
        const imageMatches = product.content.match(/['"]([^'"]*\.(jpg|jpeg|png|gif|webp|svg))['"]/gi);
        if (imageMatches) {
          imageMatches.forEach(match => {
            const filename = match.replace(/['"]/g, '');
            dbImages.add(filename);
            foundImages.push(filename);
          });
        }
      }
    });

    console.log(`📊 Found ${dbImages.size} unique image filenames in database`);
    console.log(`📊 Total image references: ${foundImages.length}\n`);

    // Check which images exist in Supabase Storage
    console.log('🔍 Checking which images exist in Supabase Storage...\n');

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (storageError) {
      console.error('❌ Error listing storage files:', storageError);
      return;
    }

    const uploadedImages = new Set(storageFiles.map(file => file.name));
    console.log(`📊 Found ${uploadedImages.size} images in Supabase Storage\n`);

    // Find missing images
    const missing = [];
    const found = [];

    dbImages.forEach(imageName => {
      if (uploadedImages.has(imageName)) {
        found.push(imageName);
      } else {
        missing.push(imageName);
      }
    });

    console.log('📊 Image Analysis:');
    console.log(`  ✅ Found in both DB and Storage: ${found.length}`);
    console.log(`  ❌ Missing from Storage: ${missing.length}\n`);

    if (missing.length > 0) {
      console.log('❌ Missing images:');
      missing.slice(0, 20).forEach(img => console.log(`  - ${img}`));
      if (missing.length > 20) {
        console.log(`  ... and ${missing.length - 20} more`);
      }
      console.log('');
    }

    if (found.length > 0) {
      console.log('✅ Found images (first 10):');
      found.slice(0, 10).forEach(img => console.log(`  - ${img}`));
      if (found.length > 10) {
        console.log(`  ... and ${found.length - 10} more`);
      }
      console.log('');
    }

    // Show some example products with their images
    console.log('📋 Sample products and their images:');
    products.slice(0, 5).forEach(product => {
      console.log(`\n🎵 ${product.title}:`);
      console.log(`  Hero: ${product.product_hero_image || 'None'}`);
      if (product.product_gallery && product.product_gallery.length > 0) {
        console.log(`  Gallery: ${product.product_gallery.slice(0, 3).join(', ')}${product.product_gallery.length > 3 ? '...' : ''}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugImageMismatches().catch(console.error); 