-- Add missing columns to all tables
-- Run this in your Supabase SQL editor

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_hero_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_gallery TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_specifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_price TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pairs_well_with TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS also_consider TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Add missing columns to manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS manufacturer_name TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS manufacturer_logo TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS manufacturer_description TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS manufacturer_website TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS manufacturer_country TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_date DATE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_author TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS news_category TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE news ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Add missing columns to pre_owned table
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_name TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_image TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_price TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_condition TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS item_category TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add missing columns to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS testimonial TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS customer_location TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS customer_photo TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Add missing columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_content TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_image TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_meta_description TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_meta_keywords TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS page_template TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blurb TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add missing columns to evergreen_carousel table
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_image TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_caption TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_link TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_order INTEGER;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS carousel_title TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

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