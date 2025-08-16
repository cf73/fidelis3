-- Fix remaining migration issues
-- Run this in your Supabase SQL editor

-- Add missing product-categories column to manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS product_categories TEXT[];

-- Update RLS policies for manufacturers
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);

-- Add any other missing columns that might be causing issues
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_summary TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_excerpt TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_date TEXT;

-- Update RLS policies for news
DROP POLICY IF EXISTS "Public read access" ON news;
CREATE POLICY "Public read access" ON news FOR SELECT USING (true); 