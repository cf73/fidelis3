import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the React app
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicateSlugs() {
  console.log('🔧 Fixing duplicate slug issue...\n');

  try {
    // Get the two products with slug "duo"
    const { data: duoProducts, error } = await supabase
      .from('products')
      .select('id, title, slug, created_at')
      .eq('slug', 'duo')
      .order('created_at');

    if (error) {
      console.error('❌ Error fetching products with slug "duo":', error);
      return;
    }

    if (duoProducts.length !== 2) {
      console.log(`⚠️  Expected 2 products with slug "duo", found ${duoProducts.length}`);
      return;
    }

    console.log('📋 Found duplicate products:');
    duoProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} (ID: ${product.id}, Created: ${product.created_at})`);
    });

    // Update the second (newer) product to have a unique slug
    const secondProduct = duoProducts[1];
    const newSlug = 'duo-2';

    console.log(`\n🔄 Updating product ${secondProduct.id} to have slug "${newSlug}"...`);

    const { error: updateError } = await supabase
      .from('products')
      .update({ slug: newSlug })
      .eq('id', secondProduct.id);

    if (updateError) {
      console.error('❌ Error updating product slug:', updateError);
      return;
    }

    console.log('✅ Successfully updated product slug!');

    // Verify the fix
    const { data: verifyProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, title, slug')
      .in('slug', ['duo', 'duo-2'])
      .order('slug');

    if (verifyError) {
      console.error('❌ Error verifying fix:', verifyError);
      return;
    }

    console.log('\n✅ Verification - Products with "duo" slugs:');
    verifyProducts.forEach(product => {
      console.log(`   - ${product.title} (slug: ${product.slug})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixDuplicateSlugs(); 