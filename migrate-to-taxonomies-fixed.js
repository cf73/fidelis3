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

async function migrateToTaxonomiesFixed() {
  console.log('🔄 Migrating to new taxonomy system (fixed)...\n');

  try {
    // Get all products that need updating
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, title, "product-categories", manufacturer');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📊 Found ${allProducts?.length || 0} products to process`);

    let updatedCount = 0;

    for (const product of allProducts || []) {
      const updates = {};

      // Handle manufacturer - if it's a UUID, use it directly as manufacturer_id
      if (product.manufacturer) {
        // Check if it's a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(product.manufacturer)) {
          // It's already a UUID, use it directly
          updates.manufacturer_id = product.manufacturer;
          console.log(`✅ Product "${product.title}" - manufacturer already UUID: ${product.manufacturer}`);
        } else {
          // It's a name, look it up
          const { data: manufacturer } = await supabase
            .from('manufacturers')
            .select('id')
            .eq('name', product.manufacturer)
            .single();

          if (manufacturer) {
            updates.manufacturer_id = manufacturer.id;
            console.log(`✅ Product "${product.title}" - found manufacturer: ${product.manufacturer} -> ${manufacturer.id}`);
          } else {
            console.log(`⚠️ Product "${product.title}" - manufacturer not found: ${product.manufacturer}`);
          }
        }
      }

      // Handle categories - if any exist
      if (product['product-categories']) {
        let categoryName;
        if (Array.isArray(product['product-categories'])) {
          categoryName = product['product-categories'][0];
        } else {
          categoryName = product['product-categories'];
        }

        if (categoryName) {
          const { data: category } = await supabase
            .from('product_categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (category) {
            updates.category_id = category.id;
            console.log(`✅ Product "${product.title}" - found category: ${categoryName} -> ${category.id}`);
          } else {
            console.log(`⚠️ Product "${product.title}" - category not found: ${categoryName}`);
          }
        }
      }

      // Update the product if we have changes
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.id}:`, updateError);
        } else {
          updatedCount++;
          console.log(`✅ Updated product "${product.title}" with new taxonomy relationships`);
        }
      } else {
        console.log(`ℹ️ Product "${product.title}" - no taxonomy data to migrate`);
      }
    }

    console.log(`\n🎉 Migration completed! Updated ${updatedCount} products.`);

    // Test the relationships
    console.log('\n🧪 Testing relationships...');
    const { data: testProduct, error: testError } = await supabase
      .from('products')
      .select(`
        *,
        categories:product_categories!products_category_id_fkey(name, slug),
        manufacturer:manufacturers!products_manufacturer_id_fkey(name, slug)
      `)
      .limit(1);

    if (testError) {
      console.error('❌ Error testing relationships:', testError);
    } else {
      console.log('✅ Relationships are working!');
      console.log('Sample product:', testProduct);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

migrateToTaxonomiesFixed(); 