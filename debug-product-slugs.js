import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProductSlugs() {
  console.log('🔍 Checking product slugs...');
  
  // Get all products with their slugs
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, slug')
    .order('title');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Found ${products?.length || 0} products:`);
  
  // Check for problematic slugs
  const problematicSlugs = products?.filter(product => {
    return !product.slug || 
           product.slug === '' || 
           product.slug === 'undefined' || 
           product.slug === 'null' ||
           product.slug.includes('undefined');
  });
  
  if (problematicSlugs && problematicSlugs.length > 0) {
    console.log(`❌ Found ${problematicSlugs.length} products with problematic slugs:`);
    problematicSlugs.forEach(product => {
      console.log(`  - ${product.title} (ID: ${product.id}, slug: "${product.slug}")`);
    });
  } else {
    console.log('✅ All products have valid slugs');
  }
  
  // Show first 10 products as examples
  console.log('\n📋 First 10 products:');
  products?.slice(0, 10).forEach(product => {
    console.log(`  - ${product.title} (slug: "${product.slug}")`);
  });
}

debugProductSlugs().catch(console.error); 