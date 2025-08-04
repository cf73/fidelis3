import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorageFilenames() {
  console.log('🔍 Checking Supabase Storage filenames...');
  
  try {
    // List files in the assets bucket
    const { data: files, error } = await supabase.storage
      .from('assets')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    if (error) {
      console.error('❌ Error listing storage files:', error);
      return;
    }
    
    console.log(`📊 Found ${files?.length || 0} files in storage:`);
    
    // Show first 20 files as examples
    console.log('\n📋 First 20 files in storage:');
    files?.slice(0, 20).forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name}`);
    });
    
    // Get some products with image references
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image')
      .not('product_hero_image', 'is', null)
      .limit(10);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    console.log('\n📋 Sample product image references:');
    products?.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title}: "${product.product_hero_image}"`);
    });
    
    // Check if any product image references exist in storage
    console.log('\n🔍 Checking if product image references exist in storage...');
    let foundCount = 0;
    let missingCount = 0;
    
    for (const product of products || []) {
      if (product.product_hero_image) {
        const exists = files?.some(file => file.name === product.product_hero_image);
        if (exists) {
          console.log(`  ✅ Found: ${product.product_hero_image}`);
          foundCount++;
        } else {
          console.log(`  ❌ Missing: ${product.product_hero_image}`);
          missingCount++;
        }
      }
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total files in storage: ${files?.length || 0}`);
    console.log(`  Product images found in storage: ${foundCount}`);
    console.log(`  Product images missing from storage: ${missingCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStorageFilenames().catch(console.error); 