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

async function checkDatabaseImages() {
  console.log('🔍 Checking database image references...\n');

  try {
    // Get all products with their content
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, content, product_hero_image, product_gallery');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📊 Found ${products.length} products in database\n`);

    // Check a few products to see what's in the content field
    console.log('📋 Sample products and their content:');
    products.slice(0, 5).forEach(product => {
      console.log(`\n🎵 ${product.title}:`);
      console.log(`  Hero image: ${product.product_hero_image || 'None'}`);
      if (product.product_gallery && product.product_gallery.length > 0) {
        console.log(`  Gallery: ${product.product_gallery.slice(0, 3).join(', ')}${product.product_gallery.length > 3 ? '...' : ''}`);
      }
      
      // Show a snippet of the content field
      if (product.content) {
        const contentSnippet = product.content.substring(0, 200);
        console.log(`  Content snippet: ${contentSnippet}...`);
        
        // Look for image patterns in content
        const imageMatches = product.content.match(/['"]([^'"]*\.(jpg|jpeg|png|gif|webp|svg))['"]/gi);
        if (imageMatches) {
          console.log(`  Found image references in content: ${imageMatches.join(', ')}`);
        }
      }
    });

    // Count products with different types of image references
    let productsWithHeroImages = 0;
    let productsWithGalleryImages = 0;
    let productsWithContentImages = 0;
    let productsWithNoImages = 0;

    products.forEach(product => {
      let hasAnyImage = false;
      
      if (product.product_hero_image) {
        productsWithHeroImages++;
        hasAnyImage = true;
      }
      
      if (product.product_gallery && product.product_gallery.length > 0) {
        productsWithGalleryImages++;
        hasAnyImage = true;
      }
      
      if (product.content) {
        const imageMatches = product.content.match(/['"]([^'"]*\.(jpg|jpeg|png|gif|webp|svg))['"]/gi);
        if (imageMatches && imageMatches.length > 0) {
          productsWithContentImages++;
          hasAnyImage = true;
        }
      }
      
      if (!hasAnyImage) {
        productsWithNoImages++;
      }
    });

    console.log('\n📊 Database Image Analysis:');
    console.log(`  📦 Total products: ${products.length}`);
    console.log(`  🖼️  Products with hero images: ${productsWithHeroImages}`);
    console.log(`  🖼️  Products with gallery images: ${productsWithGalleryImages}`);
    console.log(`  📄 Products with images in content: ${productsWithContentImages}`);
    console.log(`  ❌ Products with no images: ${productsWithNoImages}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDatabaseImages().catch(console.error); 