-- Add missing product-categories column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product-categories" TEXT[];

-- Also add any other missing columns that might be needed
ALTER TABLE products ADD COLUMN IF NOT EXISTS "pairs_well_with" TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS "also_consider" TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product_hero_image" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product_gallery" TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product_price" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product_specifications" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "product_name" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "available_for_demo" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "available_to_buy_online" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "local_only" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "has_files" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "featured" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "in_stock" BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "video_url" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "main_content" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "text" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "featured_description" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "featured_in_product_category" TEXT; 