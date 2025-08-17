-- Fix Final Schema Cache Issues
-- Run this in your Supabase SQL editor

-- Force refresh the schema cache by making a small change to each table
ALTER TABLE news ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS schema_cache_refresh TEXT;

-- Remove the temporary columns
ALTER TABLE news DROP COLUMN IF EXISTS schema_cache_refresh;
ALTER TABLE manufacturers DROP COLUMN IF EXISTS schema_cache_refresh;
ALTER TABLE products DROP COLUMN IF EXISTS schema_cache_refresh;
ALTER TABLE pre_owned DROP COLUMN IF EXISTS schema_cache_refresh;
ALTER TABLE testimonials DROP COLUMN IF EXISTS schema_cache_refresh;
ALTER TABLE evergreen_carousel DROP COLUMN IF EXISTS schema_cache_refresh;

-- Ensure all required columns exist in news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS brief_description TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "product-categories" TEXT[];
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_summary TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_author TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_tags TEXT[];
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_featured BOOLEAN DEFAULT false;

-- Ensure all required columns exist in manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS "product-categories" TEXT[];

-- Drop and recreate all RLS policies to ensure they're properly applied
-- Manufacturers
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
DROP POLICY IF EXISTS "Enable read access for all users" ON manufacturers;
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);

-- News
DROP POLICY IF EXISTS "Public read access" ON news;
DROP POLICY IF EXISTS "Enable read access for all users" ON news;
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);

-- Products
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- Pre-owned
DROP POLICY IF EXISTS "Public read access" ON pre_owned;
DROP POLICY IF EXISTS "Enable read access for all users" ON pre_owned;
CREATE POLICY "Public read access" ON pre_owned FOR SELECT USING (true);

-- Testimonials
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials;
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);

-- Evergreen Carousel
DROP POLICY IF EXISTS "Public read access" ON evergreen_carousel;
DROP POLICY IF EXISTS "Enable read access for all users" ON evergreen_carousel;
CREATE POLICY "Public read access" ON evergreen_carousel FOR SELECT USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_owned ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE evergreen_carousel ENABLE ROW LEVEL SECURITY; 