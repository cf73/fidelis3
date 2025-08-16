import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';

const supabaseUrl = 'https://lkgjhgfdyuiovbnmkjhg.supabase.co';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZ2poZ2ZkeXVpb3Zibm1ramhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjQ4MTcwMCwiZXhwIjoyMDMyMDU3NzAwfQ.2bgJWT6lGCNVoLmwdRDcf_mq2Vny2qkG6Ga2v46i8t4';

const supabase = createClient(supabaseUrl, supabaseKey);

function extractReviewContent(reviewsSet) {
  if (!reviewsSet || !Array.isArray(reviewsSet)) {
    return [];
  }

  return reviewsSet.map(review => {
    let extractedExcerpt = '';
    
    // Extract text from nested Statamic structure
    if (review.excerpt && Array.isArray(review.excerpt)) {
      review.excerpt.forEach(item => {
        if (item.type === 'paragraph' && item.content && Array.isArray(item.content)) {
          item.content.forEach(textItem => {
            if (textItem.type === 'text' && textItem.text) {
              extractedExcerpt += textItem.text + ' ';
            }
          });
        }
      });
    }

    // Preserve all existing fields and just enhance the excerpt
    return {
      ...review,
      excerpt: extractedExcerpt.trim() || review.excerpt || ''
    };
  });
}

async function testSingleReviewMigration() {
  const filePath = './content/collections/products/the-premier-dac.md';
  const slug = 'the-premier-dac';
  
  console.log(`Testing review migration for: ${slug}`);
  
  try {
    // Read the Statamic file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    
    console.log('\n📖 Reading Statamic data...');
    if (frontMatter.reivews_set) {
      console.log(`Found ${frontMatter.reivews_set.length} review(s) in Statamic file`);
      
      // Show what we found in Statamic
      frontMatter.reivews_set.forEach((review, index) => {
        console.log(`\nStatamic Review ${index + 1}:`);
        console.log(`- Attribution: ${review.attribution || 'Not set'}`);
        console.log(`- Link: ${review.link || 'Not set'}`);
        console.log(`- Date: ${review.date_of_review || 'Not set'}`);
        console.log(`- Excerpt structure: ${Array.isArray(review.excerpt) ? 'Array of ' + review.excerpt.length + ' items' : typeof review.excerpt}`);
      });
    } else {
      console.log('No reviews_set found in Statamic file');
      return;
    }
    
    // Skip Supabase check for now - just process the data
    console.log('\n🗃️  Skipping Supabase check for testing...');

    // Extract and enhance the reviews
    const enhancedReviews = extractReviewContent(frontMatter.reivews_set);
    
    console.log('\n🔧 Processing reviews...');
    enhancedReviews.forEach((review, index) => {
      console.log(`\nProcessed Review ${index + 1}:`);
      console.log(`- Attribution: ${review.attribution || 'Not set'}`);
      console.log(`- Link: ${review.link || 'Not set'}`);
      console.log(`- Date: ${review.date_of_review || 'Not set'}`);
      console.log(`- Excerpt text: "${review.excerpt?.substring(0, 100)}${review.excerpt?.length > 100 ? '...' : ''}"`);
    });

    // Ask for confirmation before updating
    console.log('\n❓ This will update the Supabase record with the processed review data.');
    console.log('The enhanced reviews will replace the current reviews_set value.');
    console.log('\nProcessed data to be saved:');
    console.log(JSON.stringify(enhancedReviews, null, 2));
    
    // For safety, let's just show what would be updated without actually doing it
    console.log('\n🔍 DRY RUN - No actual changes made to database');
    console.log('To apply changes, uncomment the update section in the script');
    
    /* Uncomment this section to actually perform the update:
    
    const { error } = await supabase
      .from('products')
      .update({ 
        reivews_set: JSON.stringify(enhancedReviews)
      })
      .eq('slug', slug);

    if (error) {
      console.error('Error updating:', error);
    } else {
      console.log('✅ Successfully updated reviews!');
    }
    
    */
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSingleReviewMigration();
