import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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