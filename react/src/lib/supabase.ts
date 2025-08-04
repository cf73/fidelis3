import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values for testing
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

console.log('🔧 Using hardcoded Supabase values for testing');
console.log('VITE_SUPABASE_URL: ✅ Found (hardcoded)');
console.log('VITE_SUPABASE_ANON_KEY: ✅ Found (hardcoded)');
console.log('');

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our data
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  title: string;
  product_name?: string;
  product_hero_image?: string;
  product_gallery?: string[];
  price?: number;
  product_price?: string;
  product_specifications?: string;
  description?: string | any; // Can be string or rich text object
  summary?: string;
  manufacturer?: string; // This is actually a UUID, we'll need to resolve it
  pairs_well_with?: string[];
  also_consider?: string[];
  available_for_demo?: boolean;
  available_to_buy_online?: boolean;
  local_only?: boolean;
  has_files?: boolean;
  featured?: boolean;
  in_stock?: boolean;
  video_url?: string;
  content?: string;
  main_content?: string;
  text?: string;
  featured_description?: string;
  featured_in_product_category?: string;
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
  // Categories will be fetched separately via relationships
  categories?: ProductCategory[];
}

export interface Manufacturer {
  id: string;
  title: string;
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  'product-categories'?: string[];
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id: string;
  title: string;
  news_title?: string;
  news_image?: string;
  news_summary?: string;
  news_content?: string;
  news_date?: string;
  news_author?: string;
  news_tags?: string[];
  news_featured?: boolean;
  brief_description?: string;
  'product-categories'?: string[];
  system_category?: string;
  content?: string;
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PreOwned {
  id: string;
  title: string;
  item_name?: string;
  item_description?: string;
  item_price?: string;
  item_condition?: string;
  item_images?: string[];
  local_only?: boolean;
  hide_your_price?: boolean;
  content?: string;
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  title: string;
  testimonial_text?: string;
  author?: string;
  author_title?: string;
  author_image?: string;
  heading?: string;
  content?: string;
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EvergreenCarousel {
  id: string;
  title: string;
  carousel_title?: string;
  carousel_image?: string;
  carousel_link?: string;
  carousel_caption?: string;
  title_text?: string;
  content?: string;
  slug?: string;
  url?: string;
  entry_date?: string;
  last_modified?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get image URL
export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    console.log('⚠️  No image path provided');
    return '';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    console.log('🌐 Using full URL:', imagePath);
    return imagePath;
  }
  
  // Use Supabase client's getPublicUrl method
  const cleanPath = imagePath.replace(/^\/+/, '');
  const { data } = supabase.storage.from('images').getPublicUrl(cleanPath);
  console.log('🖼️  Generated image URL:', data.publicUrl);
  return data.publicUrl;
}

// Data fetching functions
export async function getProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('❌ Error fetching product categories:', error);
    return [];
  }
  
  return data || [];
}

export async function getProducts(): Promise<Product[]> {
  console.log('🔍 Fetching products from Supabase...');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
  
  console.log(`✅ Fetched ${data?.length || 0} products from Supabase`);
  if (data && data.length > 0) {
    console.log('📦 Sample product:', JSON.stringify(data[0], null, 2));
    console.log('🔍 Image fields in sample product:');
    console.log('  - product_hero_image:', data[0].product_hero_image);
    console.log('  - featured_image:', data[0].featured_image);
    console.log('  - logo:', data[0].logo);
    
    // Check how many products have image data
    const productsWithImages = data.filter(p => p.product_hero_image || p.featured_image);
    console.log(`📊 Products with images: ${productsWithImages.length} of ${data.length}`);
    
    if (productsWithImages.length > 0) {
      console.log('🖼️  First product with image:', productsWithImages[0]);
    }
  }
  
  return data || [];
}

export async function getProductsWithCategories(): Promise<Product[]> {
  console.log('🔍 Fetching products with categories from Supabase...');
  
  // First get all products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('title');
  
  if (productsError) {
    console.error('❌ Error fetching products:', productsError);
    return [];
  }
  
  // Get all manufacturers to resolve UUIDs
  const { data: manufacturers, error: manufacturersError } = await supabase
    .from('manufacturers')
    .select('id, title');
  
  if (manufacturersError) {
    console.error('❌ Error fetching manufacturers:', manufacturersError);
  }
  
  // Create a map of manufacturer ID to name
  const manufacturerMap = new Map();
  if (manufacturers) {
    manufacturers.forEach(man => manufacturerMap.set(man.id, man.title));
  }
  
  // Then get all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('product_categories')
    .select('*');
  
  if (categoriesError) {
    console.error('❌ Error fetching categories:', categoriesError);
    return products || [];
  }
  
  // Get all relationships
  const { data: relationships, error: relationshipsError } = await supabase
    .from('product_category_relationships')
    .select('product_id, category_id');
  
  if (relationshipsError) {
    console.error('❌ Error fetching relationships:', relationshipsError);
    return products || [];
  }
  
  // Create a map of category ID to category object
  const categoryMap = new Map();
  categories.forEach(cat => categoryMap.set(cat.id, cat));
  
  // Create a map of product ID to category IDs
  const productCategoriesMap = new Map();
  relationships.forEach(rel => {
    if (!productCategoriesMap.has(rel.product_id)) {
      productCategoriesMap.set(rel.product_id, []);
    }
    productCategoriesMap.get(rel.product_id).push(rel.category_id);
  });
  
  // Attach categories to products and resolve manufacturer names
  const productsWithCategories = products.map(product => ({
    ...product,
    manufacturer: product.manufacturer ? manufacturerMap.get(product.manufacturer) || product.manufacturer : undefined,
    categories: productCategoriesMap.get(product.id)?.map((catId: string) => categoryMap.get(catId)).filter(Boolean) || []
  }));
  
  console.log(`✅ Fetched ${productsWithCategories.length} products with categories`);
  return productsWithCategories;
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('Error fetching manufacturers:', error);
    return [];
  }
  
  return data || [];
}

export async function getNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('entry_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  
  return data || [];
}

export async function getPreOwned(): Promise<PreOwned[]> {
  const { data, error } = await supabase
    .from('pre_owned')
    .select('*')
    .order('entry_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching pre-owned:', error);
    return [];
  }
  
  return data || [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('entry_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  
  return data || [];
}

export async function getEvergreenCarousel(): Promise<EvergreenCarousel[]> {
  const { data, error } = await supabase
    .from('evergreen_carousel')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('Error fetching evergreen carousel:', error);
    return [];
  }
  
  return data || [];
}

// Helper function to get related products by UUIDs
export async function getRelatedProducts(uuids: string[]): Promise<Product[]> {
  if (!uuids || uuids.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', uuids);
  
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
  
  return data || [];
}

// Helper function to get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug || slug === 'undefined' || slug === 'null') {
    return null;
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
}

// Helper function to get a single manufacturer by slug
export async function getManufacturerBySlug(slug: string): Promise<Manufacturer | null> {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching manufacturer:', error);
    return null;
  }
  
  return data;
}

// Helper function to get a single news article by slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
  
  return data;
} 