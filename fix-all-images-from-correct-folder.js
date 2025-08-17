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

async function fixAllImagesFromCorrectFolder() {
  console.log('🔧 Fixing all images from correct folder...\n');

  try {
    // Step 1: Clear all images from Supabase Storage
    console.log('🗑️  Clearing all images from Supabase Storage...');
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (listError) {
      console.error('❌ Error listing storage files:', listError);
      return;
    }

    if (existingFiles.length > 0) {
      console.log(`🗑️  Found ${existingFiles.length} existing files to remove`);
      
      // Remove all files
      const { error: removeError } = await supabase.storage
        .from('images')
        .remove(existingFiles.map(file => file.name));

      if (removeError) {
        console.error('❌ Error removing files:', removeError);
        return;
      }
      
      console.log('✅ Cleared all images from Supabase Storage');
    } else {
      console.log('ℹ️  No existing files to remove');
    }

    // Step 2: Get all images from the correct folder
    console.log('\n📁 Getting all images from public_backup/assets/main...');
    const correctImageFiles = await glob('public_backup/assets/main/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    
    console.log(`📊 Found ${correctImageFiles.length} images in correct folder`);

    // Step 3: Upload all images to Supabase Storage
    console.log('\n📤 Uploading all images to Supabase Storage...');
    let uploadedCount = 0;
    let errorCount = 0;

    for (const imageFile of correctImageFiles) {
      try {
        const imageBuffer = fs.readFileSync(imageFile);
        const filename = path.basename(imageFile);
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filename, imageBuffer, {
            contentType: getMimeType(filename),
            upsert: true
          });

        if (uploadError) {
          console.error(`❌ Error uploading ${filename}:`, uploadError);
          errorCount++;
        } else {
          uploadedCount++;
          if (uploadedCount % 50 === 0) {
            console.log(`  📤 Uploaded ${uploadedCount} images...`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${imageFile}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`  ✅ Successfully uploaded: ${uploadedCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);

    // Step 4: Get all Statamic product files and update database
    console.log('\n🔄 Updating database with correct image references...');
    const statamicFiles = await glob('content/collections/products/*.md');
    console.log(`📊 Found ${statamicFiles.length} Statamic product files`);

    // Create a set of all available images for quick lookup
    const availableImages = new Set(correctImageFiles.map(file => path.basename(file)));
    
    let updatedCount = 0;
    let missingCount = 0;

    for (const statamicFile of statamicFiles) {
      try {
        const fileContent = fs.readFileSync(statamicFile, 'utf8');
        const { data: frontMatter } = matter(fileContent);
        
        const productTitle = frontMatter.title;
        const heroImage = frontMatter.product_hero_image;
        const galleryImages = frontMatter.product_gallery || [];

        if (heroImage) {
          if (availableImages.has(heroImage)) {
            // Update the database with the correct image
            const { error: updateError } = await supabase
              .from('products')
              .update({ product_hero_image: heroImage })
              .eq('title', productTitle);

            if (updateError) {
              console.error(`❌ Error updating product "${productTitle}":`, updateError);
            } else {
              console.log(`✅ Updated product: ${productTitle} with image: ${heroImage}`);
              updatedCount++;
            }
          } else {
            console.log(`❌ Missing image for "${productTitle}": ${heroImage}`);
            missingCount++;
          }
        }

        // Handle gallery images
        if (galleryImages.length > 0) {
          const validGalleryImages = galleryImages.filter(img => availableImages.has(img));
          if (validGalleryImages.length > 0) {
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

    console.log('\n📊 Database Update Summary:');
    console.log(`  ✅ Updated products with correct images: ${updatedCount}`);
    console.log(`  ❌ Missing images: ${missingCount}`);

    console.log('\n🎉 All done! The React app should now display all images correctly.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

fixAllImagesFromCorrectFolder().catch(console.error); 