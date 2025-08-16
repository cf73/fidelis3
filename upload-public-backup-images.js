import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadPublicBackupImages() {
  console.log('📤 Uploading images from public_backup/assets/main to Supabase Storage...');
  
  try {
    // Find all image files in the public_backup/assets/main directory
    const imageFiles = await glob('public_backup/assets/main/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    
    console.log(`📊 Found ${imageFiles.length} image files to upload`);
    
    if (imageFiles.length === 0) {
      console.log('❌ No image files found in public_backup/assets/main directory');
      return;
    }
    
    // Upload files in batches to avoid rate limiting
    const batchSize = 10;
    let uploadedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      console.log(`\n📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageFiles.length / batchSize)} (${batch.length} files)`);
      
      for (const filePath of batch) {
        try {
          // Read the file
          const fileBuffer = fs.readFileSync(filePath);
          
          // Get the relative path from public_backup/assets/main
          const relativePath = path.relative('public_backup/assets/main', filePath).replace(/\\/g, '/');
          
          console.log(`  📤 Uploading: ${relativePath}`);
          
          // Upload to Supabase images bucket
          const { error } = await supabase.storage
            .from('images')
            .upload(relativePath, fileBuffer, {
              upsert: true,
              contentType: getContentType(filePath)
            });
          
          if (error) {
            console.error(`  ❌ ${relativePath}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`  ✅ Uploaded: ${relativePath}`);
            uploadedCount++;
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`  ❌ Error uploading ${filePath}: ${error.message}`);
          errorCount++;
        }
      }
      
      // Wait between batches
      if (i + batchSize < imageFiles.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n📊 Upload Summary:');
    console.log(`  ✅ Successfully uploaded: ${uploadedCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📊 Total processed: ${uploadedCount + errorCount}`);
    
    if (uploadedCount > 0) {
      console.log('\n🎉 Upload completed! The React app should now display images from Supabase Storage.');
      console.log('🔗 Images will be served from: https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/');
      console.log('\n📝 Next steps:');
      console.log('1. The getImageUrl function should now work with the uploaded images');
      console.log('2. Test the React app to see the actual images');
      console.log('3. Check the browser console for any remaining image loading issues');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

uploadPublicBackupImages().catch(console.error); 