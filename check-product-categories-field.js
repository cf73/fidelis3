import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProductCategoriesField() {
  console.log('🔍 Checking product-categories field...\n');

  try {
    // Get products with the product-categories field
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, "product-categories"')
      .not('product-categories', 'is', null)
      .limit(20);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Found ${products?.length || 0} products with product-categories field`);

    if (products && products.length > 0) {
      console.log('\n📋 Sample products with product-categories:');
      products.forEach(product => {
        console.log(`  - ${product.title}: ${JSON.stringify(product['product-categories'])}`);
      });
    }

    // Get all unique product-categories values
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('"product-categories"')
      .not('product-categories', 'is', null);

    if (allError) {
      console.error('❌ Error fetching all products:', allError);
      return;
    }

    const uniqueCategories = new Set();
    allProducts?.forEach(product => {
      const categories = product['product-categories'];
      if (Array.isArray(categories)) {
        categories.forEach(cat => uniqueCategories.add(cat));
      } else if (categories) {
        uniqueCategories.add(categories);
      }
    });

    console.log('\n📋 Unique product-categories values:');
    Array.from(uniqueCategories).sort().forEach(cat => {
      console.log(`  - "${cat}"`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkProductCategoriesField(); 