-- Disable RLS for Supabase Storage to allow image uploads
-- Run this in the Supabase SQL Editor

-- First, let's check if RLS is enabled on the storage.objects table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Disable RLS on the storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on storage.buckets if needed
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('objects', 'buckets') AND schemaname = 'storage'; 