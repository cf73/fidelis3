// debug-products.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProducts() {
  console.log('🔍 Debugging products table...\n');
  
  // Get all columns from the products table
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(3);
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`✅ Fetched ${products.length} products`);
  
  products.forEach((product, index) => {
    console.log(`\n${index + 1}. Product: ${product.title}`);
    console.log('   All fields:');
    
    // List all fields that contain "image" in the name
    Object.keys(product).forEach(key => {
      if (key.toLowerCase().includes('image')) {
        console.log(`     ${key}: ${product[key]}`);
      }
    });
    
    // Also show the content field which might contain the image data
    if (product.content) {
      console.log(`     content: ${product.content.substring(0, 200)}...`);
    }
    
    // Show a few other key fields
    console.log(`     filename: ${product.filename}`);
    console.log(`     slug: ${product.slug}`);
  });
}

debugProducts(); 