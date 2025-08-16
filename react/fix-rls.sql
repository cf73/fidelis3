-- Fix RLS policies for data import
-- Run this in your Supabase SQL editor

-- Option 1: Temporarily disable RLS for import
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE manufacturers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE news DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pre_owned DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE evergreen_carousel DISABLE ROW LEVEL SECURITY;

-- Option 2: Create insert policies for anon role (recommended)
CREATE POLICY "Enable insert for anon" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON manufacturers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON pre_owned FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anon" ON evergreen_carousel FOR INSERT WITH CHECK (true);

-- After import, you can remove the insert policies if you want
-- DROP POLICY "Enable insert for anon" ON products;
-- DROP POLICY "Enable insert for anon" ON manufacturers;
-- DROP POLICY "Enable insert for anon" ON news;
-- DROP POLICY "Enable insert for anon" ON pre_owned;
-- DROP POLICY "Enable insert for anon" ON testimonials;
-- DROP POLICY "Enable insert for anon" ON pages;
-- DROP POLICY "Enable insert for anon" ON evergreen_carousel; 