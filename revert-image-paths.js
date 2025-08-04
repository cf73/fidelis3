import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function revertImagePaths() {
  console.log('🔧 Reverting image paths in database...');
  
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
      
      // Revert product_hero_image - remove assets/ prefix
      if (product.product_hero_image && product.product_hero_image.startsWith('assets/')) {
        updates.product_hero_image = product.product_hero_image.replace('assets/', '');
        needsUpdate = true;
        console.log(`  🔧 ${product.title}: ${product.product_hero_image} → ${updates.product_hero_image}`);
      }
      
      // Revert product_gallery (array of images)
      if (product.product_gallery && Array.isArray(product.product_gallery)) {
        const fixedGallery = product.product_gallery.map(img => {
          if (img && img.startsWith('assets/')) {
            return img.replace('assets/', '');
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
    
    // Revert manufacturer logos
    console.log('\n🔧 Reverting manufacturer logos...');
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, title, logo')
      .not('logo', 'is', null);
    
    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
    } else {
      let manufacturerUpdates = 0;
      
      for (const manufacturer of manufacturers || []) {
        if (manufacturer.logo && manufacturer.logo.startsWith('assets/')) {
          const { error: updateError } = await supabase
            .from('manufacturers')
            .update({ logo: manufacturer.logo.replace('assets/', '') })
            .eq('id', manufacturer.id);
          
          if (updateError) {
            console.error(`  ❌ Error updating manufacturer ${manufacturer.title}:`, updateError);
          } else {
            console.log(`  🔧 ${manufacturer.title}: ${manufacturer.logo} → ${manufacturer.logo.replace('assets/', '')}`);
            manufacturerUpdates++;
          }
        }
      }
      
      console.log(`  📊 Updated ${manufacturerUpdates} manufacturer logos`);
    }
    
    console.log(`\n✅ Summary:`);
    console.log(`  Reverted ${updatedCount} product images`);
    console.log(`  Reverted ${manufacturerUpdates || 0} manufacturer logos`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

revertImagePaths().catch(console.error); 