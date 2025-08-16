// extract-statamic-news-dates-with-content.js
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
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const dateMatch = nameWithoutExt.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return dateMatch[1];
  }
  return null;
}

// Function to extract title from Statamic file content
function extractTitleFromContent(content) {
  // Look for title in frontmatter
  const titleMatch = content.match(/^---\s*\n(?:[\s\S]*?\n)?title:\s*["']?([^"\n]+)["']?\s*\n/);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  // Look for title without quotes
  const titleMatch2 = content.match(/^---\s*\n(?:[\s\S]*?\n)?title:\s*([^\n]+)\s*\n/);
  if (titleMatch2) {
    return titleMatch2[1].trim();
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
  
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

async function migrateNewsDatesWithContent() {
  console.log('🔍 Starting enhanced news date migration with content reading...\n');

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

      if (!date) {
        console.log(`⚠️  Skipping ${filename} - no date found`);
        continue;
      }

      // Read the file content
      let fileContent;
      try {
        fileContent = fs.readFileSync(filePath, 'utf8');
      } catch (error) {
        console.log(`❌ Error reading ${filename}:`, error.message);
        continue;
      }

      const titleFromContent = extractTitleFromContent(fileContent);

      if (!titleFromContent) {
        console.log(`⚠️  Skipping ${filename} - no title found in content`);
        continue;
      }

      console.log(`\n📄 Processing: ${filename}`);
      console.log(`   Date: ${date}`);
      console.log(`   Title from content: ${titleFromContent}`);

      // Try multiple matching strategies
      let matchedNews = null;
      let bestMatch = null;
      let bestSimilarity = 0;

      // Strategy 1: Exact title match
      matchedNews = supabaseNews.find(news => 
        normalizeText(news.title) === normalizeText(titleFromContent)
      );

      if (matchedNews) {
        console.log(`   ✅ Exact title match found`);
      } else {
        // Strategy 2: Partial title match
        matchedNews = supabaseNews.find(news => 
          normalizeText(news.title).includes(normalizeText(titleFromContent)) ||
          normalizeText(titleFromContent).includes(normalizeText(news.title))
        );

        if (matchedNews) {
          console.log(`   ✅ Partial title match found`);
        } else {
          // Strategy 3: Similarity-based matching
          for (const news of supabaseNews) {
            const similarity = calculateSimilarity(titleFromContent, news.title);
            if (similarity > bestSimilarity && similarity > 0.3) {
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
        console.log(`   ❌ No match found for: ${titleFromContent}`);
        notFoundItems.push({
          filename,
          titleFromContent,
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
        console.log(`   - ${item.filename} (${item.titleFromContent})`);
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
migrateNewsDatesWithContent();
