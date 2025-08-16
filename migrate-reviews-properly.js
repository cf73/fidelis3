import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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

    return {
      excerpt: extractedExcerpt.trim() || '',
      attribution: review.attribution || '',
      link: review.link || '',
      date_of_review: review.date_of_review || null
    };
  });
}

async function migrateReviews() {
  const productsDir = path.resolve('content/collections/products');
  const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));

  console.log(`Found ${files.length} product files to process...`);

  for (const file of files) {
    try {
      const filePath = path.join(productsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter } = matter(fileContent);
      
      const slug = path.basename(file, '.md');
      
      if (frontMatter.reivews_set) {
        console.log(`\nProcessing reviews for ${slug}...`);
        
        // First, get the current product data from Supabase
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('reivews_set')
          .eq('slug', slug)
          .single();

        if (fetchError) {
          console.error(`Error fetching current data for ${slug}:`, fetchError);
          continue;
        }

        // Parse existing reviews if any
        let existingReviews = [];
        if (currentProduct?.reivews_set) {
          try {
            existingReviews = JSON.parse(currentProduct.reivews_set);
            if (!Array.isArray(existingReviews)) {
              existingReviews = [];
            }
          } catch (e) {
            console.log(`Current reviews_set for ${slug} is not valid JSON, will replace`);
            existingReviews = [];
          }
        }

        // Extract and clean the review content from Statamic
        const newReviews = extractReviewContent(frontMatter.reivews_set);
        
        if (newReviews.length > 0) {
          console.log(`Found ${newReviews.length} review(s) in Statamic for ${slug}`);
          console.log(`Existing reviews in Supabase: ${existingReviews.length}`);
          
          // Check if we need to update
          let needsUpdate = false;
          
          if (existingReviews.length === 0) {
            console.log('No existing reviews, will add new ones');
            needsUpdate = true;
          } else {
            // Check if existing reviews have proper excerpt content
            const hasValidExcerpts = existingReviews.some(review => 
              review.excerpt && typeof review.excerpt === 'string' && review.excerpt.length > 10
            );
            
            if (!hasValidExcerpts) {
              console.log('Existing reviews lack proper excerpt content, will update');
              needsUpdate = true;
            } else {
              console.log('Existing reviews already have valid content, skipping');
            }
          }
          
          if (needsUpdate) {
            console.log('Sample new review excerpt:', newReviews[0].excerpt?.substring(0, 100) + '...');
            
            // Update the product in Supabase with the properly extracted reviews
            const { error } = await supabase
              .from('products')
              .update({ 
                reivews_set: JSON.stringify(newReviews)
              })
              .eq('slug', slug);

            if (error) {
              console.error(`Error updating ${slug}:`, error);
            } else {
              console.log(`✅ Successfully updated reviews for ${slug}`);
            }
          }
        } else {
          console.log(`No valid reviews found in Statamic for ${slug}`);
        }
      } else {
        // Don't log for products without reviews to reduce noise
        // console.log(`No reviews_set found for ${slug}`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log('\nMigration complete!');
}

migrateReviews();