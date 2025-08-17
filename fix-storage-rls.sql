-- Fix Supabase Storage RLS Policies
-- Run this in your Supabase SQL editor

-- First, let's check if the assets bucket exists
-- If not, you'll need to create it manually in the Supabase dashboard

-- Drop existing policies for the assets bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Create policies for the assets bucket
-- Allow public read access to all files in the assets bucket
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'assets');

-- Allow authenticated users to upload to the assets bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update files in the assets bucket
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files in the assets bucket
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Also create a more permissive policy for development (allows anonymous uploads)
-- WARNING: This is less secure, only use for development
CREATE POLICY "Development upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Development update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'assets');

CREATE POLICY "Development delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'assets');

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verify the policies were created
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