import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNullSlugs() {
  console.log('🔍 Checking for products with NULL slugs...');
  
  // Check products with NULL slugs
  const { data: nullSlugProducts, error: productsError } = await supabase
    .from('products')
    .select('id, title, slug')
    .is('slug', null);
  
  if (productsError) {
    console.error('Error checking products:', productsError);
    return;
  }
  
  console.log(`📊 Found ${nullSlugProducts?.length || 0} products with NULL slugs:`);
  if (nullSlugProducts && nullSlugProducts.length > 0) {
    nullSlugProducts.forEach(product => {
      console.log(`  - ${product.title} (ID: ${product.id})`);
    });
  }
  
  // Check manufacturers with NULL slugs
  const { data: nullSlugManufacturers, error: manufacturersError } = await supabase
    .from('manufacturers')
    .select('id, title, slug')
    .is('slug', null);
  
  if (manufacturersError) {
    console.error('Error checking manufacturers:', manufacturersError);
    return;
  }
  
  console.log(`📊 Found ${nullSlugManufacturers?.length || 0} manufacturers with NULL slugs:`);
  if (nullSlugManufacturers && nullSlugManufacturers.length > 0) {
    nullSlugManufacturers.forEach(manufacturer => {
      console.log(`  - ${manufacturer.title} (ID: ${manufacturer.id})`);
    });
  }
  
  // Check total counts
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalManufacturers } = await supabase
    .from('manufacturers')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📈 Summary:`);
  console.log(`  Total products: ${totalProducts}`);
  console.log(`  Products with NULL slugs: ${nullSlugProducts?.length || 0}`);
  console.log(`  Total manufacturers: ${totalManufacturers}`);
  console.log(`  Manufacturers with NULL slugs: ${nullSlugManufacturers?.length || 0}`);
}

checkNullSlugs().catch(console.error); 