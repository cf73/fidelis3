-- Re-enable RLS and set up policies for taxonomy tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON product_category_relationships FOR SELECT USING (true); 