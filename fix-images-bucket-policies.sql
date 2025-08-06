-- Fix Images Bucket RLS Policies
-- Run this in your Supabase SQL editor

-- Step 1: Drop any existing policies for images bucket
DROP POLICY IF EXISTS "Public read access images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access images" ON storage.objects;

-- Step 2: Create production-ready policies for images bucket
-- Allow public read access to all files in the images bucket
CREATE POLICY "Public read access images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload to the images bucket
CREATE POLICY "Authenticated upload access images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files in the images bucket
CREATE POLICY "Authenticated update access images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in the images bucket
CREATE POLICY "Authenticated delete access images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Step 3: Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify the setup
-- Check if the images bucket exists
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'images';

-- Check if policies were created successfully
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%images%'
ORDER BY policyname;
