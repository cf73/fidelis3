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

async function deleteExcessProducts() {
  console.log('🗑️  Deleting excess products...\n');
  
  try {
    // Get all products ordered by creation date
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`Found ${products.length} products`);
    
    if (products.length <= 356) {
      console.log('✅ Products count is already correct or below target');
      return;
    }
    
    // Keep only the first 356 products
    const productsToKeep = products.slice(0, 356);
    const productsToDelete = products.slice(356);
    
    console.log(`Keeping first ${productsToKeep.length} products`);
    console.log(`Deleting ${productsToDelete.length} excess products`);
    
    // Delete excess products in batches
    const batchSize = 100;
    for (let i = 0; i < productsToDelete.length; i += batchSize) {
      const batch = productsToDelete.slice(i, i + batchSize);
      const idsToDelete = batch.map(p => p.id);
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) {
        console.error(`❌ Error deleting batch ${i/batchSize + 1}:`, deleteError);
      } else {
        console.log(`✅ Deleted batch ${i/batchSize + 1} (${batch.length} products)`);
      }
    }
    
    // Verify final count
    const { count: finalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n🎉 Final products count: ${finalCount} (expected: 356)`);
    
  } catch (error) {
    console.error('❌ Error deleting excess products:', error);
  }
}

deleteExcessProducts(); 