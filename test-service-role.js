import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Try with service role key for higher permissions
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations


if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '❌');
  console.error('\nPlease check your .env file and ensure both variables are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testServiceRole() {
  console.log('🔍 Testing storage access with service role key...');
  
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error);
      return;
    }
    
    console.log(`📊 Found ${buckets?.length || 0} buckets:`);
    buckets?.forEach((bucket, index) => {
      console.log(`  ${index + 1}. ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Try to list files from assets bucket specifically
    console.log('\n🔍 Checking assets bucket specifically...');
    try {
      const { data: files, error: filesError } = await supabase.storage
        .from('assets')
        .list('', {
          limit: 10,
          offset: 0
        });
      
      if (filesError) {
        console.error('❌ Error listing files in assets bucket:', filesError);
      } else {
        console.log(`📊 Found ${files?.length || 0} files in assets bucket:`);
        files?.slice(0, 5).forEach((file, index) => {
          console.log(`  ${index + 1}. ${file.name}`);
        });
        if (files && files.length > 5) {
          console.log(`  ... and ${files.length - 5} more files`);
        }
      }
    } catch (error) {
      console.error('❌ Error accessing assets bucket:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testServiceRole().catch(console.error); 