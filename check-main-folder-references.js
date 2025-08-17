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

async function checkMainFolderReferences() {
  console.log('🔍 Checking for main/ folder references...\n');

  try {
    // Get all Statamic product files
    const statamicFiles = await glob('content/collections/products/*.md');
    console.log(`📊 Found ${statamicFiles.length} Statamic product files\n`);

    // Get list of actual files in assets directory
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => path.basename(file)));

    console.log(`📊 Found ${assetFilenames.size} image files in assets directory\n`);

    let missingImagesWithMain = 0;
    let foundImagesWithMain = 0;

    for (const statamicFile of statamicFiles) {
      try {
        // Read the Statamic file
        const fileContent = fs.readFileSync(statamicFile, 'utf8');
        const { data: frontMatter } = matter(fileContent);
        
        const productTitle = frontMatter.title;
        const heroImage = frontMatter.product_hero_image;

        if (heroImage) {
          // Check if the image exists as-is
          if (assetFilenames.has(heroImage)) {
            // Image exists, no issue
          } else {
            // Image doesn't exist, let's check if it might be in a main/ folder
            console.log(`❌ Missing image for "${productTitle}": ${heroImage}`);
            
            // Check if there's a similar image that might be the correct one
            const imageName = path.basename(heroImage);
            const similarImages = Array.from(assetFilenames).filter(filename => 
              filename.toLowerCase().includes(imageName.toLowerCase().replace(/\.[^/.]+$/, ''))
            );
            
            if (similarImages.length > 0) {
              console.log(`  🔍 Found similar images: ${similarImages.join(', ')}`);
              foundImagesWithMain++;
            } else {
              console.log(`  ❌ No similar images found`);
              missingImagesWithMain++;
            }
          }
        }

      } catch (error) {
        console.error(`❌ Error processing ${statamicFile}:`, error);
      }
    }

    console.log('\n📊 Analysis Summary:');
    console.log(`  🔍 Found similar images for: ${foundImagesWithMain}`);
    console.log(`  ❌ Completely missing images: ${missingImagesWithMain}`);

    // Let's also check if there are any images in Supabase Storage that might have "main/" in their path
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (storageError) {
      console.error('❌ Error listing storage files:', storageError);
    } else {
      const uploadedImages = new Set(storageFiles.map(file => file.name));
      console.log(`\n📤 Images in Supabase Storage: ${uploadedImages.size}`);
      
      // Check for any images that might have been uploaded with "main/" prefix
      const mainImages = Array.from(uploadedImages).filter(img => img.includes('main/'));
      if (mainImages.length > 0) {
        console.log(`  📁 Found images with main/ prefix: ${mainImages.length}`);
        mainImages.slice(0, 10).forEach(img => console.log(`    - ${img}`));
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMainFolderReferences().catch(console.error); 