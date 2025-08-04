const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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