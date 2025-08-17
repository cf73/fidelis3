// extract-categories.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import fg from 'fast-glob';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  
  return { ...data, content, filename: path.basename(filePath) };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function extractAndPopulateCategories() {
  console.log('🔍 Extracting product categories from Statamic files...');
  
  // Get all product files
  const productFiles = await fg(['content/collections/products/*.md']);
  console.log(`📁 Found ${productFiles.length} product files`);
  
  // Extract all unique categories
  const categorySet = new Set();
  const productCategories = new Map(); // filename -> categories array
  
  for (const file of productFiles) {
    const entry = parseFrontMatter(file);
    const filename = path.basename(file);
    
    if (entry['product-categories']) {
      let categories = [];
      
      if (typeof entry['product-categories'] === 'string') {
        categories = [entry['product-categories']];
      } else if (Array.isArray(entry['product-categories'])) {
        categories = entry['product-categories'];
      }
      
      // Add to set of unique categories
      categories.forEach(cat => {
        if (cat && cat.trim()) {
          categorySet.add(cat.trim());
        }
      });
      
      // Store categories for this product
      productCategories.set(filename, categories);
    }
  }
  
  const uniqueCategories = Array.from(categorySet).sort();
  console.log(`📊 Found ${uniqueCategories.length} unique categories:`, uniqueCategories);
  
  // Disable RLS temporarily for migration
  console.log('🔧 Disabling RLS for migration...');
  await supabase.rpc('exec_sql', { sql: 'ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;' });
  await supabase.rpc('exec_sql', { sql: 'ALTER TABLE product_category_relationships DISABLE ROW LEVEL SECURITY;' });
  
  // Insert categories into product_categories table
  console.log('📝 Inserting categories into database...');
  const categoryInserts = uniqueCategories.map(name => ({
    name,
    slug: slugify(name),
    description: `Products in the ${name} category`
  }));
  
  const { data: insertedCategories, error: categoryError } = await supabase
    .from('product_categories')
    .upsert(categoryInserts, { onConflict: 'name' })
    .select('id, name, slug');
  
  if (categoryError) {
    console.error('❌ Error inserting categories:', categoryError);
    return;
  }
  
  console.log(`✅ Inserted ${insertedCategories.length} categories`);
  
  // Create a map of category name to ID
  const categoryMap = new Map();
  insertedCategories.forEach(cat => {
    categoryMap.set(cat.name, cat.id);
  });
  
  // Get all products from the database
  console.log('📦 Fetching products from database...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, filename');
  
  if (productsError) {
    console.error('❌ Error fetching products:', productsError);
    return;
  }
  
  console.log(`📊 Found ${products.length} products in database`);
  
  // Create product-category relationships
  const relationships = [];
  
  for (const product of products) {
    const productCats = productCategories.get(product.filename);
    if (productCats && productCats.length > 0) {
      productCats.forEach(catName => {
        const categoryId = categoryMap.get(catName);
        if (categoryId) {
          relationships.push({
            product_id: product.id,
            category_id: categoryId
          });
        }
      });
    }
  }
  
  console.log(`🔗 Creating ${relationships.length} product-category relationships...`);
  
  if (relationships.length > 0) {
    const { error: relationshipError } = await supabase
      .from('product_category_relationships')
      .upsert(relationships, { onConflict: 'product_id,category_id' });
    
    if (relationshipError) {
      console.error('❌ Error creating relationships:', relationshipError);
    } else {
      console.log('✅ Successfully created product-category relationships');
    }
  }
  
  // Re-enable RLS
  console.log('🔧 Re-enabling RLS...');
  await supabase.rpc('exec_sql', { sql: 'ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;' });
  await supabase.rpc('exec_sql', { sql: 'ALTER TABLE product_category_relationships ENABLE ROW LEVEL SECURITY;' });
  
  console.log('\n✅ Category taxonomy setup complete!');
  console.log(`📊 Summary:`);
  console.log(`   - ${uniqueCategories.length} categories created`);
  console.log(`   - ${relationships.length} product-category relationships created`);
  console.log(`   - Categories: ${uniqueCategories.join(', ')}`);
}

extractAndPopulateCategories().catch(console.error); 