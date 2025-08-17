import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSpecificProduct() {
  console.log('🔍 Checking C2700 product specifically...\n');

  try {
    // Check for C2700 product
    const { data: c2700Product, error: c2700Error } = await supabase
      .from('products')
      .select('*')
      .eq('title', 'C2700')
      .single();

    if (c2700Error) {
      console.error('❌ Error fetching C2700:', c2700Error);
    } else if (c2700Product) {
      console.log('✅ Found C2700 in database:');
      console.log(`  Title: ${c2700Product.title}`);
      console.log(`  Hero Image: ${c2700Product.product_hero_image || 'None'}`);
      console.log(`  Gallery: ${c2700Product.product_gallery || 'None'}`);
      console.log(`  ID: ${c2700Product.id}`);
    } else {
      console.log('❌ C2700 not found in database');
    }

    // Check if the image file exists in assets
    const { glob } = await import('glob');
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => file.split('/').pop()));

    const expectedImage = 'c2700-front-top-phono.jpg';
    console.log(`\n🔍 Checking for image: ${expectedImage}`);
    console.log(`  Image exists in assets: ${assetFilenames.has(expectedImage) ? '✅ Yes' : '❌ No'}`);

    // Check if image exists in Supabase Storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (storageError) {
      console.error('❌ Error listing storage files:', storageError);
    } else {
      const uploadedImages = new Set(storageFiles.map(file => file.name));
      console.log(`  Image exists in Supabase Storage: ${uploadedImages.has(expectedImage) ? '✅ Yes' : '❌ No'}`);
    }

    // Check all products with similar names
    const { data: similarProducts, error: similarError } = await supabase
      .from('products')
      .select('title, product_hero_image')
      .ilike('title', '%c2700%');

    if (similarError) {
      console.error('❌ Error fetching similar products:', similarError);
    } else {
      console.log('\n🔍 Products with similar names:');
      similarProducts.forEach(product => {
        console.log(`  ${product.title}: ${product.product_hero_image || 'No image'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSpecificProduct().catch(console.error); 