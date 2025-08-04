import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImageSources() {
  console.log('🔍 Checking image sources in database...');
  
  try {
    // Check products with images
    console.log('\n📦 Checking products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, product_hero_image, product_gallery')
      .not('product_hero_image', 'is', null)
      .limit(10);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log(`📊 Found ${products?.length || 0} products with images`);
      
      if (products && products.length > 0) {
        console.log('\n🖼️  Sample product images:');
        products.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.title}:`);
          console.log(`     Hero image: ${product.product_hero_image}`);
          if (product.product_gallery && product.product_gallery.length > 0) {
            console.log(`     Gallery: ${product.product_gallery.slice(0, 3).join(', ')}...`);
          }
        });
      }
    }
    
    // Check manufacturers with logos
    console.log('\n🏭 Checking manufacturers...');
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, title, logo')
      .not('logo', 'is', null)
      .limit(10);
    
    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
    } else {
      console.log(`📊 Found ${manufacturers?.length || 0} manufacturers with logos`);
      
      if (manufacturers && manufacturers.length > 0) {
        console.log('\n🖼️  Sample manufacturer logos:');
        manufacturers.forEach((manufacturer, index) => {
          console.log(`  ${index + 1}. ${manufacturer.title}: ${manufacturer.logo}`);
        });
      }
    }
    
    // Check if any images are full URLs
    console.log('\n🌐 Checking for full URLs...');
    const { data: allProducts, error: allProductsError } = await supabase
      .from('products')
      .select('product_hero_image')
      .not('product_hero_image', 'is', null);
    
    if (!allProductsError && allProducts) {
      const fullUrls = allProducts.filter(p => p.product_hero_image && p.product_hero_image.startsWith('http'));
      console.log(`📊 Products with full URLs: ${fullUrls.length} of ${allProducts.length}`);
      
      if (fullUrls.length > 0) {
        console.log('🌐 Sample full URLs:');
        fullUrls.slice(0, 5).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.product_hero_image}`);
        });
      }
    }
    
    // Check if images might be coming from local files
    console.log('\n📁 Checking for local file references...');
    const { data: localRefs, error: localRefsError } = await supabase
      .from('products')
      .select('product_hero_image')
      .not('product_hero_image', 'is', null)
      .like('product_hero_image', '%/%');
    
    if (!localRefsError && localRefs) {
      console.log(`📊 Products with path-like references: ${localRefs.length}`);
      
      if (localRefs.length > 0) {
        console.log('📁 Sample path-like references:');
        localRefs.slice(0, 5).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.product_hero_image}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkImageSources().catch(console.error); 