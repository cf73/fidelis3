-- Create home_hero_images table for homepage hero image rotation
CREATE TABLE IF NOT EXISTS home_hero_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image TEXT NOT NULL, -- filename/path in images bucket
    alt_text TEXT, -- optional alt text for accessibility
    credit TEXT, -- optional photo credit
    weight INTEGER DEFAULT 1, -- optional weighting for selection
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE home_hero_images ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to published images
CREATE POLICY "Allow public read access to published home hero images" ON home_hero_images
    FOR SELECT USING (published = true);

-- Allow authenticated users to manage all images
CREATE POLICY "Allow authenticated users to manage home hero images" ON home_hero_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_home_hero_images_updated_at 
    BEFORE UPDATE ON home_hero_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO home_hero_images (image, alt_text, credit, weight) VALUES
-- ('sample-hero-1.jpg', 'Sample hero image 1', 'Photo by Sample Photographer', 1),
-- ('sample-hero-2.jpg', 'Sample hero image 2', 'Photo by Another Photographer', 1);

