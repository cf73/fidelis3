-- Add hero_product_id column to product_categories table
-- This allows admin users to manually select which product's image to use for each category

ALTER TABLE product_categories 
ADD COLUMN hero_product_id TEXT;

-- Add a comment to document the purpose
COMMENT ON COLUMN product_categories.hero_product_id IS 'ID of the product whose hero image should be used for this category. When null, falls back to automatic selection.';

