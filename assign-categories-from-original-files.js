import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import fg from 'fast-glob';
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

function parseFrontMatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  
  // Try standard front matter first
  let { data, content } = matter(raw);
  
  // If no data was parsed (no front matter delimiters), treat the entire file as YAML
  if (Object.keys(data).length === 0) {
    try {
      data = yaml.load(raw);
      content = '';
    } catch (error) {
      console.error(`Error parsing YAML for ${filePath}:`, error);
      data = {};
    }
  }
  
  // If Statamic uses YAML blocks inside fields, parse them:
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && data[key].trim().startsWith('-')) {
      try { data[key] = yaml.load(data[key]); } catch {}
    }
  });
  
  // Add filename field
  const filename = path.basename(filePath);
  return { ...data, content, filename };
}

async function assignCategoriesFromOriginalFiles() {
  console.log('🔧 Assigning categories from original Markdown files...\n');

  try {
    // Get all categories from database
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

    // Read all product Markdown files
    const productFiles = await fg(['content/collections/products/*.md']);
    console.log(`\n📦 Found ${productFiles.length} product files`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const file of productFiles) {
      const entry = parseFrontMatter(file);
      const filename = path.basename(file, '.md');
      
      // Find the product in the database by filename
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, title, category_id')
        .eq('filename', `${filename}.md`)
        .single();

      if (productError) {
        console.log(`⚠️ Product not found for ${filename}: ${productError.message}`);
        skippedCount++;
        continue;
      }

      // Check if product already has a category
      if (product.category_id) {
        console.log(`ℹ️ Product "${product.title}" already has category assigned`);
        continue;
      }

      // Get the product-categories from the original file
      const productCategories = entry['product-categories'];
      
      if (!productCategories) {
        console.log(`⚠️ No product-categories found for "${product.title}"`);
        skippedCount++;
        continue;
      }

      // Handle both string and array formats
      let categorySlug;
      if (Array.isArray(productCategories)) {
        categorySlug = productCategories[0]; // Take the first category
      } else {
        categorySlug = productCategories;
      }

      if (categorySlug && categoryMap[categorySlug]) {
        const categoryId = categoryMap[categorySlug];
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: categoryId })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.title}:`, updateError);
        } else {
          console.log(`✅ "${product.title}" -> ${categorySlug}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No category mapping found for "${product.title}" (category: ${categorySlug})`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} products with categories`);
    console.log(`⚠️ Skipped ${skippedCount} products`);

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

assignCategoriesFromOriginalFiles(); 