import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

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

