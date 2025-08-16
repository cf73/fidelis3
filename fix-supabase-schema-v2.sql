-- Fix Supabase Schema to match Statamic content structure - VERSION 2
-- Run this in your Supabase SQL editor

-- First, let's check what columns actually exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Drop any existing constraints that might conflict
DO $$ 
BEGIN
    -- Drop unique constraints if they exist
    BEGIN
        ALTER TABLE products DROP CONSTRAINT IF EXISTS products_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE manufacturers DROP CONSTRAINT IF EXISTS manufacturers_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE news DROP CONSTRAINT IF EXISTS news_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE pre_owned DROP CONSTRAINT IF EXISTS pre_owned_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE evergreen_carousel DROP CONSTRAINT IF EXISTS evergreen_carousel_filename_unique;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
END $$;

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE products ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'products';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'products';
ALTER TABLE products ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to manufacturers table
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'manufacturers';
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'manufacturers';
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE news ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE news ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'news';
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE news ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'news';
ALTER TABLE news ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to pre_owned table
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'pre-owned';
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'pre-owned';
ALTER TABLE pre_owned ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'testimonials';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'testimonials';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE pages ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'pages';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'pages';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Add missing columns to evergreen_carousel table
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS blueprint TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT 'evergreen-carousel';
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT true;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS blueprint_handle TEXT DEFAULT 'evergreen-carousel';
ALTER TABLE evergreen_carousel ADD COLUMN IF NOT EXISTS blueprint_namespace TEXT DEFAULT 'collections';

-- Now add unique constraints for filename column
DO $$ 
BEGIN
    -- Products
    BEGIN
        ALTER TABLE products ADD CONSTRAINT products_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Manufacturers
    BEGIN
        ALTER TABLE manufacturers ADD CONSTRAINT manufacturers_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- News
    BEGIN
        ALTER TABLE news ADD CONSTRAINT news_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Pre-owned
    BEGIN
        ALTER TABLE pre_owned ADD CONSTRAINT pre_owned_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Testimonials
    BEGIN
        ALTER TABLE testimonials ADD CONSTRAINT testimonials_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Pages
    BEGIN
        ALTER TABLE pages ADD CONSTRAINT pages_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Evergreen carousel
    BEGIN
        ALTER TABLE evergreen_carousel ADD CONSTRAINT evergreen_carousel_filename_unique UNIQUE (filename);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_filename ON products(filename);
CREATE INDEX IF NOT EXISTS idx_manufacturers_filename ON manufacturers(filename);
CREATE INDEX IF NOT EXISTS idx_news_filename ON news(filename);
CREATE INDEX IF NOT EXISTS idx_pre_owned_filename ON pre_owned(filename);
CREATE INDEX IF NOT EXISTS idx_testimonials_filename ON testimonials(filename);
CREATE INDEX IF NOT EXISTS idx_pages_filename ON pages(filename);
CREATE INDEX IF NOT EXISTS idx_evergreen_carousel_filename ON evergreen_carousel(filename);

-- Verify the changes
SELECT 'Products columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position; 