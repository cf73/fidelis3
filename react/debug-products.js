import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugProducts() {
  console.log('🔍 Debugging products in database...\n');

  try {
    // Check all products (including unpublished)
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all products:', allError);
      return;
    }

    console.log(`📊 Total products in database: ${allProducts?.length || 0}`);

    if (allProducts && allProducts.length > 0) {
      console.log('\n📋 Sample products:');
      allProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (ID: ${product.id})`);
        console.log(`   - Published: ${product.published}`);
        console.log(`   - Featured: ${product.featured}`);
        console.log(`   - Hero Image: ${product.product_hero_image || 'None'}`);
        console.log(`   - Created: ${product.created_at}`);
        console.log('');
      });
    }

    // Check published products only
    const { data: publishedProducts, error: publishedError } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (publishedError) {
      console.error('❌ Error fetching published products:', publishedError);
      return;
    }

    console.log(`✅ Published products: ${publishedProducts?.length || 0}`);

    // Check products with categories
    const { data: productsWithCategories, error: categoriesError } = await supabase
      .from('products')
      .select(`
        *,
        categories:product_categories(name, slug),
        manufacturer:manufacturers(name, slug)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (categoriesError) {
      console.error('❌ Error fetching products with categories:', categoriesError);
      return;
    }

    console.log(`🔗 Products with categories: ${productsWithCategories?.length || 0}`);

    if (productsWithCategories && productsWithCategories.length > 0) {
      console.log('\n📋 Products with categories:');
      productsWithCategories.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   - Categories: ${product.categories?.map(c => c.name).join(', ') || 'None'}`);
        console.log(`   - Manufacturer: ${product.manufacturer?.name || 'None'}`);
        console.log('');
      });
    }

    // Check if there are any products with null published field
    const { data: nullPublished, error: nullError } = await supabase
      .from('products')
      .select('id, title, published')
      .is('published', null);

    if (nullError) {
      console.error('❌ Error checking null published:', nullError);
    } else {
      console.log(`❓ Products with null published field: ${nullPublished?.length || 0}`);
      if (nullPublished && nullPublished.length > 0) {
        console.log('These products might not show up in the UI:');
        nullPublished.forEach(p => console.log(`  - ${p.title} (ID: ${p.id})`));
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugProducts(); 