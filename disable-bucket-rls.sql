-- Disable RLS for bucket creation and management
-- Run this in the Supabase SQL Editor

-- First, let's check if RLS is enabled on the storage.buckets table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'buckets' AND schemaname = 'storage';

-- Disable RLS on the storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Also make sure objects table RLS is disabled
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('objects', 'buckets') AND schemaname = 'storage';

-- Create a simple policy that allows all operations on any bucket
DROP POLICY IF EXISTS "Allow all bucket operations" ON storage.buckets;
CREATE POLICY "Allow all bucket operations" ON storage.buckets
FOR ALL USING (true)
WITH CHECK (true);

-- Create a simple policy that allows all operations on any object
DROP POLICY IF EXISTS "Allow all object operations" ON storage.objects;
CREATE POLICY "Allow all object operations" ON storage.objects
FOR ALL USING (true)
WITH CHECK (true); 