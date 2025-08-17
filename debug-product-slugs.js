import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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