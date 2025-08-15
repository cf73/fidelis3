import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixReviewsMigration() {
  try {
    console.log('🔧 Fixing reviews migration...');
    
    // Get products that have reviews_set as a string (incorrect format)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, slug, reivews_set')
      .not('reivews_set', 'is', null)
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`📋 Found ${products.length} products with reviews_set field`);
    
    for (const product of products) {
      console.log(`\n🔍 Processing: ${product.title}`);
      console.log(`   Type: ${typeof product.reivews_set}`);
      console.log(`   Value: ${product.reivews_set ? product.reivews_set.substring(0, 100) + '...' : 'null'}`);
      
      // If reivews_set is a string, it means the migration went wrong
      if (typeof product.reivews_set === 'string') {
        console.log(`   ❌ Reviews are stored as string, need to fix`);
        
        // Clear the incorrect string data
        const { error: updateError } = await supabase
          .from('products')
          .update({ reivews_set: null })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ Error clearing reviews for ${product.title}:`, updateError);
        } else {
          console.log(`   ✅ Cleared incorrect reviews data`);
        }
      } else if (Array.isArray(product.reivews_set)) {
        console.log(`   ✅ Reviews are already in correct array format`);
      }
    }
    
    console.log('\n🎯 Now re-running migration for reviews only...');
    
    // Re-run the migration script to properly populate reviews
    // This will need to be done by re-running the original migration script
    // but we'll need to modify it to only update reviews, not overwrite content/specs
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixReviewsMigration();

