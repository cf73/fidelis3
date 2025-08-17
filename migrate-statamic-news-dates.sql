-- Migrate Statamic News Dates
-- This script extracts publication dates from Statamic filename patterns (YYYY-MM-DD.title.md)
-- and updates the news_date column in Supabase

-- First, let's see what we're working with
SELECT 
  id,
  title,
  slug,
  created_at,
  entry_date,
  news_date
FROM news 
ORDER BY created_at DESC;

-- Update news_date based on the slug pattern
-- The slug should contain the date in YYYY-MM-DD format at the beginning
UPDATE news 
SET news_date = 
  CASE 
    -- Extract date from slug if it starts with YYYY-MM-DD pattern
    WHEN slug ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN 
      (regexp_match(slug, '^[0-9]{4}-[0-9]{2}-[0-9]{2}'))[1]::date
    -- Extract date from title if it starts with YYYY-MM-DD pattern  
    WHEN title ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN 
      (regexp_match(title, '^[0-9]{4}-[0-9]{2}-[0-9]{2}'))[1]::date
    -- Fallback to created_at if no date pattern found
    ELSE created_at::date
  END
WHERE news_date IS NULL;

-- Create an index on news_date for better performance
CREATE INDEX IF NOT EXISTS idx_news_news_date ON news(news_date);

-- Verify the changes
SELECT 
  id,
  title,
  slug,
  created_at,
  news_date,
  CASE 
    WHEN news_date IS NOT NULL THEN 'Fixed'
    ELSE 'Still needs fixing'
  END as status
FROM news 
ORDER BY news_date DESC NULLS LAST;
