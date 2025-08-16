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

// Mapping from system_category to category slug
const categoryMapping = {
  'cables': 'interconnects',
  'speakers': 'speakers',
  'amplifiers': 'integrated-amplifiers',
  'turntables': 'turntables',
  'cartridges': 'phono-cartridges',
  'dacs': 'dacs',
  'streaming': 'server-streaming',
  'power': 'power-cables',
  'conditioning': 'power-conditioners',
  'racks': 'racks',
  'stands': 'stands',
  'accessories': 'accessories',
  'headphones': 'headphones',
  'headphone-amps': 'headphone-amplifiers',
  'pre-amps': 'pre-amps',
  'power-amps': 'power-amplifiers',
  'speaker-cables': 'speaker-cables',
  'subwoofers': 'subwoofers',
  'tone-arms': 'tone-arms',
  'cd-players': 'cd-players',
  'phonostage': 'phonostage',
  'multi-function': 'multi-function'
};

async function assignCategoriesToProducts() {
  console.log('🔧 Assigning categories to products...\n');

  try {
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, name, slug');

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
      return;
    }

    // Create a map of category slugs to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    console.log('📋 Available categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

    // Get products that need category assignment
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, system_category, category_id')
      .is('category_id', null)
      .not('system_category', 'is', null);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`\n📦 Found ${products?.length || 0} products to assign categories`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products || []) {
      const systemCategory = product.system_category;
      const categorySlug = categoryMapping[systemCategory];
      
      if (categorySlug && categoryMap[categorySlug]) {
        const categoryId = categoryMap[categorySlug];
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: categoryId })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.title}:`, updateError);
        } else {
          console.log(`✅ "${product.title}" -> ${systemCategory} -> ${categorySlug}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No mapping found for "${product.title}" (system_category: ${systemCategory})`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} products with categories`);
    console.log(`⚠️ Skipped ${skippedCount} products (no mapping found)`);

    // Verify the fix
    console.log('\n🧪 Verifying category assignments...');
    const { data: sampleProducts, error: verifyError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        categories:product_categories!products_category_id_fkey(name, slug)
      `)
      .not('category_id', 'is', null)
      .limit(10);

    if (verifyError) {
      console.error('❌ Error verifying products:', verifyError);
    } else {
      console.log('✅ Sample products with categories:');
      sampleProducts?.forEach(product => {
        console.log(`  - ${product.title}: ${product.categories?.name || 'None'}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

assignCategoriesToProducts(); 