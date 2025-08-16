-- Add missing product-categories column
-- Run this in your Supabase SQL editor

-- Add product-categories column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_categories TEXT[];

-- Add product-categories column to manufacturers table  
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS product_categories TEXT[];

-- Update RLS policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read access" ON manufacturers;

CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true); 