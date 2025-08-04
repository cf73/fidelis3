import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductCount() {
  console.log('🔍 Checking total product count in Supabase...\n');
  
  // Get total count
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('❌ Error getting count:', countError);
    return;
  }
  
  console.log(`📊 Total products in database: ${count}`);
  
  // Get first 50 products to see what we're getting
  const { data: products, error } = await supabase
    .from('products')
    .select('title, slug')
    .order('title')
    .limit(50);
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`\n📦 First ${products.length} products:`);
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title} (${product.slug})`);
  });
  
  // Check if there are more products
  if (count > 50) {
    console.log(`\n⚠️  There are ${count} total products but only showing first 50.`);
    console.log('This suggests Supabase has a default limit of 50 rows.');
  }
}

checkProductCount(); 