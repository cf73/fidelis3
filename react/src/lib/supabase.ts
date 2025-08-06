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
  specs?: string;
  quote?: string;
  quote_attribution?: string;
  reviews_set?: Review[];
  price?: number;
  available_for_demo?: boolean;
  available_to_buy_online?: boolean;
  show_price?: boolean;
  local_only?: boolean;
  featured?: boolean;
  published?: boolean;
  created_at: string;
  updated_at: string;
  categories?: ProductCategory;
  manufacturer?: Manufacturer;
}

export interface Review {
  excerpt?: string;
  attribution?: string;
  link?: string;
  date_of_review?: string;
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
  image?: string;
  published?: boolean;
  created_at: string;
  updated_at: string;
  system_category?: string;
  news_date?: string;
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
    .order('news_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
};

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  // First try to find by slug
  let { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  // If not found by slug, try by ID
  if (error) {
    console.log('Not found by slug, trying by ID:', slug);
    const { data: dataById, error: errorById } = await supabase
      .from('news')
      .select('*')
      .eq('id', slug)
      .eq('published', true)
      .single();
    
    if (errorById) {
      console.log('Not found by ID, trying to find by generated slug from title');
      // Try to find by matching the slug against generated slugs from titles
      const { data: allNews, error: allNewsError } = await supabase
        .from('news')
        .select('*')
        .eq('published', true);
      
      if (!allNewsError && allNews) {
        const article = allNews.find(item => {
          const generatedSlug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          return generatedSlug === slug;
        });
        
        if (article) {
          return article;
        }
      }
      
      console.error('Error fetching news article by ID:', errorById);
      return null;
    }
    
    data = dataById;
  }

  return data;
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
  
  // Handle different image path formats
  let cleanPath = imagePath;
  
  // Remove leading slashes
  cleanPath = cleanPath.replace(/^\/+/, '');
  
  // Remove 'main/' prefix if present
  cleanPath = cleanPath.replace(/^main\//, '');
  
  // Remove 'assets/' prefix if present
  cleanPath = cleanPath.replace(/^assets\//, '');
  
  // For news images, they might be stored with just the filename
  // If the path contains slashes, it's a relative path, otherwise it's just a filename
  if (cleanPath.includes('/')) {
    // It's a relative path, use as is
    return supabase.storage.from('images').getPublicUrl(cleanPath).data.publicUrl;
  } else {
    // It's just a filename, use it directly
    return supabase.storage.from('images').getPublicUrl(cleanPath).data.publicUrl;
  }
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

// Get related products based on manufacturer and category
export const getRelatedProducts = async (productId: string, manufacturerId?: string, categoryId?: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories:product_categories!products_category_id_fkey(id, name, slug),
      manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
    `)
    .neq('id', productId)
    .eq('published', true)
    .limit(6);

  // Build OR condition for manufacturer or category matches
  if (manufacturerId && categoryId) {
    query = query.or(`manufacturer_id.eq.${manufacturerId},category_id.eq.${categoryId}`);
  } else if (manufacturerId) {
    query = query.eq('manufacturer_id', manufacturerId);
  } else if (categoryId) {
    query = query.eq('category_id', categoryId);
  } else {
    // Fallback to featured products if no relationships
    query = query.eq('featured', true);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
  
  return data || [];
};