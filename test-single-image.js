import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSingleImage() {
  console.log('🔍 Testing single image access...');
  
  // Test with a specific image we know exists
  const testImage = '2m_black_verso_230pix.png';
  
  console.log(`Testing image: ${testImage}`);
  
  try {
    // Try to get the public URL
    const { data } = supabase.storage.from('assets').getPublicUrl(testImage);
    console.log('✅ Generated URL:', data.publicUrl);
    
    // Try to check if the file exists
    const { data: fileData, error } = await supabase.storage
      .from('assets')
      .list('', {
        limit: 1000
      });
    
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📊 Total files in storage: ${fileData?.length || 0}`);
    
    // Check if our test file exists
    const fileExists = fileData?.some(file => file.name === testImage);
    console.log(`🔍 File "${testImage}" exists: ${fileExists ? 'YES' : 'NO'}`);
    
    if (fileExists) {
      console.log('✅ File exists in storage');
    } else {
      console.log('❌ File does not exist in storage');
      console.log('📋 First 10 files in storage:');
      fileData?.slice(0, 10).forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSingleImage().catch(console.error); 