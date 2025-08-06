-- Fix News Dates
-- This script copies the original Statamic publication dates to the news_date column
-- for proper display of news items

-- First, let's see what columns are available in the news table
-- and check if there's a column containing the original Statamic dates

-- Update news_date column with the original publication dates
-- We'll use the entry_date column as the source since it likely contains the original Statamic dates
UPDATE news 
SET news_date = entry_date 
WHERE entry_date IS NOT NULL 
  AND news_date IS NULL;

-- For any remaining records without news_date, use created_at as fallback
UPDATE news 
SET news_date = created_at 
WHERE news_date IS NULL 
  AND created_at IS NOT NULL;

-- Create an index on news_date for better performance
CREATE INDEX IF NOT EXISTS idx_news_news_date ON news(news_date);

-- Verify the changes
SELECT 
  id,
  title,
  created_at,
  entry_date,
  news_date,
  CASE 
    WHEN news_date IS NOT NULL THEN 'Fixed'
    ELSE 'Still needs fixing'
  END as status
FROM news 
ORDER BY news_date DESC NULLS LAST;
