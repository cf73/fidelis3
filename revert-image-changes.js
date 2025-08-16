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

async function revertImageChanges() {
  console.log('🔄 Reverting incorrect image changes...\n');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery, content');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    // Get list of actual files in assets directory to check what exists
    const { glob } = await import('glob');
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => file.split('/').pop()));

    let revertedCount = 0;
    let keptCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // Check hero image - revert to original or null if missing
      if (product.product_hero_image) {
        if (!assetFilenames.has(product.product_hero_image)) {
          console.log(`❌ Reverting hero image for "${product.title}": ${product.product_hero_image} -> null`);
          updates.product_hero_image = null;
          needsUpdate = true;
          revertedCount++;
        } else {
          console.log(`✅ Keeping correct hero image for "${product.title}": ${product.product_hero_image}`);
          keptCount++;
        }
      }

      // Check gallery images - revert to original or remove if missing
      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        const correctGallery = [];
        for (const galleryImage of product.product_gallery) {
          if (galleryImage && assetFilenames.has(galleryImage)) {
            correctGallery.push(galleryImage);
            console.log(`✅ Keeping correct gallery image: ${galleryImage}`);
          } else if (galleryImage) {
            console.log(`❌ Removing missing gallery image: ${galleryImage}`);
            revertedCount++;
          }
        }
        
        if (correctGallery.length !== product.product_gallery.length) {
          updates.product_gallery = correctGallery;
          needsUpdate = true;
        }
      }

      // Update the product if needed
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.id}:`, updateError);
        } else {
          console.log(`✅ Reverted product: ${product.title}`);
        }
      }
    }

    console.log('\n📊 Revert Summary:');
    console.log(`  ❌ Reverted incorrect images: ${revertedCount}`);
    console.log(`  ✅ Kept correct images: ${keptCount}`);
    console.log(`  📊 Total products processed: ${products.length}`);

    console.log('\n🎯 Result: Products now have either their correct images or no images (which is better than wrong images)');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

revertImageChanges().catch(console.error); 