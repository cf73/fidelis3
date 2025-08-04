import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Load environment variables from root .env file
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixMissingImages() {
  console.log('🔧 Fixing missing images...\n');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery, content');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    // Get list of actual files in assets directory
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => path.basename(file)));

    console.log(`📊 Found ${assetFilenames.size} files in assets directory`);
    console.log(`📊 Found ${products.length} products in database\n`);

    let fixedCount = 0;
    let missingCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // Check hero image
      if (product.product_hero_image && !assetFilenames.has(product.product_hero_image)) {
        console.log(`❌ Missing hero image for "${product.title}": ${product.product_hero_image}`);
        
        // Try to find a similar image
        const similarImage = findSimilarImage(product.product_hero_image, assetFilenames);
        if (similarImage) {
          console.log(`  ✅ Found similar: ${similarImage}`);
          updates.product_hero_image = similarImage;
          needsUpdate = true;
          fixedCount++;
        } else {
          console.log(`  ❌ No similar image found`);
          updates.product_hero_image = null;
          needsUpdate = true;
          missingCount++;
        }
      }

      // Check gallery images
      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        const fixedGallery = [];
        for (const galleryImage of product.product_gallery) {
          if (galleryImage && !assetFilenames.has(galleryImage)) {
            console.log(`❌ Missing gallery image for "${product.title}": ${galleryImage}`);
            
            const similarImage = findSimilarImage(galleryImage, assetFilenames);
            if (similarImage) {
              console.log(`  ✅ Found similar: ${similarImage}`);
              fixedGallery.push(similarImage);
              fixedCount++;
            } else {
              console.log(`  ❌ No similar image found`);
              missingCount++;
            }
          } else if (galleryImage) {
            fixedGallery.push(galleryImage);
          }
        }
        
        if (fixedGallery.length !== product.product_gallery.length) {
          updates.product_gallery = fixedGallery;
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
          console.log(`✅ Updated product: ${product.title}`);
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Fixed images: ${fixedCount}`);
    console.log(`  ❌ Missing images: ${missingCount}`);
    console.log(`  📊 Total products processed: ${products.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function findSimilarImage(missingImage, availableImages) {
  // Remove file extension for comparison
  const baseName = path.parse(missingImage).name.toLowerCase();
  
  // Look for exact match first
  for (const available of availableImages) {
    const availableBase = path.parse(available).name.toLowerCase();
    if (availableBase === baseName) {
      return available;
    }
  }
  
  // Look for partial matches
  for (const available of availableImages) {
    const availableBase = path.parse(available).name.toLowerCase();
    if (availableBase.includes(baseName) || baseName.includes(availableBase)) {
      return available;
    }
  }
  
  // Look for images with similar patterns (numbers, brands, etc.)
  const words = baseName.split(/[-_\s]+/);
  for (const available of availableImages) {
    const availableBase = path.parse(available).name.toLowerCase();
    const availableWords = availableBase.split(/[-_\s]+/);
    
    // Check if they share any significant words
    const commonWords = words.filter(word => 
      word.length > 2 && availableWords.includes(word)
    );
    
    if (commonWords.length > 0) {
      return available;
    }
  }
  
  return null;
}

fixMissingImages().catch(console.error); 