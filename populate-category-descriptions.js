import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not available');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to read and parse YAML files
function parseYamlFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to update category description in Supabase
async function updateCategoryDescription(slug, categoryDescription) {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .update({ category_description: categoryDescription })
      .eq('slug', slug);

    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
      return false;
    }

    console.log(`✅ Updated ${slug}: "${categoryDescription.substring(0, 50)}..."`);
    return true;
  } catch (error) {
    console.error(`Error updating ${slug}:`, error.message);
    return false;
  }
}

// Main function
async function populateCategoryDescriptions() {
  console.log('🚀 Starting to populate category descriptions...\n');

  const categoriesDir = path.join(__dirname, 'content', 'taxonomies', 'product-categories');
  
  if (!fs.existsSync(categoriesDir)) {
    console.error(`❌ Categories directory not found: ${categoriesDir}`);
    return;
  }

  const files = fs.readdirSync(categoriesDir).filter(file => file.endsWith('.yaml'));
  console.log(`📁 Found ${files.length} category files\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(categoriesDir, file);
    const categoryData = parseYamlFile(filePath);

    if (!categoryData) {
      console.error(`❌ Failed to parse ${file}`);
      errorCount++;
      continue;
    }

    const slug = file.replace('.yaml', '');
    const categoryDescription = categoryData.category_description;
    const title = categoryData.title;

    if (!categoryDescription) {
      console.log(`⚠️  No category_description found for ${slug} (${title})`);
      continue;
    }

    const success = await updateCategoryDescription(slug, categoryDescription);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Total files processed: ${files.length}`);
}

// Run the script
populateCategoryDescriptions().catch(console.error);
