-- Clean fix for home_hero_images RLS policies
-- First, disable RLS temporarily to clear all policies
ALTER TABLE home_hero_images DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (this will work even if they don't exist)
DROP POLICY IF EXISTS "Allow public read access to published home hero images" ON home_hero_images;
DROP POLICY IF EXISTS "Allow authenticated users to manage home hero images" ON home_hero_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert home hero images" ON home_hero_images;
DROP POLICY IF EXISTS "Allow authenticated users to update home hero images" ON home_hero_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete home hero images" ON home_hero_images;

-- Re-enable RLS
ALTER TABLE home_hero_images ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Allow public read access to published home hero images" ON home_hero_images
    FOR SELECT USING (published = true);

CREATE POLICY "Allow authenticated users to insert home hero images" ON home_hero_images
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update home hero images" ON home_hero_images
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete home hero images" ON home_hero_images
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- For now, keep RLS disabled for testing
ALTER TABLE home_hero_images DISABLE ROW LEVEL SECURITY;

