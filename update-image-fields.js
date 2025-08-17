// update-image-fields.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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

function extractImageFields(content) {
  if (!content) return {};
  
  const imageFields = {};
  const contentLines = content.split('\n');
  
  console.log('   Content preview:', content.substring(0, 200));
  
  contentLines.forEach(line => {
    // Remove quotes and trim
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '').trim();
    const match = cleanLine.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, fieldName, fieldValue] = match;
      if (fieldName.includes('image') || fieldName.includes('logo')) {
        imageFields[fieldName] = fieldValue.trim();
      }
    }
  });
  
  return imageFields;
}

async function updateImageFields() {
  console.log('🔄 Updating image fields in existing records...\n');
  
  // Update products
  console.log('📦 Updating products...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, content, product_hero_image');
  
  if (productsError) {
    console.error('❌ Error fetching products:', productsError);
  } else {
    console.log(`✅ Found ${products.length} products to update`);
    
    for (const product of products) {
      const imageFields = extractImageFields(product.content);
          console.log(`📦 Processing: ${product.title}`);
      
      if (imageFields.product_hero_image && imageFields.product_hero_image !== product.product_hero_image) {
        console.log(`🖼️  Updating ${product.title}: ${product.product_hero_image} → ${imageFields.product_hero_image}`);
        
        const { error } = await supabase
          .from('products')
          .update({ product_hero_image: imageFields.product_hero_image })
          .eq('id', product.id);
        
        if (error) {
          console.error(`❌ Error updating ${product.title}:`, error);
        } else {
          console.log(`✅ Updated ${product.title}`);
        }
      } else {
        console.log(`⏭️  No update needed for ${product.title}`);
      }
    }
  }
  
  // Update manufacturers
  console.log('\n🏭 Updating manufacturers...');
  const { data: manufacturers, error: manufacturersError } = await supabase
    .from('manufacturers')
    .select('id, title, content, logo');
  
  if (manufacturersError) {
    console.error('❌ Error fetching manufacturers:', manufacturersError);
  } else {
    console.log(`✅ Found ${manufacturers.length} manufacturers to update`);
    
    for (const manufacturer of manufacturers) {
      const imageFields = extractImageFields(manufacturer.content);
      
      if (imageFields.logo && imageFields.logo !== manufacturer.logo) {
        console.log(`🖼️  Updating ${manufacturer.title}: ${manufacturer.logo} → ${imageFields.logo}`);
        
        const { error } = await supabase
          .from('manufacturers')
          .update({ logo: imageFields.logo })
          .eq('id', manufacturer.id);
        
        if (error) {
          console.error(`❌ Error updating ${manufacturer.title}:`, error);
        } else {
          console.log(`✅ Updated ${manufacturer.title}`);
        }
      }
    }
  }
  
  console.log('\n🎉 Image field update complete!');
}

updateImageFields(); 