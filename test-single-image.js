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