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

async function checkBucketContents() {
  console.log('🪣 Checking assets bucket contents...');
  
  try {
    // List all files in the assets bucket
    const { data: files, error } = await supabase.storage
      .from('assets')
      .list('', {
        limit: 1000
      });
    
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📊 Found ${files?.length || 0} files in assets bucket`);
    
    if (files && files.length > 0) {
      console.log('\n📋 Files in bucket:');
      files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
      });
    } else {
      console.log('📭 Bucket is empty');
    }
    
    // Test a few specific files that we know exist
    const testFiles = [
      '1151-pair-background-copy-650x317.jpg',
      'logo-moon.jpg',
      '2m_bronze_verso_230pix.png'
    ];
    
    console.log('\n🧪 Testing specific files:');
    for (const fileName of testFiles) {
      try {
        const { data, error } = await supabase.storage
          .from('assets')
          .download(fileName);
        
        if (error) {
          console.log(`  ❌ ${fileName}: ${error.message}`);
        } else {
          console.log(`  ✅ ${fileName}: File exists (${data?.size || 'unknown'} bytes)`);
        }
      } catch (err) {
        console.log(`  ❌ ${fileName}: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBucketContents().catch(console.error); 