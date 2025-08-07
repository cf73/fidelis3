-- Fix pre_owned table schema
-- Add missing fields and update existing ones

-- Add slug field if it doesn't exist
ALTER TABLE pre_owned 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add brief_description field if it doesn't exist
ALTER TABLE pre_owned 
ADD COLUMN IF NOT EXISTS brief_description TEXT;

-- Add hero_image field if it doesn't exist
ALTER TABLE pre_owned 
ADD COLUMN IF NOT EXISTS hero_image TEXT;

-- Update existing records to generate slugs from title
UPDATE pre_owned 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Set hero_image to first image in images array if available
UPDATE pre_owned 
SET hero_image = images[1]
WHERE hero_image IS NULL AND images IS NOT NULL AND array_length(images, 1) > 0;

-- Set brief_description from description if available
UPDATE pre_owned 
SET brief_description = LEFT(description, 200)
WHERE brief_description IS NULL AND description IS NOT NULL;

-- Set published to true for all records (or you can set specific ones)
UPDATE pre_owned 
SET published = true
WHERE published = false;

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_pre_owned_slug ON pre_owned(slug);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS idx_pre_owned_published ON pre_owned(published);
