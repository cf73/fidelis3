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

async function checkImageStatus() {
  console.log('🔍 Checking current image status...\n');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    // Get list of images in Supabase Storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (storageError) {
      console.error('❌ Error listing storage files:', storageError);
      return;
    }

    const uploadedImages = new Set(storageFiles.map(file => file.name));

    let productsWithImages = 0;
    let productsWithoutImages = 0;
    let totalImageReferences = 0;
    let missingImages = 0;

    products.forEach(product => {
      let hasImage = false;
      
      if (product.product_hero_image) {
        totalImageReferences++;
        if (uploadedImages.has(product.product_hero_image)) {
          hasImage = true;
        } else {
          missingImages++;
        }
      }

      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        product.product_gallery.forEach(img => {
          if (img) {
            totalImageReferences++;
            if (uploadedImages.has(img)) {
              hasImage = true;
            } else {
              missingImages++;
            }
          }
        });
      }

      if (hasImage) {
        productsWithImages++;
      } else {
        productsWithoutImages++;
      }
    });

    console.log('📊 Image Status Summary:');
    console.log(`  📦 Total products: ${products.length}`);
    console.log(`  ✅ Products with images: ${productsWithImages}`);
    console.log(`  ❌ Products without images: ${productsWithoutImages}`);
    console.log(`  🖼️  Total image references: ${totalImageReferences}`);
    console.log(`  📤 Images in Supabase Storage: ${uploadedImages.size}`);
    console.log(`  ❌ Missing images: ${missingImages}`);
    console.log(`  📈 Success rate: ${Math.round((productsWithImages / products.length) * 100)}%`);

    if (productsWithoutImages > 0) {
      console.log('\n❌ Products still without images:');
      products.slice(0, 10).forEach(product => {
        if (!product.product_hero_image && (!product.product_gallery || product.product_gallery.length === 0)) {
          console.log(`  - ${product.title}`);
        }
      });
      if (productsWithoutImages > 10) {
        console.log(`  ... and ${productsWithoutImages - 10} more`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkImageStatus().catch(console.error); 