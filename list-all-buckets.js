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

async function listAllBuckets() {
  console.log('🪣 Listing all available buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error);
      return;
    }
    
    console.log(`📊 Found ${buckets?.length || 0} buckets:`);
    
    if (buckets && buckets.length > 0) {
      buckets.forEach((bucket, index) => {
        console.log(`  ${index + 1}. ${bucket.name}`);
        console.log(`     Public: ${bucket.public}`);
        console.log(`     Created: ${bucket.created_at}`);
        console.log(`     Updated: ${bucket.updated_at}`);
        console.log('');
      });
    } else {
      console.log('📭 No buckets found');
    }
    
    // Also try to check if specific bucket names exist
    const testBuckets = ['assets', 'images', 'media', 'files', 'uploads'];
    
    console.log('\n🧪 Testing specific bucket names:');
    for (const bucketName of testBuckets) {
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 });
        
        if (listError) {
          console.log(`  ❌ ${bucketName}: ${listError.message}`);
        } else {
          console.log(`  ✅ ${bucketName}: Bucket exists (${files?.length || 0} files)`);
        }
      } catch (error) {
        console.log(`  ❌ ${bucketName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listAllBuckets().catch(console.error); 