-- Check for duplicate filenames in all tables
-- Run this in your Supabase SQL editor

-- Check products table
SELECT filename, COUNT(*) as count
FROM products 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check manufacturers table
SELECT filename, COUNT(*) as count
FROM manufacturers 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check news table
SELECT filename, COUNT(*) as count
FROM news 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check pre_owned table
SELECT filename, COUNT(*) as count
FROM pre_owned 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check testimonials table
SELECT filename, COUNT(*) as count
FROM testimonials 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check pages table
SELECT filename, COUNT(*) as count
FROM pages 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check evergreen_carousel table
SELECT filename, COUNT(*) as count
FROM evergreen_carousel 
WHERE filename IS NOT NULL
GROUP BY filename 
HAVING COUNT(*) > 1
ORDER BY count DESC; 