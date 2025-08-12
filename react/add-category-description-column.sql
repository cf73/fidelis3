-- Add category_description column to product_categories table
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS category_description TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_categories' 
AND column_name = 'category_description';
