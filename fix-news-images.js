// fix-news-images.js
import fs from 'fs';
import path from 'path';
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
    return path.basename(url);
  }
  
  // Already a filename
  return url;
}

// Function to find image in backup directory
function findImageInBackup(filename) {
  if (!filename) return null;
  
  const backupDir = 'public_backup/assets/main';
  const possiblePaths = [
    path.join(backupDir, filename),
    path.join(backupDir, filename.toLowerCase()),
    path.join(backupDir, filename.toUpperCase())
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  // Try to find similar filenames
  try {
    const files = fs.readdirSync(backupDir);
    const similarFile = files.find(file => 
      file.toLowerCase().includes(filename.toLowerCase().replace(/\.[^.]*$/, '')) ||
      filename.toLowerCase().includes(file.toLowerCase().replace(/\.[^.]*$/, ''))
    );
    
    if (similarFile) {
      return path.join(backupDir, similarFile);
    }
  } catch (error) {
    console.log(`Error searching backup directory: ${error.message}`);
  }
  
  return null;
}

// Function to upload image to Supabase
async function uploadImageToSupabase(filePath, filename) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, fileBuffer, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${filename}:`, error);
      return null;
    }
    
    return data.path;
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function fixNewsImages() {
  console.log('🔧 Fixing news images...\n');

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
    let notFoundCount = 0;
    const notFoundItems = [];

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
        notFoundItems.push({
          title: item.title,
          image: item.image,
          reason: 'Could not extract filename'
        });
        notFoundCount++;
        continue;
      }

      // Find the image in backup directory
      const backupPath = findImageInBackup(filename);
      
      if (!backupPath) {
        console.log(`   ❌ Image not found in backup: ${filename}`);
        notFoundItems.push({
          title: item.title,
          image: item.image,
          filename: filename,
          reason: 'Not found in backup'
        });
        notFoundCount++;
        continue;
      }

      console.log(`   ✅ Found in backup: ${backupPath}`);

      // Upload to Supabase
      const uploadedPath = await uploadImageToSupabase(backupPath, filename);
      
      if (!uploadedPath) {
        console.log(`   ❌ Failed to upload to Supabase`);
        notFoundItems.push({
          title: item.title,
          image: item.image,
          filename: filename,
          reason: 'Upload failed'
        });
        notFoundCount++;
        continue;
      }

      console.log(`   ✅ Uploaded to Supabase: ${uploadedPath}`);

      // Update the news record with the correct image path
      const { error: updateError } = await supabase
        .from('news')
        .update({ image: filename })
        .eq('id', item.id);

      if (updateError) {
        console.error(`   ❌ Error updating record:`, updateError);
        notFoundItems.push({
          title: item.title,
          image: item.image,
          filename: filename,
          reason: 'Database update failed'
        });
        notFoundCount++;
      } else {
        console.log(`   ✅ Updated database record`);
        fixedCount++;
      }
    }

    console.log(`\n📊 Fix Summary:`);
    console.log(`   ✅ Successfully fixed: ${fixedCount}`);
    console.log(`   ❌ Not found/failed: ${notFoundCount}`);

    if (notFoundItems.length > 0) {
      console.log(`\n📋 Items that couldn't be fixed:`);
      notFoundItems.forEach(item => {
        console.log(`   - ${item.title}: ${item.reason}`);
        if (item.filename) {
          console.log(`     Filename: ${item.filename}`);
        }
      });
    }

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
    }

  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
}

// Run the fix
fixNewsImages();
