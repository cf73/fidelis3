import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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
      text += '\n';
    }
  });

  return text.trim();
}

async function updateReviewExcerpt() {
  try {
    console.log('🔧 Updating Premier DAC review excerpt...');
    
    // Get current reviews from Supabase
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('reivews_set')
      .eq('slug', 'premier-dac')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current data:', fetchError);
      return;
    }

    console.log('📖 Current reviews_set:', currentProduct.reivews_set);

    // Parse current reviews
    let currentReviews = [];
    if (currentProduct.reivews_set) {
      try {
        currentReviews = JSON.parse(currentProduct.reivews_set);
      } catch (e) {
        console.error('❌ Error parsing current reviews:', e);
        return;
      }
    }

    // Read the Statamic file to get the excerpt content
    const fileContent = fs.readFileSync('../content/collections/products/the-premier-dac.md', 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    
    if (!frontMatter.reivews_set || !Array.isArray(frontMatter.reivews_set)) {
      console.log('❌ No reviews found in the Statamic file');
      return;
    }

    // Extract the text from the first review
    const extractedText = extractTextFromStatamicContent(frontMatter.reivews_set[0].excerpt);
    console.log('🔍 Extracted text:', extractedText.substring(0, 100) + '...');

    // Update the existing review with the extracted text
    if (currentReviews.length > 0) {
      currentReviews[0].excerpt = extractedText;
      console.log('✏️  Updated review with excerpt text');
    } else {
      console.log('❌ No existing reviews to update');
      return;
    }

    console.log('📝 Final review data:', JSON.stringify(currentReviews, null, 2));

    // Update Supabase
    console.log('\n💾 Updating Supabase...');
    const { data, error } = await supabase
      .from('products')
      .update({ 
        reivews_set: JSON.stringify(currentReviews)
      })
      .eq('slug', 'premier-dac')
      .select();

    if (error) {
      console.error('❌ Error updating Supabase:', error);
    } else {
      console.log('✅ Successfully updated Premier DAC review excerpt!');
      console.log('Updated data:', data);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateReviewExcerpt();
