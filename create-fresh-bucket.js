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

async function createFreshBucket() {
  console.log('🪣 Creating fresh bucket to avoid cache issues...');
  
  try {
    // Create a new bucket with a timestamp to avoid cache conflicts
    const bucketName = `images-${Date.now()}`;
    console.log(`📝 Using bucket name: ${bucketName}`);
    
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 52428800 // 50MB limit
      });
    
    if (bucketError) {
      console.error('❌ Error creating bucket:', bucketError);
      return;
    }
    
    console.log('✅ Created fresh bucket successfully!');
    console.log(`📝 Bucket name: ${bucketName}`);
    
    // Test uploading a single file
    console.log('\n🧪 Testing upload to new bucket...');
    const testFile = 'test-image.txt';
    const testContent = 'This is a test file to verify the bucket works.';
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFile, testContent, {
        contentType: 'text/plain'
      });
    
    if (uploadError) {
      console.error('❌ Error uploading test file:', uploadError);
    } else {
      console.log('✅ Test upload successful!');
      
      // Test the public URL
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(testFile);
      console.log(`🌐 Test file URL: ${urlData.publicUrl}`);
      
      // Test fetching the file
      const response = await fetch(urlData.publicUrl);
      console.log(`📡 Test file response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ Bucket is working correctly!');
        console.log('\n📝 Next steps:');
        console.log(`1. Update react/src/lib/supabase.ts to use bucket: "${bucketName}"`);
        console.log('2. Upload all images to this new bucket');
        console.log('3. The old cached images will eventually expire');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createFreshBucket().catch(console.error); 