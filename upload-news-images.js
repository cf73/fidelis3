// upload-news-images.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

async function uploadNewsImages() {
  console.log('📤 Uploading news images to Supabase...\n');

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

    let uploadedCount = 0;
    let notFoundCount = 0;
    const notFoundItems = [];

    for (const item of news) {
      console.log(`\n📄 Processing: ${item.title}`);
      console.log(`   Image: ${item.image || 'NO IMAGE'}`);
      
      if (!item.image) {
        console.log(`   ⚠️  No image to upload`);
        continue;
      }

      // Find the image in backup directory
      const backupPath = findImageInBackup(item.image);
      
      if (!backupPath) {
        console.log(`   ❌ Image not found in backup: ${item.image}`);
        notFoundItems.push({
          title: item.title,
          image: item.image,
          reason: 'Not found in backup'
        });
        notFoundCount++;
        continue;
      }

      console.log(`   ✅ Found in backup: ${backupPath}`);

      // Upload to Supabase
      const uploadedPath = await uploadImageToSupabase(backupPath, item.image);
      
      if (!uploadedPath) {
        console.log(`   ❌ Failed to upload to Supabase`);
        notFoundItems.push({
          title: item.title,
          image: item.image,
          reason: 'Upload failed'
        });
        notFoundCount++;
      } else {
        console.log(`   ✅ Uploaded to Supabase: ${uploadedPath}`);
        uploadedCount++;
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`   ✅ Successfully uploaded: ${uploadedCount}`);
    console.log(`   ❌ Not found/failed: ${notFoundCount}`);

    if (notFoundItems.length > 0) {
      console.log(`\n📋 Items that couldn't be uploaded:`);
      notFoundItems.forEach(item => {
        console.log(`   - ${item.title}: ${item.reason}`);
        console.log(`     Image: ${item.image}`);
      });
    }

    // Show final verification
    console.log(`\n🔍 Final verification:`);
    const { data: finalList, error: finalError } = await supabase.storage
      .from('images')
      .list('', {
        limit: 50
      });

    if (!finalError && finalList) {
      console.log(`   Files in Supabase storage: ${finalList.length}`);
      if (finalList.length > 0) {
        console.log(`   Sample files:`);
        finalList.slice(0, 10).forEach(file => {
          console.log(`     - ${file.name} (${file.size} bytes)`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error during upload:', error);
  }
}

// Run the upload
uploadNewsImages();
