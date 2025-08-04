-- Fix Final Migration Issues
-- Run this in your Supabase SQL editor

-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS brief_description TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "product-categories" TEXT[];

-- Add missing columns to manufacturers table (in case any are missing)
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS website TEXT;

-- Fix RLS policies for manufacturers table
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true);

-- Fix RLS policies for news table  
DROP POLICY IF EXISTS "Public read access" ON news;
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);

-- Ensure all tables have proper RLS policies
DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON pre_owned;
CREATE POLICY "Public read access" ON pre_owned FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON testimonials;
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON evergreen_carousel;
CREATE POLICY "Public read access" ON evergreen_carousel FOR SELECT USING (true);

-- Add any missing unique constraints
DO $$ BEGIN
    ALTER TABLE manufacturers ADD CONSTRAINT manufacturers_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE news ADD CONSTRAINT news_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE products ADD CONSTRAINT products_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pre_owned ADD CONSTRAINT pre_owned_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE testimonials ADD CONSTRAINT testimonials_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE evergreen_carousel ADD CONSTRAINT evergreen_carousel_filename_unique UNIQUE (filename);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$; 