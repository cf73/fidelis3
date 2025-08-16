import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseImages() {
  console.log('🔍 Testing Supabase Storage Images...\n');
  
  try {
    // List files in the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📁 Found ${files.length} files in images bucket:\n`);
    
    // Show first 20 files
    files.slice(0, 20).forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${file.metadata?.size || 'unknown size'} bytes)`);
    });
    
    if (files.length > 20) {
      console.log(`... and ${files.length - 20} more files`);
    }
    
    // Test a specific image URL
    const testImage = '121retale.2.jpg';
    const testUrl = supabase.storage.from('images').getPublicUrl(testImage).data.publicUrl;
    console.log(`\n🔗 Test URL for ${testImage}:`);
    console.log(testUrl);
    
    // Test another image
    const testImage2 = 'hailey-1630593782.png';
    const testUrl2 = supabase.storage.from('images').getPublicUrl(testImage2).data.publicUrl;
    console.log(`\n🔗 Test URL for ${testImage2}:`);
    console.log(testUrl2);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSupabaseImages().catch(console.error); 