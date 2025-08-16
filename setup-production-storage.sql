-- Production-Grade Supabase Storage Setup
-- Run this in your Supabase SQL editor

-- Step 1: Create the assets bucket (if it doesn't exist)
-- This should be done manually in the Supabase dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "Create a new bucket"
-- 3. Name it "assets"
-- 4. Make it public (uncheck "Private bucket")
-- 5. Click "Create bucket"

-- Step 2: Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public write access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Allow all assets access" ON storage.objects;
DROP POLICY IF EXISTS "Development upload access" ON storage.objects;
DROP POLICY IF EXISTS "Development update access" ON storage.objects;
DROP POLICY IF EXISTS "Development delete access" ON storage.objects;

-- Step 3: Create production-ready policies
-- Allow public read access to all files in the assets bucket
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'assets');

-- Allow authenticated users to upload to the assets bucket
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files in the assets bucket
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in the assets bucket
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
);

-- Step 4: Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the setup
-- Check if the bucket exists
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'assets';

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
ORDER BY policyname; 