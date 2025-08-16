// migrate-statamic-to-supabase.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import fg from 'fast-glob';
import mime from 'mime';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'assets'; // Name of your Supabase Storage bucket

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Statamic-specific fields to exclude from Supabase
const STATAMIC_FIELDS_TO_EXCLUDE = [
  'blueprint',
  'blueprint_handle', 
  'blueprint_namespace',
  'edit_url',
  'is_entry',
  'last_modified_by'
];

// Temporarily skip asset upload due to RLS issues
async function uploadAsset(filePath, destPath) {
  console.log(`Skipping upload: ${filePath}`);
  return `https://your-supabase-project.supabase.co/storage/v1/object/public/${BUCKET}/${destPath}`;
}

async function migrateAssets(assetDir) {
  console.log('⚠️  Skipping asset upload for now - will use placeholder URLs');
  const files = await fg([`${assetDir}/**/*.*`], { dot: false });
  const urlMap = {};
  for (const file of files) {
    const relPath = path.relative(assetDir, file).replace(/\\/g, '/');
    const supaPath = relPath;
    const url = await uploadAsset(file, supaPath);
    urlMap[relPath] = url;
    urlMap[`/assets/${relPath}`] = url; // for Statamic-style references
    console.log(`Mapped: ${relPath} → ${url}`);
  }
  return urlMap;
}

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

       function filterStatamicFields(entry) {
  // Remove Statamic-specific fields
  const filtered = {};
  Object.keys(entry).forEach(key => {
    if (!STATAMIC_FIELDS_TO_EXCLUDE.includes(key)) {
      filtered[key] = entry[key];
    }
  });
  

  
  // Ensure title field exists for required tables
  if (!filtered.title && filtered.news_title) {
    filtered.title = filtered.news_title;
  }
  if (!filtered.title && filtered.page_title) {
    filtered.title = filtered.page_title;
  }
  if (!filtered.title && filtered.item_name) {
    filtered.title = filtered.item_name;
  }
  if (!filtered.title && filtered.product_name) {
    filtered.title = filtered.product_name;
  }
  if (!filtered.title && filtered.manufacturer_name) {
    filtered.title = filtered.manufacturer_name;
  }
  if (!filtered.title && filtered.carousel_title) {
    filtered.title = filtered.carousel_title;
  }
  
  // For news, try to extract title from filename if no title exists
  if (!filtered.title && filtered.filename) {
    const filename = filtered.filename.replace(/\.md$/, '');
    // Try to extract a meaningful title from the filename
    if (filename.includes('-')) {
      const parts = filename.split('-');
      // Skip date parts and create title from the rest
      const titleParts = parts.slice(2); // Skip date parts
      if (titleParts.length > 0) {
        filtered.title = titleParts.join(' ').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
  }
  
  // For pre-owned items, try to extract title from filename
  if (!filtered.title && filtered.filename && filtered.filename.includes('pre-owned')) {
    const filename = filtered.filename.replace(/\.md$/, '');
    if (filename.includes('-')) {
      const parts = filename.split('-');
      // Skip date parts and create title from the rest
      const titleParts = parts.slice(2); // Skip date parts
      if (titleParts.length > 0) {
        filtered.title = titleParts.join(' ').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
  }
  
  // For manufacturers without title, use filename to create a proper title
  if (!filtered.title && filtered.filename && !filtered.filename.includes('news') && !filtered.filename.includes('pre-owned')) {
    const filename = filtered.filename.replace(/\.md$/, '');
    // Convert filename to proper title (e.g., "sonus-faber" -> "Sonus Faber")
    filtered.title = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Final fallback: use filename as title
  if (!filtered.title && filtered.filename) {
    filtered.title = filtered.filename.replace(/\.md$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
         
                   // Convert Unix timestamps to ISO strings
          if (filtered.entry_date && typeof filtered.entry_date === 'number') {
            // Skip timestamps that are too large for PostgreSQL
            if (filtered.entry_date < 1000000000000) {
              filtered.entry_date = new Date(filtered.entry_date * 1000).toISOString();
            } else {
              // Skip this field if timestamp is too large
              delete filtered.entry_date;
            }
          }
          if (filtered.last_modified && typeof filtered.last_modified === 'number') {
            // Skip timestamps that are too large for PostgreSQL
            if (filtered.last_modified < 1000000000000) {
              filtered.last_modified = new Date(filtered.last_modified * 1000).toISOString();
            } else {
              // Skip this field if timestamp is too large
              delete filtered.last_modified;
            }
          }
          if (filtered.updated_at && typeof filtered.updated_at === 'number') {
            // Skip timestamps that are too large for PostgreSQL
            if (filtered.updated_at < 1000000000000) {
              filtered.updated_at = new Date(filtered.updated_at * 1000).toISOString();
            } else {
              // Skip this field if timestamp is too large
              delete filtered.updated_at;
            }
          }
          
          // Convert string arrays to proper PostgreSQL array format
          const arrayFields = ['pairs_well_with', 'also_consider', 'product_gallery'];
          arrayFields.forEach(field => {
            if (filtered[field]) {
              if (typeof filtered[field] === 'string') {
                // Convert single string to array
                filtered[field] = [filtered[field]];
              } else if (Array.isArray(filtered[field])) {
                // Already an array, keep as is
                filtered[field] = filtered[field];
              }
            }
          });
          
          // Remove product-categories field as it's handled by separate taxonomy tables
          delete filtered['product-categories'];
         
         return filtered;
       }

async function migrateCollection(collection, urlMap, table) {
  const files = await fg([`content/collections/${collection}/*.md`]);
  console.log(`\n📥 Migrating ${collection} collection (${files.length} files)...`);
  
  for (const file of files) {
    const entry = parseFrontMatter(file);
    
    // Extract image fields from content if they exist in the content field
    if (entry.content) {
      // Parse the content field to extract image references
      const contentLines = entry.content.split('\n');
      const imageFields = {};
      
      contentLines.forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          const [, fieldName, fieldValue] = match;
          if (fieldName.includes('image') || fieldName.includes('logo')) {
            imageFields[fieldName] = fieldValue.trim();
          }
        }
      });
      
      // Map the extracted image fields to the appropriate columns
      if (imageFields.product_hero_image) {
        entry.product_hero_image = imageFields.product_hero_image;
        console.log(`🖼️  Extracted product_hero_image: ${imageFields.product_hero_image}`);
      }
      if (imageFields.featured_image) {
        entry.featured_image = imageFields.featured_image;
        console.log(`🖼️  Extracted featured_image: ${imageFields.featured_image}`);
      }
      if (imageFields.logo) {
        entry.logo = imageFields.logo;
        console.log(`🖼️  Extracted logo: ${imageFields.logo}`);
      }
    }
    
    console.log(`📁 Processing ${path.basename(file)} with image fields:`, 
      Object.keys(entry).filter(key => key.includes('image') || key.includes('logo')));
    
    // Replace any remaining asset references with Supabase URLs
    Object.keys(entry).forEach(key => {
      if (typeof entry[key] === 'string' && entry[key].match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        const rel = entry[key].replace(/^\/?assets\//, '');
        if (urlMap[rel]) entry[key] = urlMap[rel];
      }
    });
    
    // Filter out Statamic-specific fields
    const filteredEntry = filterStatamicFields(entry);
    
    // Insert or upsert into Supabase
    const { error } = await supabase.from(table).upsert([filteredEntry], { onConflict: 'filename' });
    if (error) {
      console.error(`❌ Error upserting ${file}:`, error);
    } else {
      console.log(`✅ Upserted: ${path.basename(file)}`);
    }
  }
}

(async () => {
  console.log('🚀 Starting Statamic to Supabase migration...');
  console.log('📊 This will migrate all content with placeholder image URLs');
  console.log('🔧 Filtering out Statamic-specific fields (blueprint, etc.)');
  
  try {
    // 1. Create URL mapping for assets (placeholder URLs for now)
    const urlMap = await migrateAssets('assets');

    // 2. Migrate each collection
    await migrateCollection('products', urlMap, 'products');
    await migrateCollection('manufacturers', urlMap, 'manufacturers');
    await migrateCollection('news', urlMap, 'news');
    await migrateCollection('pre-owned', urlMap, 'pre_owned');
    await migrateCollection('testimonials', urlMap, 'testimonials');
    await migrateCollection('evergreen-carousel', urlMap, 'evergreen_carousel');

    console.log('\n✅ Migration complete!');
    console.log('📝 Note: Image URLs are placeholders. You can update them later in Supabase.');
    console.log('🔧 Statamic-specific fields have been filtered out.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
})();