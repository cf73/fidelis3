import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2IiwiclZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadToImagesBucket() {
  console.log('📤 Uploading all assets to images bucket...');
  
  try {
    // Find all image files in the assets directory
    const imageFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    
    console.log(`📊 Found ${imageFiles.length} image files to upload`);
    
    if (imageFiles.length === 0) {
      console.log('❌ No image files found in assets directory');
      return;
    }
    
    // Upload files in batches to avoid rate limiting
    const batchSize = 10;
    let uploadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      console.log(`\n📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageFiles.length / batchSize)} (${batch.length} files)`);
      
      for (const filePath of batch) {
        try {
          // Read the file
          const fileBuffer = fs.readFileSync(filePath);
          const fileName = path.basename(filePath);
          
          // Upload to Supabase
          const { error } = await supabase.storage
            .from('images')
            .upload(fileName, fileBuffer, {
              upsert: true,
              contentType: getContentType(fileName)
            });
          
          if (error) {
            console.error(`  ❌ ${fileName}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`  ✅ Uploaded: ${fileName}`);
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
    console.log(`  ⚠️  Skipped: ${skippedCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📊 Total processed: ${uploadedCount + skippedCount + errorCount}`);
    
    if (uploadedCount > 0) {
      console.log('\n🎉 Upload completed! The React app should now display images from the new bucket.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
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

uploadToImagesBucket().catch(console.error); 