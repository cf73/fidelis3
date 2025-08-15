import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductReviews() {
  try {
    console.log('🔍 Testing product reviews...');
    
    // Get a few products that should have reviews
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, slug, reivews_set')
      .not('reivews_set', 'is', null)
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`📋 Found ${products.length} products with reviews:`);
    products.forEach(product => {
      console.log(`\n   - ${product.title} (${product.slug}):`);
      console.log(`     Reviews: ${product.reivews_set ? product.reivews_set.length : 0} reviews`);
      if (product.reivews_set && product.reivews_set.length > 0) {
        product.reivews_set.forEach((review, index) => {
          console.log(`       Review ${index + 1}:`);
          console.log(`         Excerpt: ${review.excerpt ? review.excerpt.substring(0, 100) + '...' : 'No excerpt'}`);
          console.log(`         Attribution: ${review.attribution || 'No attribution'}`);
          console.log(`         Link: ${review.link || 'No link'}`);
          console.log(`         Date: ${review.date_of_review || 'No date'}`);
        });
      }
    });
    
    // Test the exact query that getProductBySlug uses
    console.log('\n🔍 Testing getProductBySlug query...');
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        categories:product_categories!products_category_id_fkey(id, name, slug),
        manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
      `)
      .eq('slug', 'dac-1')
      .eq('published', true)
      .single();
    
    if (productError) {
      console.error('❌ Error fetching product by slug:', productError);
    } else {
      console.log(`✅ Product fetched: ${product.title}`);
      console.log(`   Reviews: ${product.reivews_set ? product.reivews_set.length : 0} reviews`);
      console.log(`   All fields:`, Object.keys(product));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProductReviews();

