import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations


if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '❌');
  console.error('\nPlease check your .env file and ensure both variables are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRlsStatus() {
  console.log('🔍 Checking RLS status on storage tables...');
  
  try {
    // Check if we can list buckets
    console.log('\n1️⃣ Testing bucket listing...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
    } else {
      console.log(`✅ Can list buckets: ${buckets?.length || 0} buckets found`);
      if (buckets && buckets.length > 0) {
        buckets.forEach((bucket, index) => {
          console.log(`  ${index + 1}. ${bucket.name} (public: ${bucket.public})`);
        });
      }
    }
    
    // Check if we can create a bucket
    console.log('\n2️⃣ Testing bucket creation...');
    const testBucketName = `test-bucket-${Date.now()}`;
    
    const { data: newBucket, error: createError } = await supabase.storage
      .createBucket(testBucketName, {
        public: true
      });
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError);
    } else {
      console.log(`✅ Successfully created bucket: ${testBucketName}`);
      
      // Clean up - delete the test bucket
      const { error: deleteError } = await supabase.storage
        .deleteBucket(testBucketName);
      
      if (deleteError) {
        console.log(`⚠️  Could not delete test bucket: ${deleteError.message}`);
      } else {
        console.log(`✅ Successfully deleted test bucket: ${testBucketName}`);
      }
    }
    
    // Check if we can upload to existing bucket
    console.log('\n3️⃣ Testing upload to assets bucket...');
    const testContent = 'test content';
    
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload('test-file.txt', testContent, {
        contentType: 'text/plain'
      });
    
    if (uploadError) {
      console.error('❌ Error uploading to assets bucket:', uploadError);
    } else {
      console.log('✅ Successfully uploaded to assets bucket');
      
      // Clean up - delete the test file
      const { error: deleteFileError } = await supabase.storage
        .from('assets')
        .remove(['test-file.txt']);
      
      if (deleteFileError) {
        console.log(`⚠️  Could not delete test file: ${deleteFileError.message}`);
      } else {
        console.log('✅ Successfully deleted test file');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkRlsStatus().catch(console.error); 