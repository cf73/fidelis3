import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';

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

function extractTextFromStatamicContent(content) {
  if (!content || !Array.isArray(content)) {
    return '';
  }

  let text = '';
  
  content.forEach(item => {
    if (item.type === 'paragraph' && item.content && Array.isArray(item.content)) {
      item.content.forEach(textItem => {
        if (textItem.type === 'text' && textItem.text) {
          text += textItem.text + ' ';
        }
      });
      text += '\n'; // Add paragraph break
    }
  });

  return text.trim();
}

async function fixPremierDacReview() {
  try {
    console.log('🔧 Fixing Premier DAC review...');
    
    // Read the Statamic file
    const fileContent = fs.readFileSync('../content/collections/products/the-premier-dac.md', 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    
    if (!frontMatter.reivews_set || !Array.isArray(frontMatter.reivews_set)) {
      console.log('❌ No reviews found in the Statamic file');
      return;
    }

    console.log(`📖 Found ${frontMatter.reivews_set.length} review(s) in Statamic file`);
    
    // Process each review
    const processedReviews = frontMatter.reivews_set.map((review, index) => {
      console.log(`\nProcessing review ${index + 1}:`);
      console.log(`- Attribution: ${review.attribution}`);
      console.log(`- Link: ${review.link}`);
      console.log(`- Date: ${review.date_of_review}`);
      
      // Extract the text content from the nested structure
      const extractedText = extractTextFromStatamicContent(review.excerpt);
      console.log(`- Extracted text: "${extractedText.substring(0, 100)}${extractedText.length > 100 ? '...' : ''}"`);
      
      return {
        excerpt: extractedText,
        attribution: review.attribution,
        link: review.link,
        date_of_review: review.date_of_review
      };
    });

    console.log('\n📝 Processed reviews data:');
    console.log(JSON.stringify(processedReviews, null, 2));

    // Update Supabase
    console.log('\n💾 Updating Supabase...');
    const { data, error } = await supabase
      .from('products')
      .update({ 
        reivews_set: JSON.stringify(processedReviews)
      })
      .eq('slug', 'premier-dac')
      .select();

    if (error) {
      console.error('❌ Error updating Supabase:', error);
    } else {
      console.log('✅ Successfully updated Premier DAC reviews in Supabase!');
      console.log('Updated product:', data);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixPremierDacReview();
