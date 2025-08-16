-- Final comprehensive schema fix
-- Run this in your Supabase SQL editor

-- Drop and recreate the product-categories column to ensure it exists
ALTER TABLE manufacturers DROP COLUMN IF EXISTS product_categories;
ALTER TABLE manufacturers ADD COLUMN product_categories TEXT[];

-- Add all missing manufacturer columns
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS logo TEXT;

-- Add all missing news columns
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_summary TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_excerpt TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_date TEXT;

-- Add all missing pre-owned columns
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_name TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_image TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_price TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS local_only BOOLEAN DEFAULT false;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS hide_your_price BOOLEAN DEFAULT false;

-- Add all missing testimonials columns
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS testimonial TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating NUMERIC;

-- Add all missing evergreen_carousel columns
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_title TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_image TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_description TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS caption TEXT;

-- Update RLS policies for all tables
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
DROP POLICY IF EXISTS "Public read access" ON news;
DROP POLICY IF EXISTS "Public read access" ON pre_owned;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON evergreen_carousel;

CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pre_owned FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON evergreen_carousel FOR SELECT USING (true); 