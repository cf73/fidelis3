import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findDac1Product() {
  try {
    console.log('🔍 Searching for DAC-1 product...');
    
    // Search for products with "dac" in the title or slug
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, slug, published, reivews_set')
      .or('title.ilike.%dac%,slug.ilike.%dac%')
      .limit(10);
    
    if (error) {
      console.error('❌ Error searching products:', error);
      return;
    }
    
    console.log(`📋 Found ${products.length} DAC-related products:`);
    products.forEach(product => {
      console.log(`   - ${product.title} (${product.slug}) - Published: ${product.published}`);
      if (product.reivews_set) {
        const isArray = Array.isArray(product.reivews_set);
        const count = isArray ? product.reivews_set.length : 0;
        console.log(`     Reviews: ${isArray ? '✅' : '❌'} Array with ${count} reviews`);
      } else {
        console.log(`     Reviews: ❌ None`);
      }
    });
    
    // Also check the specific ID from migration
    console.log('\n🔍 Checking specific DAC-1 ID from migration...');
    const { data: dac1ById, error: idError } = await supabase
      .from('products')
      .select('id, title, slug, published, reivews_set')
      .eq('id', '36acdcc0-1173-46f8-bf31-4e2739d4ac9f')
      .single();
    
    if (idError) {
      console.error('❌ Error fetching by ID:', idError);
    } else if (dac1ById) {
      console.log(`✅ Found by ID: ${dac1ById.title} (${dac1ById.slug})`);
      console.log(`   Published: ${dac1ById.published}`);
      if (dac1ById.reivews_set) {
        const isArray = Array.isArray(dac1ById.reivews_set);
        const count = isArray ? dac1ById.reivews_set.length : 0;
        console.log(`   Reviews: ${isArray ? '✅' : '❌'} Array with ${count} reviews`);
        if (isArray && count > 0) {
          console.log(`   First review excerpt: ${dac1ById.reivews_set[0].excerpt?.substring(0, 100)}...`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Search failed:', error);
  }
}

findDac1Product();

