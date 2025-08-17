const { createClient } = require('@supabase/supabase-js');

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

async function fixProducts() {
  console.log('🔧 Fixing products table...\n');
  
  try {
    // Get all products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`Found ${products.length} products`);
    
    // Group by title and manufacturer
    const seen = new Set();
    const duplicates = [];
    
    products.forEach(product => {
      const key = `${product.title}-${product.manufacturer}`;
      if (seen.has(key)) {
        duplicates.push(product.id);
      } else {
        seen.add(key);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicates`);
    
    // Delete duplicates in smaller batches
    const batchSize = 100;
    for (let i = 0; i < duplicates.length; i += batchSize) {
      const batch = duplicates.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`❌ Error deleting batch ${i/batchSize + 1}:`, deleteError);
      } else {
        console.log(`✅ Deleted batch ${i/batchSize + 1} (${batch.length} records)`);
      }
    }
    
    console.log('\n🎉 Products table fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing products:', error);
  }
}

fixProducts(); 