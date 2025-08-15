import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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

async function debugPopulation() {
  console.log('🔍 Debugging population script...\n');

  const categoriesDir = path.join(__dirname, '..', 'content', 'taxonomies', 'product-categories');
  
  if (!fs.existsSync(categoriesDir)) {
    console.error(`❌ Categories directory not found: ${categoriesDir}`);
    return;
  }

  const files = fs.readdirSync(categoriesDir).filter(file => file.endsWith('.yaml'));
  console.log(`📁 Found ${files.length} category files\n`);

  // First, let's see what's in the database
  const { data: dbCategories, error: dbError } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  if (dbError) {
    console.error('Error fetching from database:', dbError);
    return;
  }

  console.log('📊 Database categories:');
  dbCategories.forEach(cat => {
    console.log(`  - ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`);
  });
  console.log('');

  // Now let's check a few YAML files
  for (const file of files.slice(0, 3)) { // Just check first 3 files
    const filePath = path.join(categoriesDir, file);
    const categoryData = parseYamlFile(filePath);

    if (!categoryData) {
      console.error(`❌ Failed to parse ${file}`);
      continue;
    }

    const slug = file.replace('.yaml', '');
    const categoryDescription = categoryData.category_description;
    const title = categoryData.title;

    console.log(`📋 File: ${file}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Title: ${title}`);
    console.log(`   Has description: ${!!categoryDescription}`);
    if (categoryDescription) {
      console.log(`   Description: "${categoryDescription.substring(0, 60)}..."`);
    }

    // Check if this slug exists in database
    const dbCategory = dbCategories.find(cat => cat.slug === slug);
    if (dbCategory) {
      console.log(`   ✅ Found in DB: ${dbCategory.name} (ID: ${dbCategory.id})`);
      
      // Try to update this specific record
      const { data: updateData, error: updateError } = await supabase
        .from('product_categories')
        .update({ category_description: categoryDescription })
        .eq('id', dbCategory.id)
        .select();

      if (updateError) {
        console.log(`   ❌ Update failed: ${updateError.message}`);
      } else {
        console.log(`   ✅ Update succeeded!`);
        console.log(`   Updated record:`, updateData[0]);
      }
    } else {
      console.log(`   ❌ Not found in database`);
    }
    console.log('');
  }
}

debugPopulation().catch(console.error);

