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

async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure...\n');

  try {
    // Check products table structure
    const { data: productsColumns, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      console.error('❌ Error checking products table:', productsError);
    } else {
      console.log('✅ Products table exists');
    }

    // Check manufacturers table structure
    const { data: manufacturersColumns, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('*')
      .limit(1);

    if (manufacturersError) {
      console.error('❌ Error checking manufacturers table:', manufacturersError);
    } else {
      console.log('✅ Manufacturers table exists');
    }

    // Check product_categories table structure
    const { data: categoriesColumns, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*')
      .limit(1);

    if (categoriesError) {
      console.error('❌ Error checking product_categories table:', categoriesError);
    } else {
      console.log('✅ Product_categories table exists');
    }

    // Try to get a sample product with relationships
    const { data: sampleProduct, error: sampleError } = await supabase
      .from('products')
      .select(`
        *,
        categories:product_categories!product_category_relationships(name, slug),
        manufacturer:manufacturers!products_manufacturer_id_fkey(name, slug)
      `)
      .limit(1);

    if (sampleError) {
      console.error('❌ Error testing relationships:', sampleError);
      console.log('\n💡 This confirms the relationships are missing!');
    } else {
      console.log('✅ Relationships are working!');
      console.log('Sample product:', sampleProduct);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseStructure(); 