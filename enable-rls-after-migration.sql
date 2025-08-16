-- Re-enable RLS and set up proper policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_owned ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE evergreen_carousel ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON news FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON pre_owned FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON evergreen_carousel FOR SELECT USING (true); 