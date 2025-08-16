import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixMissingImagePaths() {
  try {
    console.log('🔍 Finding products with missing image paths...');
    
    // Get all products that have null image paths
    const { data: productsWithNullImages, error: fetchError } = await supabase
      .from('products')
      .select('id, slug, title, product_hero_image')
      .is('product_hero_image', null);

    if (fetchError) {
      console.log('❌ Error fetching products:', fetchError.message);
      return;
    }

    console.log(`📊 Found ${productsWithNullImages.length} products with null image paths`);

    if (productsWithNullImages.length === 0) {
      console.log('✅ No products need fixing');
      return;
    }

    const stalamicDir = path.resolve('content/collections/products');
    let fixedCount = 0;
    let skippedCount = 0;

    for (const product of productsWithNullImages) {
      console.log(`\\n🔍 Checking ${product.slug}...`);
      
      // Find corresponding Statamic file by UUID
      const files = fs.readdirSync(stalamicDir).filter(file => file.endsWith('.md'));
      let stalamicFile = null;
      
      for (const file of files) {
        const filePath = path.join(stalamicDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter } = matter(fileContent);
        
        if (frontMatter.id === product.id) {
          stalamicFile = { file, frontMatter };
          break;
        }
      }
      
      if (!stalamicFile) {
        console.log('   ❌ No matching Statamic file found');
        skippedCount++;
        continue;
      }
      
      if (!stalamicFile.frontMatter.product_hero_image) {
        console.log('   ⏭️  No image in Statamic either');
        skippedCount++;
        continue;
      }
      
      console.log(`   📸 Found image: ${stalamicFile.frontMatter.product_hero_image}`);
      
      // Update the database
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          product_hero_image: stalamicFile.frontMatter.product_hero_image 
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.log(`   ❌ Failed to update: ${updateError.message}`);
        skippedCount++;
        continue;
      }
      
      console.log(`   ✅ Updated ${product.slug} with image path`);
      fixedCount++;
      
      // Check if image exists in storage, upload if missing
      const imagePath = stalamicFile.frontMatter.product_hero_image;
      const { data: existingImage, error: existsError } = await supabase.storage
        .from('images')
        .download(imagePath);
        
      if (existsError) {
        console.log(`   📤 Uploading missing image...`);
        const backupPath = path.resolve('public_backup/assets/main', imagePath);
        
        if (fs.existsSync(backupPath)) {
          const fileBuffer = fs.readFileSync(backupPath);
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(imagePath, fileBuffer, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.log(`   ❌ Upload failed: ${uploadError.message}`);
          } else {
            console.log(`   ✅ Image uploaded successfully`);
          }
        } else {
          console.log(`   ❌ Image file not found in backup`);
        }
      } else {
        console.log(`   ✅ Image already exists in storage`);
      }
    }

    console.log('\\n🎉 Missing image paths fix completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Products checked: ${productsWithNullImages.length}`);
    console.log(`   • Image paths fixed: ${fixedCount}`);
    console.log(`   • Skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixMissingImagePaths();
