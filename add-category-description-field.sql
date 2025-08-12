-- Add category_description field to product_categories table
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS category_description TEXT;

-- Update the getProductCategories function to include the new field
-- This will be handled by the existing select * in the function
