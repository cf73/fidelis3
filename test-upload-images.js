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

async function testUploadImages() {
  console.log('🚀 Testing image upload to Supabase Storage...\n');

  try {
    // Get just a few image files for testing
    const testFiles = [
      'assets/260d_black_1370x590-1340x577.png',  // Product image
      'assets/roon-logo.png',                      // Manufacturer logo
      'assets/sonus-faber-logo.png'                // Another manufacturer logo
    ];

    console.log(`📁 Testing upload of ${testFiles.length} files\n`);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const filePath of testFiles) {
      try {
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found: ${filePath}`);
          continue;
        }

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
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Test upload completed!`);
    console.log(`✅ Successfully uploaded: ${uploadedCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} files`);
    }

    if (uploadedCount > 0) {
      console.log('\n📝 Next steps:');
      console.log('1. Update the getImageUrl function to use Supabase Storage URLs');
      console.log('2. Test the React app to see if images load from Supabase');
      console.log('3. If successful, we can upload all images');
    }

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

testUploadImages(); 