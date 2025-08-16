-- Comprehensive Schema for All Statamic Fields
-- Run this in your Supabase SQL editor

-- Add all fields for products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS also_consider TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_for_demo BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_to_buy_online BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_in_product_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_files BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS local_only BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS monthly_feature BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS monthly_featuree BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pairs_well_with TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_categories TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_hero_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quote_attribution TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reivews_set TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_price BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS system_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add all fields for manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS product_categories TEXT[];
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS website TEXT;

-- Add all fields for news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS main_content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS more_content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE news ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add all fields for pre_owned table
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS hide_your_price BOOLEAN DEFAULT false;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS local_only BOOLEAN DEFAULT false;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS new_retail_price NUMERIC;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS original_accessories TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS shipping TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS your_price NUMERIC;

-- Add all fields for testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS testimonial TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add all fields for pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blurb TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS template TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add all fields for evergreen_carousel table
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Update RLS policies
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
