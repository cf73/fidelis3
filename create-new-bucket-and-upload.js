import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewBucketAndUpload() {
  console.log('🪣 Creating new bucket called "images"...');
  
  try {
    // Create a new bucket called "images"
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 52428800 // 50MB limit
      });
    
    if (bucketError) {
      console.error('❌ Error creating bucket:', bucketError);
      return;
    }
    
    console.log('✅ Created new bucket "images"');
    
    // Now upload all images from the local assets folder
    console.log('\n📤 Uploading images to new bucket...');
    
    const assetsDir = path.join(process.cwd(), 'assets');
    
    if (!fs.existsSync(assetsDir)) {
      console.error('❌ Assets directory not found:', assetsDir);
      return;
    }
    
    // Get all image files from the assets directory
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const localFiles = fs.readdirSync(assetsDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });
    
    console.log(`📊 Found ${localFiles.length} image files to upload`);
    
    let uploadedCount = 0;
    let errorCount = 0;
    
    // Upload files in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < localFiles.length; i += batchSize) {
      const batch = localFiles.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(localFiles.length / batchSize)} (${batch.length} files)`);
      
      for (const file of batch) {
        try {
          const filePath = path.join(assetsDir, file);
          const fileBuffer = fs.readFileSync(filePath);
          
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(file, fileBuffer, {
              contentType: getContentType(file),
              upsert: true
            });
          
          if (uploadError) {
            console.error(`  ❌ Error uploading ${file}:`, uploadError);
            errorCount++;
          } else {
            console.log(`  ✅ Uploaded: ${file}`);
            uploadedCount++;
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`  ❌ Error processing ${file}:`, error);
          errorCount++;
        }
      }
      
      // Delay between batches
      if (i + batchSize < localFiles.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n✅ Upload complete!`);
    console.log(`  Uploaded: ${uploadedCount} files`);
    console.log(`  Errors: ${errorCount} files`);
    console.log(`  Total processed: ${uploadedCount + errorCount} files`);
    
    // Update the getImageUrl function to use the new bucket
    console.log('\n📝 Next steps:');
    console.log('1. Update react/src/lib/supabase.ts to use "images" bucket instead of "assets"');
    console.log('2. Update database records to reference the new bucket if needed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

createNewBucketAndUpload().catch(console.error); 