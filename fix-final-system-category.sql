-- Fix Final System Category Column
-- Run this in your Supabase SQL editor

-- Add the missing system_category column to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS system_category TEXT;

-- Force refresh schema cache again
ALTER TABLE news ADD COLUMN IF NOT EXISTS final_cache_refresh TEXT;
ALTER TABLE news DROP COLUMN IF EXISTS final_cache_refresh;

-- Ensure RLS policy is still active
DROP POLICY IF EXISTS "Public read access" ON news;
CREATE POLICY "Public read access" ON news FOR SELECT USING (true); 