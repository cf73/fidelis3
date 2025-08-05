import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log the configuration (without exposing the full key)
console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key available:', !!supabaseKey);
console.log('Key length:', supabaseKey?.length || 0);
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'
});

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not available');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  content: string;
  brief_description?: string;
  product_hero_image?: string;
  product_gallery?: string[];
  price?: number;
  featured?: boolean;
  published?: boolean;
  created_at: string;
  updated_at: string;
  categories?: ProductCategory;
  manufacturer?: Manufacturer;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  brief_description?: string;
  hero_image?: string;
  published?: boolean;
  created_at: string;
  updated_at: string;
  system_category?: string;
}

export interface PreOwned {
  id: string;
  title: string;
  slug: string;
  content: string;
  brief_description?: string;
  hero_image?: string;
  published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  title: string;
  slug: string;
  content: string;
  author?: string;
  published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EvergreenCarousel {
  id: string;
  title: string;
  slug: string;
  content: string;
  hero_image?: string;
  published?: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

// Data fetching functions
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
};

export const getProductsWithCategories = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:product_categories!products_category_id_fkey(id, name, slug),
      manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products with categories:', error);
    return [];
  }

  return data || [];
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:product_categories!products_category_id_fkey(id, name, slug),
      manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }

  return data || [];
};

export const getManufacturers = async (): Promise<Manufacturer[]> => {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching manufacturers:', error);
    return [];
  }

  return data || [];
};

export const getManufacturerBySlug = async (slug: string): Promise<Manufacturer | null> => {
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
};

export const getNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
};

export const getEvergreenCarousel = async (): Promise<EvergreenCarousel[]> => {
  const { data, error } = await supabase
    .from('evergreen_carousel')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching evergreen carousel:', error);
    return [];
  }

  return data || [];
};

// Image URL helper
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Clean the path to remove any leading slashes or 'main/' prefixes
  const cleanPath = imagePath.replace(/^\/+/, '').replace(/^main\//, '');
  
  return supabase.storage.from('images').getPublicUrl(cleanPath).data.publicUrl;
};

// CMS Functions for authenticated users
export const createProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  return { data, error };
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  return { error };
};

// Image upload function
export const uploadImage = async (file: File, filename: string) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  return { data, error };
};

export const deleteImage = async (filename: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([filename]);

  return { error };
};