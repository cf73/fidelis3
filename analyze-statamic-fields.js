// analyze-statamic-fields.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import fg from 'fast-glob';

function parseFrontMatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  // If Statamic uses YAML blocks inside fields, parse them:
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && data[key].trim().startsWith('-')) {
      try { data[key] = yaml.load(data[key]); } catch {}
    }
  });
  return { ...data, content };
}

async function analyzeAllFields() {
  console.log('🔍 Analyzing all Statamic content files...');
  
  const allFields = new Map(); // collection -> Set of field names
  const allFiles = await fg(['content/collections/**/*.md']);
  
  for (const file of allFiles) {
    const entry = parseFrontMatter(file);
    // Extract just the collection name from the path
    const pathParts = file.split(path.sep);
    const collectionsIndex = pathParts.indexOf('collections');
    const collection = pathParts[collectionsIndex + 1];
    
    if (!allFields.has(collection)) {
      allFields.set(collection, new Set());
    }
    
    // Add all field names from this entry
    Object.keys(entry).forEach(field => {
      allFields.get(collection).add(field);
    });
  }
  
  console.log('\n📊 Found fields by collection:');
  for (const [collection, fields] of allFields) {
    console.log(`\n${collection}:`);
    const sortedFields = Array.from(fields).sort();
    sortedFields.forEach(field => console.log(`  - ${field}`));
  }
  
  // Generate SQL script
  console.log('\n🔧 Generating comprehensive SQL script...');
  
  const sqlScript = generateSQLScript(allFields);
  fs.writeFileSync('comprehensive-schema.sql', sqlScript);
  
  console.log('\n✅ Generated comprehensive-schema.sql');
  console.log('📝 Run this script in your Supabase SQL editor to add ALL needed columns at once!');
}

function generateSQLScript(allFields) {
  let sql = `-- Comprehensive Schema for All Statamic Fields
-- Run this in your Supabase SQL editor

`;

  // Map collection names to table names
  const collectionToTable = {
    'products': 'products',
    'manufacturers': 'manufacturers', 
    'news': 'news',
    'pre-owned': 'pre_owned',
    'testimonials': 'testimonials',
    'pages': 'pages',
    'evergreen-carousel': 'evergreen_carousel'
  };

  for (const [collection, fields] of allFields) {
    const tableName = collectionToTable[collection];
    if (!tableName) {
      console.log(`Skipping collection: ${collection} (no table mapping)`);
      continue;
    }
    
    sql += `-- Add all fields for ${collection} table\n`;
    
    const sortedFields = Array.from(fields).sort();
    for (const field of sortedFields) {
      // Skip Statamic-specific fields
      if (['blueprint', 'blueprint_handle', 'blueprint_namespace', 'edit_url', 'is_entry', 'last_modified_by'].includes(field)) {
        continue;
      }
      
      // Determine field type based on field name and content
      let fieldType = 'TEXT';
      if (field.includes('date') || field.includes('modified')) {
        fieldType = 'TIMESTAMP WITH TIME ZONE';
      } else if (field.includes('price') || field.includes('rating')) {
        fieldType = 'NUMERIC';
      } else if (field.includes('featured') || field.includes('published') || field.includes('approved') || field.includes('active') || field.includes('available') || field.includes('in_stock') || field.includes('local_only') || field.includes('hide_your_price') || field.includes('is_hidden')) {
        fieldType = 'BOOLEAN DEFAULT false';
      } else if (field.includes('categories') || field.includes('gallery') || field.includes('pairs_well_with') || field.includes('also_consider')) {
        fieldType = 'TEXT[]';
      } else if (field.includes('order')) {
        fieldType = 'INTEGER';
      }
      
      sql += `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${field} ${fieldType};\n`;
    }
    
    sql += '\n';
  }
  
  sql += `-- Update RLS policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
DROP POLICY IF EXISTS "Public read access" ON news;
DROP POLICY IF EXISTS "Public read access" ON pre_owned;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON pages;
DROP POLICY IF EXISTS "Public read access" ON evergreen_carousel;

CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pre_owned FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON evergreen_carousel FOR SELECT USING (true);
`;

  return sql;
}

analyzeAllFields().catch(console.error); 