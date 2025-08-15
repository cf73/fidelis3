import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDac1Reviews() {
  try {
    console.log('🔍 Testing DAC-1 reviews specifically...');
    
    // Get the DAC-1 product by slug
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'dac1-reference')
      .eq('published', true)
      .single();
    
    if (error) {
      console.error('❌ Error fetching DAC-1:', error);
      return;
    }
    
    if (!product) {
      console.log('❌ DAC-1 product not found');
      return;
    }
    
    console.log(`✅ Found DAC-1: ${product.title}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Has content: ${!!product.content}`);
    console.log(`   Has specs: ${!!product.specs}`);
    console.log(`   Has reviews_set: ${!!product.reivews_set}`);
    console.log(`   Reviews type: ${typeof product.reivews_set}`);
    
    if (product.reivews_set) {
      if (Array.isArray(product.reivews_set)) {
        console.log(`   Reviews array length: ${product.reivews_set.length}`);
        if (product.reivews_set.length > 0) {
          console.log(`   First review:`, product.reivews_set[0]);
        }
      } else {
        console.log(`   Reviews value: ${product.reivews_set.substring(0, 200)}...`);
      }
    }
    
    // Also check by ID to make sure we're looking at the right product
    console.log('\n🔍 Checking by ID...');
    const { data: productById, error: idError } = await supabase
      .from('products')
      .select('id, title, slug, reivews_set')
      .eq('id', '36acdcc0-1173-46f8-bf31-4e2739d4ac9f') // DAC-1 ID from migration
      .single();
    
    if (idError) {
      console.error('❌ Error fetching by ID:', idError);
    } else if (productById) {
      console.log(`✅ Found by ID: ${productById.title}`);
      console.log(`   Reviews type: ${typeof productById.reivews_set}`);
      if (Array.isArray(productById.reivews_set)) {
        console.log(`   Reviews count: ${productById.reivews_set.length}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDac1Reviews();
