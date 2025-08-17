// fix-news-images-simple.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to extract filename from full URL
function extractFilenameFromUrl(url) {
  if (!url) return null;
  
  // Handle full Supabase URLs
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  
  // Handle relative paths
  if (url.includes('/')) {
    return url.split('/').pop();
  }
  
  // Already a filename
  return url;
}

async function fixNewsImagePaths() {
  console.log('🔧 Fixing news image paths...\n');

  try {
    // Get all news from Supabase
    const { data: news, error } = await supabase
      .from('news')
      .select('id, title, image')
      .eq('published', true);

    if (error) {
      console.error('❌ Error fetching news:', error);
      return;
    }

    console.log(`📊 Found ${news.length} news items\n`);

    let fixedCount = 0;
    let notFixedCount = 0;

    for (const item of news) {
      console.log(`\n📄 Processing: ${item.title}`);
      console.log(`   Current image: ${item.image || 'NO IMAGE'}`);
      
      if (!item.image) {
        console.log(`   ⚠️  No image to fix`);
        continue;
      }

      // Extract filename from the image path
      const filename = extractFilenameFromUrl(item.image);
      console.log(`   Extracted filename: ${filename}`);
      
      if (!filename) {
        console.log(`   ❌ Could not extract filename`);
        notFixedCount++;
        continue;
      }

      // Only update if the current image path is different from the filename
      if (item.image !== filename) {
        // Update the news record with just the filename
        const { error: updateError } = await supabase
          .from('news')
          .update({ image: filename })
          .eq('id', item.id);

        if (updateError) {
          console.error(`   ❌ Error updating record:`, updateError);
          notFixedCount++;
        } else {
          console.log(`   ✅ Updated database record: ${item.image} -> ${filename}`);
          fixedCount++;
        }
      } else {
        console.log(`   ℹ️  Already correct format`);
      }
    }

    console.log(`\n📊 Fix Summary:`);
    console.log(`   ✅ Successfully fixed: ${fixedCount}`);
    console.log(`   ❌ Not fixed: ${notFixedCount}`);

    // Show final verification
    console.log(`\n🔍 Final verification:`);
    const { data: finalNews, error: finalError } = await supabase
      .from('news')
      .select('id, title, image')
      .eq('published', true);

    if (!finalError && finalNews) {
      const withImages = finalNews.filter(news => news.image);
      const withoutImages = finalNews.filter(news => !news.image);
      
      console.log(`   News items with images: ${withImages.length}`);
      console.log(`   News items without images: ${withoutImages.length}`);
      
      console.log(`\n📋 Updated image paths:`);
      finalNews.forEach(news => {
        if (news.image && !news.image.includes('http')) {
          console.log(`   - ${news.title}: ${news.image}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
}

// Run the fix
fixNewsImagePaths();
