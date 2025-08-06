// fix-remaining-news-dates.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Manual mapping for the remaining items
const remainingItems = [
  {
    filename: '2021-01-04.re-tales-4-bring-service-back.md',
    date: '2021-01-04',
    title: 'Re-Tales #4: Bring service back'
  },
  {
    filename: '2021-02-19.welcome-yg-acoustics.md',
    date: '2021-02-19',
    title: 'Fidelis is proud to announce that we have been appointed the sole New England dealership for premium speaker brand YG Acoustics.'
  }
];

async function fixRemainingNewsDates() {
  console.log('🔧 Fixing remaining news dates...\n');

  try {
    // Get all news from Supabase
    const { data: supabaseNews, error: supabaseError } = await supabase
      .from('news')
      .select('*')
      .eq('published', true);

    if (supabaseError) {
      console.error('❌ Error fetching Supabase news:', supabaseError);
      return;
    }

    let updatedCount = 0;

    for (const item of remainingItems) {
      console.log(`\n📄 Processing: ${item.filename}`);
      console.log(`   Date: ${item.date}`);
      console.log(`   Title: ${item.title}`);

      // Find the matching news item
      const matchedNews = supabaseNews.find(news => 
        news.title === item.title
      );

      if (matchedNews) {
        // Check if news_date is already set
        if (matchedNews.news_date) {
          console.log(`   ℹ️  News date already set: ${matchedNews.news_date}`);
          continue;
        }

        // Update the news_date
        const { error: updateError } = await supabase
          .from('news')
          .update({ news_date: item.date })
          .eq('id', matchedNews.id);

        if (updateError) {
          console.error(`   ❌ Error updating ${matchedNews.title}:`, updateError);
        } else {
          console.log(`   ✅ Updated: ${matchedNews.title} -> ${item.date}`);
          updatedCount++;
        }
      } else {
        console.log(`   ❌ No match found for: ${item.title}`);
      }
    }

    console.log(`\n📊 Fix Summary:`);
    console.log(`   ✅ Successfully updated: ${updatedCount}`);

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
      } else {
        console.log(`\n🎉 All news items now have dates!`);
      }
    }

  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
}

// Run the fix
fixRemainingNewsDates();
