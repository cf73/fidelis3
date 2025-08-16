-- Simple Supabase Storage RLS Fix
-- Run this in your Supabase SQL editor

-- First, make sure the assets bucket exists
-- If it doesn't exist, you'll need to create it manually in the Supabase dashboard
-- Go to Storage > Create a new bucket > Name it "assets" > Make it public

-- Try to create a simple policy that allows all operations on the assets bucket
-- This is less secure but should work for development

-- Drop any existing policies we might have created
DROP POLICY IF EXISTS "Allow all assets access" ON storage.objects;

-- Create a simple policy that allows all operations on the assets bucket
CREATE POLICY "Allow all assets access" ON storage.objects
FOR ALL USING (bucket_id = 'assets')
WITH CHECK (bucket_id = 'assets');

-- If the above doesn't work, try this even simpler approach:
-- DROP POLICY IF EXISTS "Public assets access" ON storage.objects;
-- CREATE POLICY "Public assets access" ON storage.objects
-- FOR ALL USING (true);

-- Check if the assets bucket exists
SELECT * FROM storage.buckets WHERE id = 'assets';

-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'; 