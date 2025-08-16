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

async function fixImagePaths() {
  console.log('🔧 Fixing image paths in database...');
  
  try {
    // Get products with image references
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery')
      .not('product_hero_image', 'is', null);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    console.log(`📊 Found ${products?.length || 0} products with images`);
    
    let updatedCount = 0;
    
    for (const product of products || []) {
      let needsUpdate = false;
      const updates = { id: product.id };
      
      // Fix product_hero_image
      if (product.product_hero_image && !product.product_hero_image.startsWith('assets/')) {
        updates.product_hero_image = `assets/${product.product_hero_image}`;
        needsUpdate = true;
        console.log(`  🔧 ${product.title}: ${product.product_hero_image} → ${updates.product_hero_image}`);
      }
      
      // Fix product_gallery (array of images)
      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        const fixedGallery = product.product_gallery.map(img => {
          if (img && !img.startsWith('assets/')) {
            return `assets/${img}`;
          }
          return img;
        });
        
        if (JSON.stringify(fixedGallery) !== JSON.stringify(product.product_gallery)) {
          updates.product_gallery = fixedGallery;
          needsUpdate = true;
          console.log(`  🔧 ${product.title}: Fixed gallery images`);
        }
      }
      
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`  ❌ Error updating ${product.title}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
    
    // Fix manufacturer logos
    console.log('\n🔧 Fixing manufacturer logos...');
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, title, logo')
      .not('logo', 'is', null);
    
    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
    } else {
      let manufacturerUpdates = 0;
      
      for (const manufacturer of manufacturers || []) {
        if (manufacturer.logo && !manufacturer.logo.startsWith('assets/')) {
          const { error: updateError } = await supabase
            .from('manufacturers')
            .update({ logo: `assets/${manufacturer.logo}` })
            .eq('id', manufacturer.id);
          
          if (updateError) {
            console.error(`  ❌ Error updating manufacturer ${manufacturer.title}:`, updateError);
          } else {
            console.log(`  🔧 ${manufacturer.title}: ${manufacturer.logo} → assets/${manufacturer.logo}`);
            manufacturerUpdates++;
          }
        }
      }
      
      console.log(`  📊 Updated ${manufacturerUpdates} manufacturer logos`);
    }
    
    console.log(`\n✅ Summary:`);
    console.log(`  Updated ${updatedCount} product images`);
    console.log(`  Updated ${manufacturerUpdates || 0} manufacturer logos`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixImagePaths().catch(console.error); 