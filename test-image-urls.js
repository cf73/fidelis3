import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

function getImageUrl(imagePath) {
  if (!imagePath) {
    console.log('⚠️  No image path provided');
    return '';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    console.log('🌐 Using full URL:', imagePath);
    return imagePath;
  }
  
  // Use Supabase client's getPublicUrl method
  const cleanPath = imagePath.replace(/^\/+/, '');
  const { data } = supabase.storage.from('assets').getPublicUrl(cleanPath);
  console.log('🖼️  Generated image URL:', data.publicUrl);
  return data.publicUrl;
}

async function testImageUrls() {
  console.log('🧪 Testing image URL generation...');
  
  // Test with some sample image paths from the database
  const testImages = [
    '1151-pair-background-copy-650x317.jpg',
    'logo-moon.jpg',
    '2m_bronze_verso_230pix.png',
    '250i_v2_Black_1370x590.png'
  ];
  
  console.log('\n📋 Testing URLs for sample images:');
  testImages.forEach((imagePath, index) => {
    console.log(`\n${index + 1}. Testing: ${imagePath}`);
    const url = getImageUrl(imagePath);
    console.log(`   Generated URL: ${url}`);
    
    // Test if the URL is accessible
    fetch(url)
      .then(response => {
        console.log(`   Status: ${response.status} ${response.statusText}`);
        if (response.ok) {
          console.log(`   ✅ Image accessible!`);
        } else {
          console.log(`   ❌ Image not accessible`);
        }
      })
      .catch(error => {
        console.log(`   ❌ Error accessing image: ${error.message}`);
      });
  });
  
  // Also test what happens when we try to access the assets bucket
  console.log('\n🪣 Testing assets bucket access...');
  try {
    const { data: files, error } = await supabase.storage
      .from('assets')
      .list('', { limit: 5 });
    
    if (error) {
      console.log(`❌ Error listing assets bucket: ${error.message}`);
    } else {
      console.log(`✅ Assets bucket exists with ${files?.length || 0} files`);
      if (files && files.length > 0) {
        console.log('📋 Sample files:', files.map(f => f.name).join(', '));
      }
    }
  } catch (error) {
    console.log(`❌ Error accessing assets bucket: ${error.message}`);
  }
}

testImageUrls().catch(console.error); 