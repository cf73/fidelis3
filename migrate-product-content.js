import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM'; // Service role key

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to convert Statamic Bard content to HTML
function convertBardToHtml(bardContent) {
  if (!bardContent || !Array.isArray(bardContent)) {
    return '';
  }

  let html = '';
  
  for (const block of bardContent) {
    if (block.type === 'paragraph') {
      html += '<p>';
      if (block.content && Array.isArray(block.content)) {
        for (const content of block.content) {
          if (content.type === 'text') {
            html += content.text || '';
          } else if (content.type === 'hard_break') {
            html += '<br>';
          }
        }
      }
      html += '</p>';
    } else if (block.type === 'heading') {
      const level = block.attrs?.level || 3;
      html += `<h${level}>`;
      if (block.content && Array.isArray(block.content)) {
        for (const content of block.content) {
          if (content.type === 'text') {
            html += content.text || '';
          }
        }
      }
      html += `</h${level}>`;
    }
  }
  
  return html;
}

// Function to convert reviews to the expected format
function convertReviews(reviewsSet) {
  if (!reviewsSet || !Array.isArray(reviewsSet)) {
    return [];
  }

  return reviewsSet.map(review => ({
    excerpt: review.excerpt ? convertBardToHtml(review.excerpt) : null,
    attribution: review.attribution || null,
    link: review.link || null,
    date_of_review: review.date_of_review || null
  }));
}

async function migrateProductContent() {
  try {
    console.log('🚀 Starting product content migration...');
    
    // Read all product files from Statamic
    const productsDir = path.join(__dirname, 'content', 'collections', 'products');
    const productFiles = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));
    
    console.log(`📁 Found ${productFiles.length} product files`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const file of productFiles) {
      try {
        const filePath = path.join(productsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Parse the YAML front matter - look for content between --- markers
        const yamlMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!yamlMatch) {
          console.log(`⚠️  Skipping ${file}: No YAML front matter found`);
          skippedCount++;
          continue;
        }
        
        const yamlContent = yamlMatch[1];
        const productData = yaml.load(yamlContent);
        
        if (!productData.id) {
          console.log(`⚠️  Skipping ${file}: No ID found`);
          skippedCount++;
          continue;
        }
        
        // Convert content to HTML
        const description = productData.description ? convertBardToHtml(productData.description) : null;
        const specs = productData.specs ? convertBardToHtml(productData.specs) : null;
        const reviews = productData.reivews_set ? convertReviews(productData.reivews_set) : null;
        
        // Check if we have any content to migrate
        if (!description && !specs && (!reviews || reviews.length === 0)) {
          console.log(`⚠️  Skipping ${file}: No content to migrate`);
          skippedCount++;
          continue;
        }
        
        // Update the product in Supabase
        const updateData = {};
        if (description) updateData.content = description;
        if (specs) updateData.specs = specs;
        if (reviews && reviews.length > 0) updateData.reivews_set = reviews;
        
        const { data, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productData.id);
        
        if (error) {
          console.error(`❌ Error updating ${file} (${productData.id}):`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Migrated ${file} (${productData.id})`);
          if (description) console.log(`   - Description: ${description.length} chars`);
          if (specs) console.log(`   - Specs: ${specs.length} chars`);
          if (reviews && reviews.length > 0) console.log(`   - Reviews: ${reviews.length} reviews`);
          migratedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} products`);
    console.log(`⚠️  Skipped: ${skippedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    
    // Verify the migration by checking a few products
    console.log('\n🔍 Verifying migration...');
    const { data: sampleProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, title, content, specs, reivews_set')
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError.message);
    } else {
      console.log('📋 Sample products after migration:');
      sampleProducts.forEach(product => {
        console.log(`   - ${product.title}:`);
        console.log(`     Content: ${product.content ? '✅' : '❌'}`);
        console.log(`     Specs: ${product.specs ? '✅' : '❌'}`);
        console.log(`     Reviews: ${product.reivews_set && product.reivews_set.length > 0 ? '✅' : '❌'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateProductContent();
