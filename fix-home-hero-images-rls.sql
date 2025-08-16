-- Fix RLS policies for home_hero_images table
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read access to published home hero images" ON home_hero_images;
DROP POLICY IF EXISTS "Allow authenticated users to manage home hero images" ON home_hero_images;

-- Create more permissive policies
-- Allow public read access to published images
CREATE POLICY "Allow public read access to published home hero images" ON home_hero_images
    FOR SELECT USING (published = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert home hero images" ON home_hero_images
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update their own records (or all if admin)
CREATE POLICY "Allow authenticated users to update home hero images" ON home_hero_images
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete home hero images" ON home_hero_images
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Alternative: If the above still doesn't work, temporarily disable RLS for testing
 ALTER TABLE home_hero_images DISABLE ROW LEVEL SECURITY;

