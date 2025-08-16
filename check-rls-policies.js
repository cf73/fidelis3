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

async function checkRLSPolicies() {
  console.log('🔍 Checking RLS policies...\n');

  try {
    // Check if RLS is enabled on products table
    const { data: productsRLS, error: productsError } = await supabase
      .from('products')
      .select('id, title')
      .limit(1);

    if (productsError) {
      console.error('❌ Error accessing products table:', productsError);
    } else {
      console.log('✅ Products table accessible with service role');
    }

    // Check if RLS is enabled on manufacturers table
    const { data: manufacturersRLS, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, name')
      .limit(1);

    if (manufacturersError) {
      console.error('❌ Error accessing manufacturers table:', manufacturersError);
    } else {
      console.log('✅ Manufacturers table accessible with service role');
    }

    // Check if RLS is enabled on product_categories table
    const { data: categoriesRLS, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, name')
      .limit(1);

    if (categoriesError) {
      console.error('❌ Error accessing product_categories table:', categoriesError);
    } else {
      console.log('✅ Product_categories table accessible with service role');
    }

    // Test with anon key (simulate client access)
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (anonKey) {
      const anonClient = createClient(supabaseUrl, anonKey);
      
      console.log('\n🧪 Testing with anon key...');
      
      const { data: anonProducts, error: anonProductsError } = await anonClient
        .from('products')
        .select('id, title')
        .limit(1);

      if (anonProductsError) {
        console.error('❌ Anon key cannot access products:', anonProductsError);
      } else {
        console.log('✅ Anon key can access products');
      }

      const { data: anonManufacturers, error: anonManufacturersError } = await anonClient
        .from('manufacturers')
        .select('id, name')
        .limit(1);

      if (anonManufacturersError) {
        console.error('❌ Anon key cannot access manufacturers:', anonManufacturersError);
      } else {
        console.log('✅ Anon key can access manufacturers');
      }

      const { data: anonCategories, error: anonCategoriesError } = await anonClient
        .from('product_categories')
        .select('id, name')
        .limit(1);

      if (anonCategoriesError) {
        console.error('❌ Anon key cannot access product_categories:', anonCategoriesError);
      } else {
        console.log('✅ Anon key can access product_categories');
      }
    } else {
      console.log('⚠️ No VITE_SUPABASE_ANON_KEY found in .env file');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkRLSPolicies(); 