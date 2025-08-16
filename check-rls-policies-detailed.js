import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRlsPoliciesDetailed() {
  console.log('🔍 Checking RLS policies for all tables...\n');

  try {
    // Check products table RLS policies
    console.log('📦 Products table RLS policies:');
    const { data: productsPolicies, error: productsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT policyname, permissive, roles, command, definition
          FROM pg_policies
          WHERE tablename = 'products'
          ORDER BY policyname;
        `
      });

    if (productsError) {
      console.error('❌ Error checking products RLS policies:', productsError);
    } else {
      console.log(productsPolicies || 'No policies found');
    }

    console.log('');

    // Check product_categories table RLS policies
    console.log('📋 Product Categories table RLS policies:');
    const { data: categoriesPolicies, error: categoriesError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT policyname, permissive, roles, command, definition
          FROM pg_policies
          WHERE tablename = 'product_categories'
          ORDER BY policyname;
        `
      });

    if (categoriesError) {
      console.error('❌ Error checking product_categories RLS policies:', categoriesError);
    } else {
      console.log(categoriesPolicies || 'No policies found');
    }

    console.log('');

    // Check manufacturers table RLS policies
    console.log('🏭 Manufacturers table RLS policies:');
    const { data: manufacturersPolicies, error: manufacturersError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT policyname, permissive, roles, command, definition
          FROM pg_policies
          WHERE tablename = 'manufacturers'
          ORDER BY policyname;
        `
      });

    if (manufacturersError) {
      console.error('❌ Error checking manufacturers RLS policies:', manufacturersError);
    } else {
      console.log(manufacturersPolicies || 'No policies found');
    }

    console.log('');

    // Test the exact query that React uses with anon key
    console.log('🧪 Testing React query with anon key...');
    const anonSupabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
    
    const { data: testProducts, error: testError } = await anonSupabase
      .from('products')
      .select(`
        id,
        title,
        categories:product_categories!products_category_id_fkey(id, name, slug),
        manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
      `)
      .eq('published', true)
      .limit(3);

    if (testError) {
      console.error('❌ Error testing React query:', testError);
    } else {
      console.log('✅ React query test successful:');
      testProducts?.forEach(product => {
        console.log(`  - ${product.title}: Category: ${product.categories?.name || 'None'}, Manufacturer: ${product.manufacturer?.name || 'None'}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkRlsPoliciesDetailed(); 