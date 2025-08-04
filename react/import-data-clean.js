const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to parse CSV file
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Helper function to clean and transform data
function cleanData(data, tableName) {
  return data.map(row => {
    const cleaned = {};
    
    // Handle different data types
    Object.keys(row).forEach(key => {
      const value = row[key];
      
      if (value === '' || value === null || value === undefined) {
        cleaned[key] = null;
      } else if (key === 'price' || key === 'new_retail_price' || key === 'your_price') {
        // Handle price fields
        const numValue = parseFloat(value);
        cleaned[key === 'new_retail_price' || key === 'your_price' ? 'price' : key] = isNaN(numValue) ? null : numValue;
      } else if (key === 'product_categories' || key === 'system_category') {
        // Handle array fields
        if (value && value.includes(';')) {
          cleaned[key] = value.split(';').map(item => item.trim());
        } else if (value) {
          cleaned[key] = [value.trim()];
        } else {
          cleaned[key] = [];
        }
      } else if (key === 'available_for_demo' || key === 'available_to_buy_online' || key === 'show_price' || key === 'local_only') {
        // Handle boolean fields
        cleaned[key] = value === 'true' || value === '1';
      } else if (key === 'date') {
        // Handle date fields
        if (value) {
          const date = new Date(value);
          cleaned[key] = isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
        } else {
          cleaned[key] = null;
        }
      } else {
        // Handle text fields
        cleaned[key] = value || null;
      }
    });
    
    return cleaned;
  });
}

// Helper function to process image paths
function processImagePath(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, make it absolute to the public assets
  if (imagePath.startsWith('/')) {
    return `https://fidelisav.com${imagePath}`;
  }
  
  // If it's just a filename, assume it's in the main assets folder
  if (!imagePath.includes('/')) {
    return `https://fidelisav.com/assets/main/${imagePath}`;
  }
  
  return imagePath;
}

// Import function for each table
async function importTable(tableName, csvPath, transformFunction = null) {
  try {
    console.log(`\n📥 Importing ${tableName}...`);
    
    // Parse CSV
    const rawData = await parseCSV(csvPath);
    console.log(`   Found ${rawData.length} records`);
    
    // Clean and transform data
    let cleanedData = cleanData(rawData, tableName);
    if (transformFunction) {
      cleanedData = transformFunction(cleanedData);
    }
    
    // Filter out records with empty titles
    cleanedData = cleanedData.filter(record => record.title && record.title.trim() !== '');
    console.log(`   After filtering: ${cleanedData.length} valid records`);
    
    if (cleanedData.length === 0) {
      console.log(`   ⚠️  No valid records to import for ${tableName}`);
      return true;
    }
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from(tableName)
      .insert(cleanedData);
    
    if (error) {
      console.error(`   ❌ Error importing ${tableName}:`, error);
      return false;
    }
    
    console.log(`   ✅ Successfully imported ${cleanedData.length} records to ${tableName}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error importing ${tableName}:`, error);
    return false;
  }
}

// Main import function
async function importAllData() {
  console.log('🚀 Starting clean data import to Supabase...\n');
  
  const imports = [
    {
      table: 'manufacturers',
      csv: '../exports/manufacturers.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Manufacturer',
        logo: processImagePath(row.logo),
        tagline: row.tagline,
        website: row.website,
        hero_image: processImagePath(row.hero_image),
        description: row.description_text || row.description,
        product_categories: row.product_categories || [],
        filename: row.filename
      }))
    },
    {
      table: 'products',
      csv: '../exports/products.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Product',
        manufacturer: row.manufacturer,
        price: row.price || row.new_retail_price || row.your_price,
        description: row.description,
        description_text: row.description_text,
        quote: row.quote,
        quote_text: row.quote_text,
        specs: row.specs,
        specs_text: row.specs_text,
        product_hero_image: processImagePath(row.product_hero_image),
        available_for_demo: row.available_for_demo,
        available_to_buy_online: row.available_to_buy_online,
        show_price: row.show_price,
        local_only: row.local_only,
        product_categories: row.product_categories || [],
        system_category: row.system_category,
        filename: row.filename
      }))
    },
    {
      table: 'news',
      csv: '../exports/news.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled News',
        content: row.content,
        excerpt: row.excerpt,
        date: row.date,
        featured_image: processImagePath(row.featured_image),
        filename: row.filename
      }))
    },
    {
      table: 'pre_owned',
      csv: '../exports/pre-owned.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Pre-owned Item',
        description: row.description_text || row.description,
        price: row.your_price || row.new_retail_price,
        condition: row.condition,
        images: row.images ? row.images.split(';').map(img => processImagePath(img.trim())) : [],
        filename: row.filename
      }))
    },
    {
      table: 'testimonials',
      csv: '../exports/testimonials.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Testimonial',
        content: row.content,
        author: row.author,
        attribution: row.attribution,
        filename: row.filename
      }))
    },
    {
      table: 'pages',
      csv: '../exports/pages.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Page',
        content: row.content,
        excerpt: row.excerpt,
        filename: row.filename
      }))
    },
    {
      table: 'evergreen_carousel',
      csv: '../exports/evergreen-carousel.csv',
      transform: (data) => data.map(row => ({
        title: row.title || 'Untitled Carousel Item',
        content: row.content,
        excerpt: row.excerpt,
        featured_image: processImagePath(row.featured_image),
        filename: row.filename
      }))
    }
  ];
  
  let successCount = 0;
  let totalCount = imports.length;
  
  for (const importItem of imports) {
    const success = await importTable(importItem.table, importItem.csv, importItem.transform);
    if (success) successCount++;
  }
  
  console.log(`\n🎉 Import completed! ${successCount}/${totalCount} tables imported successfully.`);
}

// Run the import
importAllData().catch(console.error); 