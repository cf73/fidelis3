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

async function checkProductCount() {
  console.log('🔍 Checking total product count in Supabase...\n');
  
  // Get total count
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('❌ Error getting count:', countError);
    return;
  }
  
  console.log(`📊 Total products in database: ${count}`);
  
  // Get first 50 products to see what we're getting
  const { data: products, error } = await supabase
    .from('products')
    .select('title, slug')
    .order('title')
    .limit(50);
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`\n📦 First ${products.length} products:`);
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title} (${product.slug})`);
  });
  
  // Check if there are more products
  if (count > 50) {
    console.log(`\n⚠️  There are ${count} total products but only showing first 50.`);
    console.log('This suggests Supabase has a default limit of 50 rows.');
  }
}

checkProductCount(); 