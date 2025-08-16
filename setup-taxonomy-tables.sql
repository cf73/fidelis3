-- Create taxonomy tables for proper category management

-- Product Categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product-category relationships table
CREATE TABLE IF NOT EXISTS product_category_relationships (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (product_id, category_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_category_relationships_product_id ON product_category_relationships(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_relationships_category_id ON product_category_relationships(category_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);

-- Enable RLS on new tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON product_category_relationships FOR SELECT USING (true); 