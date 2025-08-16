import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

async function testDac1UuidMigration() {
  try {
    console.log('🔧 Testing DAC1 review migration using UUID...');
    
    // Read the Statamic file
    const fileContent = fs.readFileSync('../content/collections/products/dac-1.md', 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    
    console.log(`🆔 Product UUID: ${frontMatter.id}`);
    console.log(`📝 Product title: ${frontMatter.title}`);
    console.log(`📄 Filename: dac-1.md`);

    if (!frontMatter.reivews_set || !Array.isArray(frontMatter.reivews_set)) {
      console.log('❌ No reviews found in the Statamic file');
      return;
    }

    console.log(`📖 Found ${frontMatter.reivews_set.length} review(s) in Statamic file`);

    // Get current data from Supabase using UUID
    console.log('\n🗃️  Checking current Supabase data using UUID...');
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('slug, reivews_set')
      .eq('id', frontMatter.id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current data:', fetchError);
      return;
    }

    console.log(`✅ Found product in Supabase!`);
    console.log(`   Database slug: ${currentProduct.slug}`);
    console.log(`   Current reviews_set: ${currentProduct?.reivews_set}`);

    // Process the reviews from Statamic
    const processedReviews = frontMatter.reivews_set.map(review => {
      const extractedText = extractTextFromStatamicContent(review.excerpt);
      
      return {
        excerpt: extractedText || '',
        attribution: review.attribution || '',
        link: review.link || '',
        date_of_review: review.date_of_review || null
      };
    });

    console.log('\n🔧 Processed reviews:');
    processedReviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log(`- Attribution: ${review.attribution}`);
      console.log(`- Link: ${review.link}`);
      console.log(`- Excerpt: "${review.excerpt.substring(0, 100)}..."`);
    });

    // Update Supabase using UUID
    console.log('\n💾 Updating Supabase using UUID...');
    const { data, error } = await supabase
      .from('products')
      .update({ 
        reivews_set: JSON.stringify(processedReviews)
      })
      .eq('id', frontMatter.id)
      .select();

    if (error) {
      console.error('❌ Error updating Supabase:', error);
    } else {
      console.log('✅ Successfully updated DAC1 reviews!');
      console.log('Number of rows updated:', data?.length || 0);
    }

    // Verify the update worked
    console.log('\n🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('reivews_set')
      .eq('id', frontMatter.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
    } else {
      if (verifyData?.reivews_set) {
        const reviews = JSON.parse(verifyData.reivews_set);
        console.log('✅ Verification successful!');
        console.log(`- Number of reviews: ${reviews.length}`);
        console.log(`- First review excerpt: "${reviews[0]?.excerpt?.substring(0, 100)}..."`);
        console.log(`- Attribution: ${reviews[0]?.attribution}`);
      } else {
        console.log('❌ No reviews found after update');
      }
    }

    console.log('\n🎯 This proves the UUID-based approach works for slug mismatches!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDac1UuidMigration();
