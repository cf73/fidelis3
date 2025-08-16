// check-supabase-storage.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSupabaseStorage() {
  console.log('🔍 Checking Supabase storage...\n');

  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }

    console.log('📦 Available buckets:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    // Check the 'images' bucket
    console.log('\n📁 Checking "images" bucket:');
    const { data: imagesList, error: imagesError } = await supabase.storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (imagesError) {
      console.error('❌ Error listing images bucket:', imagesError);
    } else {
      console.log(`   Found ${imagesList.length} files in images bucket:`);
      imagesList.forEach(file => {
        console.log(`   - ${file.name} (${file.size} bytes)`);
      });
    }

    // Check if there's an 'assets' bucket
    console.log('\n📁 Checking "assets" bucket:');
    const { data: assetsList, error: assetsError } = await supabase.storage
      .from('assets')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (assetsError) {
      console.log('   ❌ Assets bucket not found or error:', assetsError.message);
    } else {
      console.log(`   Found ${assetsList.length} files in assets bucket:`);
      assetsList.forEach(file => {
        console.log(`   - ${file.name} (${file.size} bytes)`);
      });
    }

    // Test a few specific news images
    console.log('\n🔍 Testing specific news images:');
    const testImages = [
      'TD_1601_Nussbaum_72.jpg',
      'mha200-angle-left-1614605891.jpg',
      'IMG_5386.JPG',
      'degritter.jpg'
    ];

    for (const imageName of testImages) {
      console.log(`\n   Testing: ${imageName}`);
      
      // Try in images bucket
      const { data: imageData, error: imageError } = await supabase.storage
        .from('images')
        .list('', {
          search: imageName
        });
      
      if (imageError) {
        console.log(`     ❌ Error searching images bucket: ${imageError.message}`);
      } else if (imageData && imageData.length > 0) {
        console.log(`     ✅ Found in images bucket: ${imageData.length} matches`);
        imageData.forEach(file => console.log(`       - ${file.name}`));
      } else {
        console.log(`     ❌ Not found in images bucket`);
      }

      // Try in assets bucket
      const { data: assetData, error: assetError } = await supabase.storage
        .from('assets')
        .list('', {
          search: imageName
        });
      
      if (assetError) {
        console.log(`     ❌ Error searching assets bucket: ${assetError.message}`);
      } else if (assetData && assetData.length > 0) {
        console.log(`     ✅ Found in assets bucket: ${assetData.length} matches`);
        assetData.forEach(file => console.log(`       - ${file.name}`));
      } else {
        console.log(`     ❌ Not found in assets bucket`);
      }
    }

  } catch (error) {
    console.error('❌ Error during storage check:', error);
  }
}

// Run the check
checkSupabaseStorage();
