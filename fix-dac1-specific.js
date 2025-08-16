import fs from 'fs';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Function to convert Statamic Bard content to HTML
function convertBardToHtml(bardContent) {
  if (!bardContent) {
    return '';
  }

  let html = '';
  
  // Handle case where bardContent is a single block object (not an array)
  const blocks = Array.isArray(bardContent) ? bardContent : [bardContent];
  
  for (const block of blocks) {
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

async function fixDac1Specific() {
  try {
    console.log('🔧 Fixing DAC-1 reviews specifically...');
    
    // Read the DAC-1 file from Statamic
    const filePath = path.join(__dirname, 'content', 'collections', 'products', 'dac1-reference.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the YAML front matter
    const yamlMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!yamlMatch) {
      console.error('❌ No YAML front matter found in DAC-1 file');
      return;
    }
    
    const yamlContent = yamlMatch[1];
    const productData = yaml.load(yamlContent);
    
    console.log(`📋 DAC-1 data from file:`);
    console.log(`   ID: ${productData.id}`);
    console.log(`   Has reviews_set: ${!!productData.reivews_set}`);
    
    if (productData.reivews_set) {
      console.log(`   Reviews type: ${typeof productData.reivews_set}`);
      if (Array.isArray(productData.reivews_set)) {
        console.log(`   Reviews count: ${productData.reivews_set.length}`);
        if (productData.reivews_set.length > 0) {
          const review = productData.reivews_set[0];
          console.log(`   First review excerpt type: ${typeof review.excerpt}`);
          console.log(`   First review excerpt: ${JSON.stringify(review.excerpt).substring(0, 200)}...`);
        }
      }
    }
    
    // Convert reviews to proper format
    const reviews = convertReviews(productData.reivews_set);
    
    if (reviews.length === 0) {
      console.log('❌ No reviews to migrate');
      return;
    }
    
    console.log(`✅ Converting ${reviews.length} reviews...`);
    console.log(`   First review excerpt: ${reviews[0].excerpt.substring(0, 200)}...`);
    
    // Update the DAC-1 product in Supabase
    const { data, error } = await supabase
      .from('products')
      .update({ reivews_set: reviews })
      .eq('id', productData.id);
    
    if (error) {
      console.error(`❌ Error updating DAC-1:`, error.message);
    } else {
      console.log(`✅ Successfully updated DAC-1 reviews`);
      
      // Verify the update
      const { data: verifyProduct, error: verifyError } = await supabase
        .from('products')
        .select('id, title, reivews_set')
        .eq('id', productData.id)
        .single();
      
      if (verifyError) {
        console.error('❌ Error verifying update:', verifyError);
      } else {
        const isArray = Array.isArray(verifyProduct.reivews_set);
        const count = isArray ? verifyProduct.reivews_set.length : 0;
        const hasContent = isArray && count > 0 && verifyProduct.reivews_set[0].excerpt && verifyProduct.reivews_set[0].excerpt.trim() !== '';
        console.log(`✅ Verification: ${isArray ? '✅' : '❌'} Array with ${count} reviews, has content: ${hasContent ? '✅' : '❌'}`);
        if (hasContent) {
          console.log(`   First review excerpt: ${verifyProduct.reivews_set[0].excerpt.substring(0, 200)}...`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

// Run the fix
fixDac1Specific();
