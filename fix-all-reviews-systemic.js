import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

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

async function fixAllReviewsSystemic() {
  try {
    console.log('🔧 Fixing all reviews systematically...');
    
    // Get all products that have reviews_set as a string (incorrect format)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, slug, reivews_set')
      .not('reivews_set', 'is', null)
      .limit(200); // Process more products
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`📋 Found ${products.length} products with reviews_set field`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        console.log(`\n🔍 Processing: ${product.title}`);
        
        // Check if reviews are stored as string (incorrect format)
        if (typeof product.reivews_set === 'string') {
          console.log(`   ❌ Reviews stored as string, attempting to parse...`);
          
          try {
            // Try to parse the JSON string back to an array
            const parsedReviews = JSON.parse(product.reivews_set);
            
            if (Array.isArray(parsedReviews)) {
              console.log(`   ✅ Successfully parsed ${parsedReviews.length} reviews from string`);
              
              // Convert the parsed reviews to proper format
              const convertedReviews = convertReviews(parsedReviews);
              
              // Update the product
              const { error: updateError } = await supabase
                .from('products')
                .update({ reivews_set: convertedReviews })
                .eq('id', product.id);
              
              if (updateError) {
                console.error(`   ❌ Error updating ${product.title}:`, updateError.message);
                errorCount++;
              } else {
                console.log(`   ✅ Successfully fixed reviews for ${product.title}`);
                fixedCount++;
              }
            } else {
              console.log(`   ❌ Parsed data is not an array`);
              errorCount++;
            }
          } catch (parseError) {
            console.error(`   ❌ Error parsing JSON for ${product.title}:`, parseError.message);
            errorCount++;
          }
        } else if (Array.isArray(product.reivews_set)) {
          console.log(`   ✅ Reviews already in correct array format`);
          skippedCount++;
        } else {
          console.log(`   ❓ Unknown reviews format: ${typeof product.reivews_set}`);
          errorCount++;
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing ${product.title}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Fix Summary:');
    console.log(`✅ Successfully fixed: ${fixedCount} products`);
    console.log(`⚠️  Skipped (already correct): ${skippedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    
    // Verify the fixes
    console.log('\n🔍 Verifying fixes...');
    const { data: sampleProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, title, reivews_set')
      .not('reivews_set', 'is', null)
      .limit(10);
    
    if (verifyError) {
      console.error('❌ Error verifying fixes:', verifyError.message);
    } else {
      console.log('📋 Sample products after fixes:');
      sampleProducts.forEach(product => {
        const isArray = Array.isArray(product.reivews_set);
        const count = isArray ? product.reivews_set.length : 0;
        console.log(`   - ${product.title}: ${isArray ? '✅' : '❌'} Array with ${count} reviews`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

// Run the fix
fixAllReviewsSystemic();
