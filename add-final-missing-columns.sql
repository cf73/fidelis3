-- Add ALL remaining missing columns to all tables
-- Run this in your Supabase SQL editor

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_categories TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS product_categories TEXT[];
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to pre_owned table
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS local_only BOOLEAN DEFAULT false;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS hide_your_price BOOLEAN DEFAULT false;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS text TEXT;

-- Add missing columns to evergreen_carousel table
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS text TEXT;

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
DROP POLICY IF EXISTS "Public read access" ON news;
DROP POLICY IF EXISTS "Public read access" ON pre_owned;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON pages;
DROP POLICY IF EXISTS "Public read access" ON evergreen_carousel;

CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pre_owned FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON evergreen_carousel FOR SELECT USING (true);

-- Verify the changes
SELECT 'Products columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position; 