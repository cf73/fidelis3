import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

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
    const extractedText = extractTextFromStatamicContent(review.excerpt);
    
    return {
      excerpt: extractedText || '',
      attribution: review.attribution || '',
      link: review.link || '',
      date_of_review: review.date_of_review || null
    };
  });
}

async function migrateReviewsByUuid() {
  try {
    console.log('🚀 Starting UUID-based migration of product reviews...');
    
    const productsDir = path.resolve('../content/collections/products');
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));

    console.log(`📁 Found ${files.length} product files to process`);

    let processedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(productsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter } = matter(fileContent);
        
        const filename = path.basename(file, '.md');
        processedCount++;

        console.log(`\n📖 Processing ${filename} (${processedCount}/${files.length})`);

        // Check if the file has an ID (UUID)
        if (!frontMatter.id) {
          console.log('   ⏭️  No UUID in file, skipping');
          skippedCount++;
          continue;
        }

        // Check if it has reviews
        if (!frontMatter.reivews_set || !Array.isArray(frontMatter.reivews_set)) {
          console.log('   ⏭️  No reviews in Statamic file, skipping');
          skippedCount++;
          continue;
        }

        console.log(`   🆔 UUID: ${frontMatter.id}`);
        console.log(`   📝 Title: ${frontMatter.title || 'No title'}`);

        // Get current data from Supabase using UUID
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('slug, reivews_set')
          .eq('id', frontMatter.id)
          .single();

        if (fetchError) {
          console.log(`   ❌ Product UUID not found in Supabase: ${frontMatter.id}`);
          notFoundCount++;
          continue;
        }

        console.log(`   🗃️  Found in Supabase with slug: ${currentProduct.slug}`);

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

        // Update Supabase using UUID
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            reivews_set: JSON.stringify(processedReviews)
          })
          .eq('id', frontMatter.id);

        if (updateError) {
          console.log(`   ❌ Error updating ${filename}:`, updateError.message);
          skippedCount++;
        } else {
          console.log(`   ✅ Successfully updated reviews for ${filename} (slug: ${currentProduct.slug})`);
          updatedCount++;
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${file}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n🎉 UUID-based migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Files processed: ${processedCount}`);
    console.log(`   • Products updated: ${updatedCount}`);
    console.log(`   • Products skipped: ${skippedCount}`);
    console.log(`   • UUIDs not found in DB: ${notFoundCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateReviewsByUuid();
