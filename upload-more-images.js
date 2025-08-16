import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables');
  console.error('You need to add SUPABASE_SERVICE_ROLE_KEY to your .env file');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const BUCKET_NAME = 'assets';

async function uploadMoreImages() {
  console.log('🚀 Uploading more images to test...\n');

  try {
    // Get all files from assets directory
    const assetsDir = 'assets';
    if (!fs.existsSync(assetsDir)) {
      console.error('❌ Assets directory not found');
      return;
    }

    const files = fs.readdirSync(assetsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    // Take first 20 images for testing
    const testFiles = imageFiles.slice(0, 20);
    
    console.log(`📁 Found ${imageFiles.length} total images`);
    console.log(`📤 Uploading first ${testFiles.length} images for testing\n`);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const fileName of testFiles) {
      try {
        const filePath = path.join(assetsDir, fileName);
        const fileContent = fs.readFileSync(filePath);
        const contentType = mime.getType(filePath) || 'application/octet-stream';

        console.log(`📤 Uploading: ${fileName}`);

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, fileContent, {
            contentType,
            upsert: true
          });

        if (error) {
          console.error(`❌ Error uploading ${fileName}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Uploaded: ${fileName}`);
          uploadedCount++;
        }

        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Error processing ${fileName}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Upload completed!`);
    console.log(`✅ Successfully uploaded: ${uploadedCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} files`);
    }

    if (uploadedCount > 0) {
      console.log('\n📝 Next steps:');
      console.log('1. Refresh your React app at http://localhost:3000');
      console.log('2. Check if images are now loading');
      console.log('3. If successful, we can upload all remaining images');
    }

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadMoreImages(); 