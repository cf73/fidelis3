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

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadToImagesBucket() {
  console.log('📤 Uploading all assets to images bucket using service role...');
  
  try {
    // First, let's check if the images bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }
    
    const imagesBucket = buckets.find(bucket => bucket.name === 'images');
    
    if (!imagesBucket) {
      console.log('📦 Creating images bucket...');
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/*']
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        return;
      }
      console.log('✅ Images bucket created successfully');
    } else {
      console.log('✅ Images bucket already exists');
    }
    
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
      console.log('\n🎉 Upload completed! The React app should now display images from the images bucket.');
      console.log('🔗 Images will be served from: https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/');
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