// extract-statamic-news-dates.js
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to extract date from filename
function extractDateFromFilename(filename) {
  // Remove .md extension
  const nameWithoutExt = filename.replace(/\.md$/, '');
  
  // Check if filename starts with YYYY-MM-DD pattern
  const dateMatch = nameWithoutExt.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return dateMatch[1]; // Returns YYYY-MM-DD format
  }
  
  return null;
}

// Function to extract title from filename
function extractTitleFromFilename(filename) {
  // Remove .md extension
  const nameWithoutExt = filename.replace(/\.md$/, '');
  
  // Remove date prefix if present
  const titlePart = nameWithoutExt.replace(/^\d{4}-\d{2}-\d{2}\./, '');
  
  // Convert to readable title
  return titlePart.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function updateNewsDates() {
  console.log('🔍 Extracting dates from Statamic news files...');
  
  // Get all news files
  const files = await fg(['content/collections/news/*.md']);
  console.log(`📁 Found ${files.length} news files`);
  
  const updates = [];
  
  for (const file of files) {
    const filename = path.basename(file);
    const date = extractDateFromFilename(filename);
    const title = extractTitleFromFilename(filename);
    
    if (date) {
      console.log(`📅 ${filename}: ${date} -> "${title}"`);
      updates.push({
        filename,
        date,
        title
      });
    } else {
      console.log(`⚠️  No date found in filename: ${filename}`);
    }
  }
  
  console.log(`\n📊 Found ${updates.length} files with dates`);
  
  // Update Supabase database
  console.log('\n🔄 Updating Supabase database...');
  
  for (const update of updates) {
    // Find the news entry by title (since that's what was migrated)
    const { data: existingNews, error: findError } = await supabase
      .from('news')
      .select('id, title')
      .ilike('title', `%${update.title}%`)
      .limit(1);
    
    if (findError) {
      console.error(`❌ Error finding news entry for ${update.filename}:`, findError);
      continue;
    }
    
    if (existingNews && existingNews.length > 0) {
      const newsEntry = existingNews[0];
      console.log(`📝 Found: "${newsEntry.title}" -> ${update.date}`);
      
      // Update the news_date field
      const { error: updateError } = await supabase
        .from('news')
        .update({ news_date: update.date })
        .eq('id', newsEntry.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${update.filename}:`, updateError);
      } else {
        console.log(`✅ Updated: ${update.filename} -> ${update.date}`);
      }
    } else {
      console.log(`⚠️  No matching news entry found for: ${update.title}`);
    }
  }
  
  console.log('\n✅ Date extraction complete!');
  
  // Verify the results
  console.log('\n📊 Verifying results...');
  const { data: newsWithDates, error: verifyError } = await supabase
    .from('news')
    .select('id, title, news_date, created_at')
    .order('news_date', { ascending: false });
  
  if (verifyError) {
    console.error('❌ Error verifying results:', verifyError);
  } else {
    console.log('\n📋 News entries with dates:');
    newsWithDates.forEach(news => {
      console.log(`  ${news.news_date || 'NO DATE'} | ${news.title}`);
    });
  }
}

// Run the script
(async () => {
  try {
    await updateNewsDates();
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
})();
