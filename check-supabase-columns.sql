-- Check what columns exist in each table
-- Run this in your Supabase SQL editor

SELECT 'Products columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

SELECT 'Manufacturers columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'manufacturers' 
ORDER BY ordinal_position;

SELECT 'News columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;

SELECT 'Pre-owned columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'pre_owned' 
ORDER BY ordinal_position;

SELECT 'Testimonials columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'testimonials' 
ORDER BY ordinal_position;

SELECT 'Pages columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'pages' 
ORDER BY ordinal_position;

SELECT 'Evergreen carousel columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'evergreen_carousel' 
ORDER BY ordinal_position; 