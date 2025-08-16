-- Fix product relationships with manufacturers and categories

-- First, let's check the current structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('products', 'manufacturers', 'product_categories')
ORDER BY table_name, ordinal_position;

-- Check if manufacturer_id column exists in products table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'manufacturer_id';

-- Check if category_id column exists in products table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'category_id';

-- Add manufacturer_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'manufacturer_id'
    ) THEN
        ALTER TABLE products ADD COLUMN manufacturer_id UUID REFERENCES manufacturers(id);
    END IF;
END $$;

-- Add category_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES product_categories(id);
    END IF;
END $$;

-- Update the products table to include the relationship columns
-- This will help with the foreign key relationships

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 