-- Fix product-categories column (with hyphen)
-- Run this in your Supabase SQL editor

-- Drop and recreate the product-categories column with the correct name
ALTER TABLE manufacturers DROP COLUMN IF EXISTS product_categories;
ALTER TABLE manufacturers DROP COLUMN IF EXISTS "product-categories";
ALTER TABLE manufacturers ADD COLUMN "product-categories" TEXT[];

-- Update RLS policies
DROP POLICY IF EXISTS "Public read access" ON manufacturers;
CREATE POLICY "Public read access" ON manufacturers FOR SELECT USING (true); 