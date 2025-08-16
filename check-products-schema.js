import { createClient } from '@supabase/supabase-js';

// Supabase configuration
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

async function checkProductsSchema() {
  try {
    console.log('🔍 Checking products table schema...');
    
    // Get a sample product to see the structure
    const { data: sampleProduct, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching sample product:', error);
      return;
    }
    
    if (sampleProduct && sampleProduct.length > 0) {
      console.log('📋 Products table columns:');
      const product = sampleProduct[0];
      Object.keys(product).forEach(key => {
        const value = product[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`   - ${key}: ${type} ${value ? `(${value})` : '(null/empty)'}`);
      });
    } else {
      console.log('⚠️  No products found in database');
    }
    
    // Check if reviews_set column exists by trying to select it
    const { data: reviewsTest, error: reviewsError } = await supabase
      .from('products')
      .select('reviews_set')
      .limit(1);
    
    if (reviewsError) {
      console.log('❌ reviews_set column does not exist:', reviewsError.message);
    } else {
      console.log('✅ reviews_set column exists');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkProductsSchema();

