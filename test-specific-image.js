import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSpecificImage() {
  const testImage = 'sutherland-2020-hero-1200x500.jpg';
  console.log(`🧪 Testing specific image: ${testImage}`);
  
  try {
    // Test 1: Check if file exists in bucket
    console.log('\n1️⃣ Checking if file exists in bucket...');
    const { data: files, error: listError } = await supabase.storage
      .from('assets')
      .list('', { limit: 1000 });
    
    if (listError) {
      console.error('❌ Error listing files:', listError);
    } else {
      const fileExists = files?.some(f => f.name === testImage);
      console.log(`📊 File exists in bucket: ${fileExists ? 'YES' : 'NO'}`);
      console.log(`📊 Total files in bucket: ${files?.length || 0}`);
    }
    
    // Test 2: Try to download the file
    console.log('\n2️⃣ Trying to download file...');
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('assets')
      .download(testImage);
    
    if (downloadError) {
      console.log(`❌ Download error: ${downloadError.message}`);
    } else {
      console.log(`✅ File downloaded successfully (${fileData?.size || 'unknown'} bytes)`);
    }
    
    // Test 3: Check the public URL
    console.log('\n3️⃣ Checking public URL...');
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(testImage);
    const publicUrl = urlData.publicUrl;
    console.log(`🌐 Public URL: ${publicUrl}`);
    
    // Test 4: Fetch the image with different cache headers
    console.log('\n4️⃣ Testing with different cache headers...');
    
    // Test with no-cache
    const noCacheResponse = await fetch(publicUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log(`📡 No-cache response: ${noCacheResponse.status} ${noCacheResponse.statusText}`);
    console.log(`📏 Content-Length: ${noCacheResponse.headers.get('content-length') || 'unknown'}`);
    
    // Test with normal request
    const normalResponse = await fetch(publicUrl);
    console.log(`📡 Normal response: ${normalResponse.status} ${normalResponse.statusText}`);
    console.log(`📏 Content-Length: ${normalResponse.headers.get('content-length') || 'unknown'}`);
    
    // Test 5: Check if it's a cached response
    console.log('\n5️⃣ Checking cache headers...');
    const cacheControl = normalResponse.headers.get('cache-control');
    const etag = normalResponse.headers.get('etag');
    const lastModified = normalResponse.headers.get('last-modified');
    
    console.log(`🏷️  Cache-Control: ${cacheControl || 'none'}`);
    console.log(`🏷️  ETag: ${etag || 'none'}`);
    console.log(`🏷️  Last-Modified: ${lastModified || 'none'}`);
    
    // Test 6: Try to force a fresh request
    console.log('\n6️⃣ Testing with random query parameter...');
    const freshUrl = `${publicUrl}?t=${Date.now()}`;
    const freshResponse = await fetch(freshUrl);
    console.log(`📡 Fresh response: ${freshResponse.status} ${freshResponse.statusText}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSpecificImage().catch(console.error); 