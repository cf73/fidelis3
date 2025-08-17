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

async function migrateToTaxonomies() {
  console.log('🔄 Migrating to new taxonomy system...\n');

  try {
    // First, let's see what we have in the old fields
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, "product-categories", manufacturer')
      .limit(10);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log('📋 Sample products with old taxonomy data:');
    products?.forEach(product => {
      console.log(`- ${product.title}`);
      console.log(`  Categories: ${product['product-categories'] || 'None'}`);
      console.log(`  Manufacturer: ${product.manufacturer || 'None'}`);
    });

    // Get all unique categories from the old field
    const { data: allProducts, error: allProductsError } = await supabase
      .from('products')
      .select('"product-categories"')
      .not('product-categories', 'is', null);

    if (allProductsError) {
      console.error('❌ Error fetching all products:', allProductsError);
      return;
    }

    // Extract unique categories
    const uniqueCategories = new Set();
    allProducts?.forEach(product => {
      if (product['product-categories']) {
        if (Array.isArray(product['product-categories'])) {
          product['product-categories'].forEach(cat => uniqueCategories.add(cat));
        } else {
          uniqueCategories.add(product['product-categories']);
        }
      }
    });

    console.log('\n📊 Unique categories found:', Array.from(uniqueCategories));

    // Get all unique manufacturers
    const { data: allManufacturers, error: allManufacturersError } = await supabase
      .from('products')
      .select('manufacturer')
      .not('manufacturer', 'is', null);

    if (allManufacturersError) {
      console.error('❌ Error fetching manufacturers:', allManufacturersError);
      return;
    }

    const uniqueManufacturers = new Set();
    allManufacturers?.forEach(product => {
      if (product.manufacturer) {
        uniqueManufacturers.add(product.manufacturer);
      }
    });

    console.log('📊 Unique manufacturers found:', Array.from(uniqueManufacturers));

    // Now let's migrate the data
    console.log('\n🔄 Starting migration...');

    // 1. Create categories in the product_categories table
    for (const categoryName of uniqueCategories) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error: categoryError } = await supabase
        .from('product_categories')
        .upsert({
          name: categoryName,
          slug: slug,
          description: `Category for ${categoryName}`
        }, { onConflict: 'slug' });

      if (categoryError) {
        console.error(`❌ Error creating category ${categoryName}:`, categoryError);
      } else {
        console.log(`✅ Created/updated category: ${categoryName}`);
      }
    }

    // 2. Create manufacturers in the manufacturers table
    for (const manufacturerName of uniqueManufacturers) {
      const slug = manufacturerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error: manufacturerError } = await supabase
        .from('manufacturers')
        .upsert({
          name: manufacturerName,
          slug: slug,
          description: `Manufacturer: ${manufacturerName}`
        }, { onConflict: 'slug' });

      if (manufacturerError) {
        console.error(`❌ Error creating manufacturer ${manufacturerName}:`, manufacturerError);
      } else {
        console.log(`✅ Created/updated manufacturer: ${manufacturerName}`);
      }
    }

    // 3. Update products with the new foreign key relationships
    const { data: allProductsForUpdate, error: updateError } = await supabase
      .from('products')
      .select('id, "product-categories", manufacturer');

    if (updateError) {
      console.error('❌ Error fetching products for update:', updateError);
      return;
    }

    for (const product of allProductsForUpdate || []) {
      const updates = {};

      // Update manufacturer_id
      if (product.manufacturer) {
        const { data: manufacturer } = await supabase
          .from('manufacturers')
          .select('id')
          .eq('name', product.manufacturer)
          .single();

        if (manufacturer) {
          updates.manufacturer_id = manufacturer.id;
        }
      }

      // Update category_id (take the first category if multiple)
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
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error: productUpdateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);

        if (productUpdateError) {
          console.error(`❌ Error updating product ${product.id}:`, productUpdateError);
        } else {
          console.log(`✅ Updated product ${product.id} with new taxonomy relationships`);
        }
      }
    }

    console.log('\n🎉 Migration completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

migrateToTaxonomies(); 