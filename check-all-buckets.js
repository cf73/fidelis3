// check-all-buckets.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAllBuckets() {
  console.log('🔍 Checking all buckets and permissions...\n');

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

    // Test each bucket
    for (const bucket of buckets) {
      console.log(`\n📁 Testing bucket: ${bucket.name}`);
      
      const { data: files, error } = await supabase.storage
        .from(bucket.name)
        .list('', {
          limit: 10
        });

      if (error) {
        console.log(`   ❌ Error accessing ${bucket.name}: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${files.length} files in ${bucket.name}:`);
        files.forEach(file => {
          console.log(`     - ${file.name} (${file.size} bytes)`);
        });
      }
    }

    // Test if we can access the images bucket with different methods
    console.log('\n🔍 Testing images bucket access:');
    
    // Method 1: Direct list
    const { data: directList, error: directError } = await supabase.storage
      .from('images')
      .list('');

    console.log(`   Direct list: ${directError ? '❌ Error' : `✅ ${directList?.length || 0} files`}`);
    if (directError) console.log(`     Error: ${directError.message}`);

    // Method 2: Try to get a specific file
    const { data: testFile, error: testError } = await supabase.storage
      .from('images')
      .getPublicUrl('test.jpg');

    console.log(`   Public URL test: ${testError ? '❌ Error' : '✅ Works'}`);
    if (testError) console.log(`     Error: ${testError.message}`);

  } catch (error) {
    console.error('❌ Error during bucket check:', error);
  }
}

// Run the check
checkAllBuckets();
