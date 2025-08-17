-- Fix RLS policies to allow public read access
-- Run this in the Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON manufacturers;
DROP POLICY IF EXISTS "Enable read access for all users" ON product_categories;

-- Create new policies that allow public read access
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON manufacturers
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON product_categories
    FOR SELECT USING (true);

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY; 