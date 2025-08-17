const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations


if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '❌');
  console.error('\nPlease check your .env file and ensure both variables are set.');
  process.exit(1);
}

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

async function fixProductsFinal() {
  console.log('🔧 Final fix for products table...\n');
  
  try {
    // First, delete all products
    console.log('Deleting all existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error deleting products:', deleteError);
      return;
    }
    
    console.log('✅ All products deleted');
    
    // Now re-import only the correct products from CSV
    console.log('\nRe-importing products from CSV...');
    const rawData = await parseCSV('../exports/products.csv');
    console.log(`Found ${rawData.length} products in CSV`);
    
    // Transform the data
    const cleanedData = rawData.map(row => ({
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
      available_for_demo: row.available_for_demo === 'true' || row.available_for_demo === '1',
      available_to_buy_online: row.available_to_buy_online === 'true' || row.available_to_buy_online === '1',
      show_price: row.show_price === 'true' || row.show_price === '1',
      local_only: row.local_only === 'true' || row.local_only === '1',
      product_categories: row.product_categories ? row.product_categories.split(';').map(item => item.trim()) : [],
      system_category: row.system_category,
      filename: row.filename
    })).filter(record => record.title && record.title.trim() !== '');
    
    console.log(`After filtering: ${cleanedData.length} valid products`);
    
    // Insert the cleaned data
    const { data, error: insertError } = await supabase
      .from('products')
      .insert(cleanedData);
    
    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      return;
    }
    
    console.log(`✅ Successfully imported ${cleanedData.length} products`);
    
    // Verify the final count
    const { count: finalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n🎉 Final products count: ${finalCount} (expected: 356)`);
    
  } catch (error) {
    console.error('❌ Error fixing products:', error);
  }
}

fixProductsFinal(); 