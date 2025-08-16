import { createClient } from '@supabase/supabase-js';

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

async function debugReviewConversion() {
  try {
    console.log('🔍 Debugging review conversion...');
    
    // Get the DAC-1 product
    const { data: product, error } = await supabase
      .from('products')
      .select('id, title, slug, reivews_set')
      .eq('slug', 'dac1-reference')
      .single();
    
    if (error) {
      console.error('❌ Error fetching DAC-1:', error);
      return;
    }
    
    console.log(`📋 DAC-1 product: ${product.title}`);
    console.log(`   Reviews type: ${typeof product.reivews_set}`);
    
    if (typeof product.reivews_set === 'string') {
      console.log(`   Reviews string: ${product.reivews_set.substring(0, 300)}...`);
      
      try {
        const parsedReviews = JSON.parse(product.reivews_set);
        console.log(`   Parsed reviews:`, parsedReviews);
        
        if (Array.isArray(parsedReviews) && parsedReviews.length > 0) {
          const review = parsedReviews[0];
          console.log(`   First review:`, review);
          console.log(`   Excerpt type: ${typeof review.excerpt}`);
          console.log(`   Excerpt value:`, review.excerpt);
          
          if (review.excerpt) {
            const convertedExcerpt = convertBardToHtml(review.excerpt);
            console.log(`   Converted excerpt: ${convertedExcerpt.substring(0, 200)}...`);
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugReviewConversion();

