import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

// Load environment variables from root .env file
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAllMissingImages() {
  console.log('🔧 Fixing all missing images...\n');

  try {
    // Get all Statamic product files
    const statamicFiles = await glob('content/collections/products/*.md');
    console.log(`📊 Found ${statamicFiles.length} Statamic product files\n`);

    // Get list of actual files in ROOT assets directory (not react/assets)
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => path.basename(file)));

    console.log(`📊 Found ${assetFilenames.size} image files in root assets directory\n`);

    let updatedCount = 0;
    let missingCount = 0;
    let alreadyCorrectCount = 0;

    for (const statamicFile of statamicFiles) {
      try {
        // Read the Statamic file
        const fileContent = fs.readFileSync(statamicFile, 'utf8');
        const { data: frontMatter } = matter(fileContent);
        
        const productTitle = frontMatter.title;
        const heroImage = frontMatter.product_hero_image;
        const galleryImages = frontMatter.product_gallery || [];

        if (heroImage) {
          // Check if the image exists in root assets directory
          if (assetFilenames.has(heroImage)) {
            console.log(`✅ Found correct hero image for "${productTitle}": ${heroImage}`);
            
            // Update the database
            const { error: updateError } = await supabase
              .from('products')
              .update({ product_hero_image: heroImage })
              .eq('title', productTitle);

            if (updateError) {
              console.error(`❌ Error updating product "${productTitle}":`, updateError);
            } else {
              console.log(`✅ Updated product: ${productTitle}`);
              updatedCount++;
            }
          } else {
            console.log(`❌ Missing hero image for "${productTitle}": ${heroImage}`);
            missingCount++;
          }
        } else {
          console.log(`⚠️  No hero image for "${productTitle}"`);
        }

        // Handle gallery images
        if (galleryImages.length > 0) {
          const validGalleryImages = galleryImages.filter(img => assetFilenames.has(img));
          if (validGalleryImages.length > 0) {
            console.log(`✅ Found ${validGalleryImages.length} valid gallery images for "${productTitle}"`);
            
            const { error: updateError } = await supabase
              .from('products')
              .update({ product_gallery: validGalleryImages })
              .eq('title', productTitle);

            if (updateError) {
              console.error(`❌ Error updating gallery for "${productTitle}":`, updateError);
            }
          }
        }

      } catch (error) {
        console.error(`❌ Error processing ${statamicFile}:`, error);
      }
    }

    console.log('\n📊 Fix Summary:');
    console.log(`  ✅ Updated products with correct images: ${updatedCount}`);
    console.log(`  ❌ Missing images: ${missingCount}`);
    console.log(`  📊 Total Statamic files processed: ${statamicFiles.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAllMissingImages().catch(console.error); 