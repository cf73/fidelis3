import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

// Use service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

function processReviews(reviewsSet) {
  if (!reviewsSet || !Array.isArray(reviewsSet)) {
    return [];
  }

  return reviewsSet.map(review => {
    // Extract the text content from the nested structure
    const extractedText = extractTextFromStatamicContent(review.excerpt);
    
    return {
      excerpt: extractedText || '',
      attribution: review.attribution || '',
      link: review.link || '',
      date_of_review: review.date_of_review || null
    };
  });
}

async function migrateAllReviews() {
  try {
    console.log('🚀 Starting migration of all product reviews...');
    
    const productsDir = path.resolve('../content/collections/products');
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));

    console.log(`📁 Found ${files.length} product files to process`);

    let processedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(productsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter } = matter(fileContent);
        
        const slug = path.basename(file, '.md');
        processedCount++;

        console.log(`\n📖 Processing ${slug} (${processedCount}/${files.length})`);

        if (!frontMatter.reivews_set || !Array.isArray(frontMatter.reivews_set)) {
          console.log('   ⏭️  No reviews in Statamic file, skipping');
          skippedCount++;
          continue;
        }

        // Get current data from Supabase
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('reivews_set')
          .eq('slug', slug)
          .single();

        if (fetchError) {
          console.log(`   ❌ Product not found in Supabase: ${slug}`);
          skippedCount++;
          continue;
        }

        // Process the reviews from Statamic
        const processedReviews = processReviews(frontMatter.reivews_set);
        
        if (processedReviews.length === 0) {
          console.log('   ⏭️  No valid reviews to process, skipping');
          skippedCount++;
          continue;
        }

        // Check if we need to update (if current reviews lack content)
        let needsUpdate = false;
        let currentReviews = [];
        
        if (currentProduct.reivews_set) {
          try {
            currentReviews = JSON.parse(currentProduct.reivews_set);
            // Check if existing reviews have proper excerpt content
            const hasValidExcerpts = currentReviews.some(review => 
              review.excerpt && typeof review.excerpt === 'string' && review.excerpt.length > 10
            );
            needsUpdate = !hasValidExcerpts;
          } catch (e) {
            needsUpdate = true;
          }
        } else {
          needsUpdate = true;
        }

        if (!needsUpdate) {
          console.log('   ✅ Already has valid review content, skipping');
          skippedCount++;
          continue;
        }

        console.log(`   🔧 Found ${processedReviews.length} review(s) to update`);
        console.log(`   📝 Sample excerpt: "${processedReviews[0].excerpt.substring(0, 80)}..."`);

        // Update Supabase with the processed reviews
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            reivews_set: JSON.stringify(processedReviews)
          })
          .eq('slug', slug);

        if (updateError) {
          console.log(`   ❌ Error updating ${slug}:`, updateError.message);
          skippedCount++;
        } else {
          console.log(`   ✅ Successfully updated reviews for ${slug}`);
          updatedCount++;
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${file}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Files processed: ${processedCount}`);
    console.log(`   • Products updated: ${updatedCount}`);
    console.log(`   • Products skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateAllReviews();
