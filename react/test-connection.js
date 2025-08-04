const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as the import script
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Test manufacturers
    const { data: manufacturers, error: mfrError } = await supabase
      .from('manufacturers')
      .select('count')
      .limit(1);
    
    console.log('Manufacturers table:', mfrError ? '❌ Error' : '✅ Connected');
    if (mfrError) console.log('Error:', mfrError.message);
    
    // Test products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    console.log('Products table:', prodError ? '❌ Error' : '✅ Connected');
    if (prodError) console.log('Error:', prodError.message);
    
    // Test news
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('count')
      .limit(1);
    
    console.log('News table:', newsError ? '❌ Error' : '✅ Connected');
    if (newsError) console.log('Error:', newsError.message);
    
    // Get actual counts
    console.log('\n📊 Checking data counts...');
    
    const { count: mfrCount } = await supabase
      .from('manufacturers')
      .select('*', { count: 'exact', head: true });
    
    const { count: prodCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    const { count: newsCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Manufacturers: ${mfrCount || 0} records`);
    console.log(`Products: ${prodCount || 0} records`);
    console.log(`News: ${newsCount || 0} records`);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection(); 