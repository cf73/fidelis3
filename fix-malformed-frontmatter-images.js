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

// Function to parse malformed front matter manually
function parseStatamicFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // First try standard gray-matter parsing
    try {
      const parsed = matter(content);
      if (parsed.data && Object.keys(parsed.data).length > 0) {
        return parsed.data;
      }
    } catch (e) {
      // Fall through to manual parsing
    }
    
    // Manual parsing for files without proper YAML delimiters
    const lines = content.split('\n');
    const frontMatter = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      // Parse key: value pairs
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Skip empty values
        if (value) {
          frontMatter[key] = value;
        }
      }
    }
    
    return frontMatter;
  } catch (error) {
    console.log(`   ❌ Error parsing ${filePath}:`, error.message);
    return null;
  }
}

async function fixMalformedFrontmatterImages() {
  try {
    console.log('🔍 Finding products with malformed front matter and missing images...');
    
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
    const allFiles = fs.readdirSync(stalamicDir).filter(file => file.endsWith('.md'));
    
    // Create a map of UUID -> file data for faster lookup
    console.log('📁 Parsing all Statamic files...');
    const stalamicMap = new Map();
    let malformedCount = 0;
    let properFormatCount = 0;
    
    for (const file of allFiles) {
      const filePath = path.join(stalamicDir, file);
      const frontMatter = parseStatamicFile(filePath);
      
      if (frontMatter && frontMatter.id) {
        stalamicMap.set(frontMatter.id, {
          file,
          frontMatter
        });
        
        // Check if this was malformed (no standard YAML parsing)
        try {
          const standardParsed = matter(fs.readFileSync(filePath, 'utf-8'));
          if (!standardParsed.data || Object.keys(standardParsed.data).length === 0) {
            malformedCount++;
          } else {
            properFormatCount++;
          }
        } catch (e) {
          malformedCount++;
        }
      }
    }
    
    console.log(`📋 Parsed ${allFiles.length} files:`);
    console.log(`   • Proper YAML format: ${properFormatCount}`);
    console.log(`   • Malformed front matter: ${malformedCount}`);
    console.log(`   • Successfully mapped: ${stalamicMap.size}`);

    let fixedCount = 0;
    let skippedCount = 0;
    let uploadedCount = 0;

    for (const product of productsWithNullImages) {
      console.log(`\n🔍 Checking ${product.slug}...`);
      
      // Look up by UUID
      const stalamicData = stalamicMap.get(product.id);
      
      if (!stalamicData) {
        console.log('   ❌ No matching Statamic file found');
        skippedCount++;
        continue;
      }
      
      if (!stalamicData.frontMatter.product_hero_image) {
        console.log('   ⏭️  No image in Statamic either');
        skippedCount++;
        continue;
      }
      
      console.log(`   📸 Found image: ${stalamicData.frontMatter.product_hero_image}`);
      console.log(`   📄 From file: ${stalamicData.file}`);
      
      // Update the database
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          product_hero_image: stalamicData.frontMatter.product_hero_image 
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.log(`   ❌ Failed to update database: ${updateError.message}`);
        skippedCount++;
        continue;
      }
      
      console.log(`   ✅ Updated database with image path`);
      fixedCount++;
      
      // Check if image exists in storage, upload if missing
      const imagePath = stalamicData.frontMatter.product_hero_image;
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
            uploadedCount++;
          }
        } else {
          console.log(`   ❌ Image file not found in backup: ${backupPath}`);
        }
      } else {
        console.log(`   ✅ Image already exists in storage`);
      }
    }

    console.log('\n🎉 Malformed front matter fix completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Products checked: ${productsWithNullImages.length}`);
    console.log(`   • Database image paths fixed: ${fixedCount}`);
    console.log(`   • Images uploaded: ${uploadedCount}`);
    console.log(`   • Skipped (no image or error): ${skippedCount}`);
    console.log(`   • Malformed files handled: ${malformedCount}`);

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixMalformedFrontmatterImages();
