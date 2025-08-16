-- Fix product relationships with manufacturers and categories
-- Run this in the Supabase SQL Editor

-- Add manufacturer_id column to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'manufacturer_id'
    ) THEN
        ALTER TABLE products ADD COLUMN manufacturer_id UUID REFERENCES manufacturers(id);
        RAISE NOTICE 'Added manufacturer_id column to products table';
    ELSE
        RAISE NOTICE 'manufacturer_id column already exists';
    END IF;
END $$;

-- Add category_id column to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES product_categories(id);
        RAISE NOTICE 'Added category_id column to products table';
    ELSE
        RAISE NOTICE 'category_id column already exists';
    END IF;
END $$;

-- Check the current structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('products', 'manufacturers', 'product_categories')
ORDER BY table_name, ordinal_position;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 