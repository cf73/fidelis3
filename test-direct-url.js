// test-direct-url.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testDirectUrls() {
  console.log('🔍 Testing direct image URLs...\n');

  try {
    // Test a few specific news images with direct URLs
    const testImages = [
      'TD_1601_Nussbaum_72.jpg',
      'degritter.jpg',
      'IMG_5386.JPG',
      'mha200-angle-left-1614605891.jpg'
    ];

    for (const imageName of testImages) {
      console.log(`\n📄 Testing: ${imageName}`);
      
      // Generate the public URL
      const imageUrl = supabase.storage.from('images').getPublicUrl(imageName).data.publicUrl;
      console.log(`   URL: ${imageUrl}`);
      
      // Try to fetch the image to see if it exists
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Exists: ${response.ok ? '✅ Yes' : '❌ No'}`);
      } catch (error) {
        console.log(`   Error: ${error.message}`);
      }
    }

    // Also test with some common variations
    console.log('\n🔍 Testing with different bucket names:');
    const bucketNames = ['images', 'assets', 'main', 'public'];
    
    for (const bucketName of bucketNames) {
      console.log(`\n   Testing bucket: ${bucketName}`);
      try {
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 5 });
        
        if (error) {
          console.log(`     ❌ Error: ${error.message}`);
        } else {
          console.log(`     ✅ Found ${files.length} files`);
          if (files.length > 0) {
            files.forEach(file => console.log(`       - ${file.name}`));
          }
        }
      } catch (error) {
        console.log(`     ❌ Exception: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testDirectUrls();
