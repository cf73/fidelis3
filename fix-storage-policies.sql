-- Check if images bucket exists and has proper policies
-- First, let's see what buckets exist
SELECT name FROM storage.buckets;

-- If images bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated users to upload to images bucket
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' AND 
        auth.uid() IS NOT NULL
    );

-- Create storage policy for public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Create storage policy for authenticated users to update images
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' AND 
        auth.uid() IS NOT NULL
    );

-- Create storage policy for authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' AND 
        auth.uid() IS NOT NULL
    );

