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

async function debugReactFiltering() {
  console.log('🔍 Debugging React filtering data structure...\n');

  try {
    // Test the same query that React uses
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        categories:product_categories!products_category_id_fkey(id, name, slug),
        manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
      `)
      .eq('published', true)
      .limit(5);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log('📦 Sample products with relationships:');
    products?.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}:`);
      console.log(`   Categories:`, JSON.stringify(product.categories, null, 2));
      console.log(`   Manufacturer:`, JSON.stringify(product.manufacturer, null, 2));
    });

    // Test categories query
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, name, slug')
      .order('name')
      .limit(5);

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
    } else {
      console.log('\n📋 Sample categories:');
      categories?.forEach(cat => {
        console.log(`   - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
      });
    }

    // Test manufacturers query
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, name, slug')
      .order('name')
      .limit(5);

    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
    } else {
      console.log('\n🏭 Sample manufacturers:');
      manufacturers?.forEach(man => {
        console.log(`   - ${man.name} (ID: ${man.id}, Slug: ${man.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugReactFiltering(); 