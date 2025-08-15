-- Fix RLS policies for product_categories table to allow updates
-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'product_categories';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON product_categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON product_categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON product_categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON product_categories;

-- Create new policies that allow updates
CREATE POLICY "Enable read access for all users" ON product_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON product_categories
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users only" ON product_categories
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users only" ON product_categories
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Alternative: If you want to allow updates without authentication, use this instead:
-- CREATE POLICY "Enable update for all users" ON product_categories
--     FOR UPDATE USING (true);

