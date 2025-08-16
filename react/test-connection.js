const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as the import script
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