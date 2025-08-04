import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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