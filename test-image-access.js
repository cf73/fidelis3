// test-image-access.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testImageAccess() {
  console.log('🔍 Testing image access...\n');

  try {
    // List files in the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 50
      });

    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }

    console.log(`📁 Found ${files.length} files in images bucket:`);
    files.forEach(file => {
      console.log(`   - ${file.name} (${file.size} bytes)`);
    });

    // Test a few specific news images
    const testImages = [
      'TD_1601_Nussbaum_72.jpg',
      'degritter.jpg',
      'IMG_5386.JPG',
      'mha200-angle-left-1614605891.jpg'
    ];

    console.log('\n🔍 Testing specific image URLs:');
    for (const imageName of testImages) {
      const imageUrl = supabase.storage.from('images').getPublicUrl(imageName).data.publicUrl;
      console.log(`\n   Testing: ${imageName}`);
      console.log(`   URL: ${imageUrl}`);
      
      // Check if the file exists in our list
      const exists = files.some(file => file.name === imageName);
      console.log(`   Exists in bucket: ${exists ? '✅ Yes' : '❌ No'}`);
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testImageAccess();
