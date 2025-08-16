// analyze-news-images.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyzeNewsImages() {
  console.log('🔍 Analyzing news images...\n');

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

    const imageAnalysis = {
      withImages: 0,
      withoutImages: 0,
      imagePaths: [],
      brokenImages: []
    };

    for (const item of news) {
      console.log(`\n📄 ${item.title}`);
      console.log(`   Image: ${item.image || 'NO IMAGE'}`);
      
      if (item.image) {
        imageAnalysis.withImages++;
        imageAnalysis.imagePaths.push(item.image);
        
        // Test if the image URL is accessible
        try {
          const imageUrl = supabase.storage.from('images').getPublicUrl(item.image).data.publicUrl;
          console.log(`   URL: ${imageUrl}`);
          
          // Check if the file exists in storage
          const { data: fileData, error: fileError } = await supabase.storage
            .from('images')
            .list('', {
              search: item.image
            });
          
          if (fileError) {
            console.log(`   ❌ Storage error: ${fileError.message}`);
            imageAnalysis.brokenImages.push({
              title: item.title,
              image: item.image,
              error: fileError.message
            });
          } else if (!fileData || fileData.length === 0) {
            console.log(`   ❌ File not found in storage`);
            imageAnalysis.brokenImages.push({
              title: item.title,
              image: item.image,
              error: 'File not found in storage'
            });
          } else {
            console.log(`   ✅ File found in storage`);
          }
        } catch (error) {
          console.log(`   ❌ Error generating URL: ${error.message}`);
          imageAnalysis.brokenImages.push({
            title: item.title,
            image: item.image,
            error: error.message
          });
        }
      } else {
        imageAnalysis.withoutImages++;
      }
    }

    console.log(`\n📊 Analysis Summary:`);
    console.log(`   News items with images: ${imageAnalysis.withImages}`);
    console.log(`   News items without images: ${imageAnalysis.withoutImages}`);
    console.log(`   Broken images: ${imageAnalysis.brokenImages.length}`);

    if (imageAnalysis.brokenImages.length > 0) {
      console.log(`\n❌ Broken Images:`);
      imageAnalysis.brokenImages.forEach(item => {
        console.log(`   - ${item.title}: ${item.image} (${item.error})`);
      });
    }

    // Show unique image paths
    const uniquePaths = [...new Set(imageAnalysis.imagePaths)];
    console.log(`\n📋 Unique image paths found:`);
    uniquePaths.forEach(path => {
      console.log(`   - ${path}`);
    });

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

// Run the analysis
analyzeNewsImages();
