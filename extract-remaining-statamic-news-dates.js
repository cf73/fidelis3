// extract-remaining-statamic-news-dates.js
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
  // Remove .md extension and date prefix
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const titleMatch = nameWithoutExt.match(/^\d{4}-\d{2}-\d{2}\.(.+)$/);
  if (titleMatch) {
    return titleMatch[1];
  }
  
  return null;
}

// Function to normalize text for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  if (normalized1 === normalized2) return 1;
  
  // Simple similarity calculation
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

async function migrateRemainingNewsDates() {
  console.log('🔍 Starting enhanced news date migration...\n');

  try {
    // Get all news files from Statamic
    const newsFiles = await fg('content/collections/news/*.md');
    console.log(`📁 Found ${newsFiles.length} Statamic news files\n`);

    // Get all news from Supabase
    const { data: supabaseNews, error: supabaseError } = await supabase
      .from('news')
      .select('*')
      .eq('published', true);

    if (supabaseError) {
      console.error('❌ Error fetching Supabase news:', supabaseError);
      return;
    }

    console.log(`📊 Found ${supabaseNews.length} news items in Supabase\n`);

    let updatedCount = 0;
    let notFoundCount = 0;
    const notFoundItems = [];

    for (const filePath of newsFiles) {
      const filename = path.basename(filePath);
      const date = extractDateFromFilename(filename);
      const titleFromFile = extractTitleFromFilename(filename);

      if (!date || !titleFromFile) {
        console.log(`⚠️  Skipping ${filename} - invalid format`);
        continue;
      }

      console.log(`\n📄 Processing: ${filename}`);
      console.log(`   Date: ${date}`);
      console.log(`   Title from file: ${titleFromFile}`);

      // Try multiple matching strategies
      let matchedNews = null;
      let bestMatch = null;
      let bestSimilarity = 0;

      // Strategy 1: Exact title match
      matchedNews = supabaseNews.find(news => 
        normalizeText(news.title) === normalizeText(titleFromFile)
      );

      if (matchedNews) {
        console.log(`   ✅ Exact title match found`);
      } else {
        // Strategy 2: Partial title match
        matchedNews = supabaseNews.find(news => 
          normalizeText(news.title).includes(normalizeText(titleFromFile)) ||
          normalizeText(titleFromFile).includes(normalizeText(news.title))
        );

        if (matchedNews) {
          console.log(`   ✅ Partial title match found`);
        } else {
          // Strategy 3: Similarity-based matching
          for (const news of supabaseNews) {
            const similarity = calculateSimilarity(titleFromFile, news.title);
            if (similarity > bestSimilarity && similarity > 0.3) { // Threshold of 30%
              bestSimilarity = similarity;
              bestMatch = news;
            }
          }

          if (bestMatch) {
            console.log(`   ✅ Similarity match found (${Math.round(bestSimilarity * 100)}% similarity)`);
            matchedNews = bestMatch;
          }
        }
      }

      if (matchedNews) {
        // Check if news_date is already set
        if (matchedNews.news_date) {
          console.log(`   ℹ️  News date already set: ${matchedNews.news_date}`);
          continue;
        }

        // Update the news_date
        const { error: updateError } = await supabase
          .from('news')
          .update({ news_date: date })
          .eq('id', matchedNews.id);

        if (updateError) {
          console.error(`   ❌ Error updating ${matchedNews.title}:`, updateError);
        } else {
          console.log(`   ✅ Updated: ${matchedNews.title} -> ${date}`);
          updatedCount++;
        }
      } else {
        console.log(`   ❌ No match found for: ${titleFromFile}`);
        notFoundItems.push({
          filename,
          titleFromFile,
          date
        });
        notFoundCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully updated: ${updatedCount}`);
    console.log(`   ❌ Not found: ${notFoundCount}`);

    if (notFoundItems.length > 0) {
      console.log(`\n📋 Items that couldn't be matched:`);
      notFoundItems.forEach(item => {
        console.log(`   - ${item.filename} (${item.titleFromFile})`);
      });
    }

    // Show final verification
    console.log(`\n🔍 Final verification:`);
    const { data: finalNews, error: finalError } = await supabase
      .from('news')
      .select('id, title, news_date')
      .eq('published', true)
      .order('news_date', { ascending: false });

    if (!finalError && finalNews) {
      const withDates = finalNews.filter(news => news.news_date);
      const withoutDates = finalNews.filter(news => !news.news_date);
      
      console.log(`   News items with dates: ${withDates.length}`);
      console.log(`   News items without dates: ${withoutDates.length}`);
      
      if (withoutDates.length > 0) {
        console.log(`\n📋 Items still without dates:`);
        withoutDates.forEach(news => {
          console.log(`   - ${news.title}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

// Run the migration
migrateRemainingNewsDates();
