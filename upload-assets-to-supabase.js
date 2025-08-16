import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import mime from 'mime';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'assets';

async function uploadAssets() {
  console.log('🚀 Starting asset upload to Supabase Storage...\n');

  try {
    // Get all files from the assets directory
    const assetFiles = await fg(['assets/**/*.*'], { 
      dot: false,
      ignore: ['**/node_modules/**', '**/.git/**']
    });

    console.log(`📁 Found ${assetFiles.length} files to upload\n`);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const filePath of assetFiles) {
      try {
        const relativePath = path.relative('assets', filePath).replace(/\\/g, '/');
        const fileContent = fs.readFileSync(filePath);
        const contentType = mime.getType(filePath) || 'application/octet-stream';

        console.log(`📤 Uploading: ${relativePath}`);

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(relativePath, fileContent, {
            contentType,
            upsert: true
          });

        if (error) {
          console.error(`❌ Error uploading ${relativePath}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Uploaded: ${relativePath}`);
          uploadedCount++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Upload completed!`);
    console.log(`✅ Successfully uploaded: ${uploadedCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} files`);
    }

    // Update the getImageUrl function to use Supabase Storage URLs
    console.log('\n📝 Next steps:');
    console.log('1. Update the getImageUrl function in react/src/lib/supabase.ts');
    console.log('2. Replace placeholder URLs with actual Supabase Storage URLs');
    console.log('3. Test the React app to see the actual images');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadAssets(); 