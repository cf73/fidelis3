-- Clear all data from all tables
-- Run this in your Supabase SQL editor

-- Clear all tables
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE manufacturers CASCADE;
TRUNCATE TABLE news CASCADE;
TRUNCATE TABLE pre_owned CASCADE;
TRUNCATE TABLE testimonials CASCADE;
TRUNCATE TABLE pages CASCADE;
TRUNCATE TABLE evergreen_carousel CASCADE;

-- Reset sequences if any
-- (This is usually not needed for UUID primary keys, but just in case) 