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
  reivews_set?: Review[];
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
  pairs_well_with?: string[];
  also_consider?: string[];
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
  category_description?: string;
  hero_product_id?: string;
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
  summary?: string;
  brief_description?: string;
  main_content?: string;
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
  images?: string[];
  description?: string;
  your_price?: number;
  new_retail_price?: number;
  hide_your_price?: boolean;
  local_only?: boolean;
  shipping?: number;
  original_accessories?: string;
  date_listed?: string;
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

export interface HomeHeroImage {
  id: string;
  image: string; // path or filename in the `images` bucket
  alt_text?: string;
  credit?: string;
  weight?: number; // optional weighting for selection
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

// Admin functions for managing category hero products
export const updateCategoryHeroProduct = async (categoryId: string, productId: string | null) => {
  const { data, error } = await supabase
    .from('product_categories')
    .update({ hero_product_id: productId })
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating category hero product:', error);
    throw error;
  }

  return data;
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

export const getAdjacentNews = async (currentArticleId: string): Promise<{ previous: News | null; next: News | null }> => {
  // Get all published news articles ordered by date
  const { data: allNews, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('news_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !allNews) {
    console.error('Error fetching news for navigation:', error);
    return { previous: null, next: null };
  }

  // Find the current article's index
  const currentIndex = allNews.findIndex(article => article.id === currentArticleId);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  // Get previous and next articles
  const previous = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allNews[currentIndex - 1] : null;

  return { previous, next };
};

// Simple in-memory cache for performance
let manufacturersCache: Manufacturer[] | null = null;
let productsCache: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all manufacturers for text analysis (with caching)
export const getAllManufacturers = async (): Promise<Manufacturer[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (manufacturersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return manufacturersCache;
  }

  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('published', true)
    .order('name');

  if (error) {
    console.error('Error fetching manufacturers:', error);
    return manufacturersCache || [];
  }

  // Update cache
  manufacturersCache = data || [];
  cacheTimestamp = now;
  return manufacturersCache;
};

// Get all products for text analysis (with caching)
export const getAllProducts = async (): Promise<Product[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return productsCache;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('title');

  if (error) {
    console.error('Error fetching products:', error);
    return productsCache || [];
  }

  // Update cache
  productsCache = data || [];
  cacheTimestamp = now;
  return productsCache;
};

// Helper function to check if a word is likely a real mention vs common word
const isLikelyMention = (text: string, entityName: string, context: string): boolean => {
  const lowerText = text.toLowerCase();
  const lowerEntity = entityName.toLowerCase();
  
  // Skip if entity name is too generic (common words)
  const commonWords = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'insight', 'vision', 'power', 'energy', 'force', 'strength', 'quality', 'value',
    'premium', 'elite', 'master', 'pro', 'expert', 'advanced', 'superior', 'ultimate',
    'reference', 'standard', 'classic', 'modern', 'traditional', 'contemporary',
    'audio', 'sound', 'music', 'speaker', 'amplifier', 'receiver', 'turntable',
    'cable', 'wire', 'connector', 'jack', 'plug', 'adapter', 'converter'
  ];
  
  if (commonWords.includes(lowerEntity)) {
    return false;
  }
  
  // Check for proper capitalization patterns
  const entityWords = entityName.split(' ');
  const hasProperCapitalization = entityWords.some(word => 
    word.length > 1 && word[0] === word[0].toUpperCase()
  );
  
  if (!hasProperCapitalization && entityWords.length === 1) {
    return false;
  }
  
  // Check for contextual indicators that suggest it's a real mention
  const contextualIndicators = [
    'from', 'by', 'manufactured', 'produced', 'designed', 'created', 'developed',
    'model', 'series', 'line', 'collection', 'brand', 'company', 'manufacturer',
    'speaker', 'amplifier', 'receiver', 'turntable', 'cable', 'system', 'unit',
    'review', 'test', 'evaluation', 'comparison', 'specification', 'feature'
  ];
  
  const hasContextualIndicator = contextualIndicators.some(indicator => 
    context.toLowerCase().includes(indicator.toLowerCase())
  );
  
  // Check if the entity name appears in a technical/specific context
  const technicalContext = /(model|series|line|system|unit|speaker|amplifier|receiver)/i;
  const hasTechnicalContext = technicalContext.test(context);
  
  // Check for quotation marks or special formatting
  const hasQuotes = /["'`]/.test(context);
  
  // Check for brand-like patterns (multiple words, proper nouns)
  const isMultiWord = entityWords.length > 1;
  const hasBrandPattern = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(entityName);
  
  // Score the likelihood
  let score = 0;
  if (hasProperCapitalization) score += 2;
  if (hasContextualIndicator) score += 3;
  if (hasTechnicalContext) score += 2;
  if (hasQuotes) score += 1;
  if (isMultiWord) score += 2;
  if (hasBrandPattern) score += 2;
  
  // Require a minimum score to consider it a real mention
  return score >= 4;
};

// Helper function to get surrounding context
const getContext = (text: string, matchIndex: number, matchLength: number, contextSize: number = 50): string => {
  const start = Math.max(0, matchIndex - contextSize);
  const end = Math.min(text.length, matchIndex + matchLength + contextSize);
  return text.substring(start, end);
};

// Process article content for mentions and return linked content
export const processArticleMentions = async (content: string): Promise<{
  processedContent: string;
  mentions: {
    manufacturers: Array<{ name: string; slug: string; count: number }>;
    products: Array<{ title: string; slug: string; count: number }>;
  };
}> => {
  // Get all manufacturers and products for analysis
  const [manufacturers, products] = await Promise.all([
    getAllManufacturers(),
    getAllProducts()
  ]);

  let processedContent = content;
  const mentions = {
    manufacturers: [] as Array<{ name: string; slug: string; count: number }>,
    products: [] as Array<{ title: string; slug: string; count: number }>
  };

  // Process manufacturer mentions with contextual validation
  manufacturers.forEach(manufacturer => {
    const regex = new RegExp(`\\b${manufacturer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = processedContent.match(regex);
    
    if (matches && matches.length > 0) {
      // Validate each match with context
      let validMatches = 0;
      let lastIndex = 0;
      
      while (true) {
        const match = regex.exec(processedContent);
        if (!match) break;
        
        const context = getContext(processedContent, match.index, match[0].length);
        
        if (isLikelyMention(match[0], manufacturer.name, context)) {
          validMatches++;
          
          // Only replace the first valid match to avoid spam
          if (validMatches === 1) {
            processedContent = processedContent.replace(
              new RegExp(`\\b${manufacturer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
              `<a href="/manufacturers/${manufacturer.slug}" class="text-stone-600 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors">${manufacturer.name}</a>`
            );
          }
        }
      }
      
      if (validMatches > 0) {
        mentions.manufacturers.push({
          name: manufacturer.name,
          slug: manufacturer.slug,
          count: validMatches
        });
      }
    }
  });

  // Process product mentions with contextual validation
  products.forEach(product => {
    const regex = new RegExp(`\\b${product.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = processedContent.match(regex);
    
    if (matches && matches.length > 0) {
      // Validate each match with context
      let validMatches = 0;
      let lastIndex = 0;
      
      while (true) {
        const match = regex.exec(processedContent);
        if (!match) break;
        
        const context = getContext(processedContent, match.index, match[0].length);
        
        if (isLikelyMention(match[0], product.title, context)) {
          validMatches++;
          
          // Only replace the first valid match to avoid spam
          if (validMatches === 1) {
            processedContent = processedContent.replace(
              new RegExp(`\\b${product.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
              `<a href="/products/${product.slug}" class="text-stone-600 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors">${product.title}</a>`
            );
          }
        }
      }
      
      if (validMatches > 0) {
        mentions.products.push({
          title: product.title,
          slug: product.slug,
          count: validMatches
        });
      }
    }
  });

  return { processedContent, mentions };
};

// Optional AI-based validation for even more accurate mention detection
// This requires an OpenAI API key or similar service
export const validateMentionWithAI = async (
  text: string, 
  entityName: string, 
  context: string
): Promise<boolean> => {
  // This is a placeholder for AI-based validation
  // In a real implementation, you would:
  // 1. Send the context and entity name to an AI service
  // 2. Ask if the entity name refers to the actual product/manufacturer
  // 3. Get a confidence score back
  
  // Example prompt for AI validation:
  /*
  const prompt = `Context: "${context}"
  
  Entity: "${entityName}"
  
  Question: Does the entity name "${entityName}" in this context refer to an actual audio equipment product or manufacturer, or is it just a common word being used in a different sense?
  
  Consider:
  - Is it being used as a proper noun (brand/product name)?
  - Is it in a technical/audio equipment context?
  - Could it be confused with a common word?
  
  Answer with just "YES" or "NO" and a confidence score (0-100).`;
  */
  
  // For now, return the result of our rule-based validation
  return isLikelyMention(text, entityName, context);
};

// Enhanced mention processing with optional AI validation
export const processArticleMentionsEnhanced = async (
  content: string, 
  useAIValidation: boolean = false
): Promise<{
  processedContent: string;
  mentions: {
    manufacturers: Array<{ name: string; slug: string; count: number; confidence: number }>;
    products: Array<{ title: string; slug: string; count: number; confidence: number }>;
  };
}> => {
  const [manufacturers, products] = await Promise.all([
    getAllManufacturers(),
    getAllProducts()
  ]);

  let processedContent = content;
  const mentions = {
    manufacturers: [] as Array<{ name: string; slug: string; count: number; confidence: number }>,
    products: [] as Array<{ title: string; slug: string; count: number; confidence: number }>
  };

  // Process manufacturer mentions with enhanced validation
  for (const manufacturer of manufacturers) {
    const regex = new RegExp(`\\b${manufacturer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let validMatches = 0;
    let totalConfidence = 0;
    
    while (true) {
      const match = regex.exec(processedContent);
      if (!match) break;
      
      const context = getContext(processedContent, match.index, match[0].length);
      
      // Use AI validation if enabled, otherwise use rule-based
      const isValid = useAIValidation 
        ? await validateMentionWithAI(match[0], manufacturer.name, context)
        : isLikelyMention(match[0], manufacturer.name, context);
      
      if (isValid) {
        validMatches++;
        totalConfidence += 85; // Base confidence for rule-based validation
        
        // Only replace the first valid match
        if (validMatches === 1) {
          processedContent = processedContent.replace(
            new RegExp(`\\b${manufacturer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
            `<a href="/manufacturers/${manufacturer.slug}" class="text-stone-600 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors">${manufacturer.name}</a>`
          );
        }
      }
    }
    
    if (validMatches > 0) {
      mentions.manufacturers.push({
        name: manufacturer.name,
        slug: manufacturer.slug,
        count: validMatches,
        confidence: Math.round(totalConfidence / validMatches)
      });
    }
  }

  // Process product mentions with enhanced validation
  for (const product of products) {
    const regex = new RegExp(`\\b${product.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let validMatches = 0;
    let totalConfidence = 0;
    
    while (true) {
      const match = regex.exec(processedContent);
      if (!match) break;
      
      const context = getContext(processedContent, match.index, match[0].length);
      
      // Use AI validation if enabled, otherwise use rule-based
      const isValid = useAIValidation 
        ? await validateMentionWithAI(match[0], product.title, context)
        : isLikelyMention(match[0], product.title, context);
      
      if (isValid) {
        validMatches++;
        totalConfidence += 85; // Base confidence for rule-based validation
        
        // Only replace the first valid match
        if (validMatches === 1) {
          processedContent = processedContent.replace(
            new RegExp(`\\b${product.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
            `<a href="/products/${product.slug}" class="text-stone-600 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors">${product.title}</a>`
          );
        }
      }
    }
    
    if (validMatches > 0) {
      mentions.products.push({
        title: product.title,
        slug: product.slug,
        count: validMatches,
        confidence: Math.round(totalConfidence / validMatches)
      });
    }
  }

  return { processedContent, mentions };
};

// Pre-owned functions
export const getPreOwned = async (): Promise<PreOwned[]> => {
  const { data, error } = await supabase
    .from('pre_owned')
    .select('*')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching pre-owned items:', error);
    return [];
  }

  return data || [];
};

export const getPreOwnedBySlug = async (slug: string): Promise<PreOwned | null> => {
  const { data, error } = await supabase
    .from('pre_owned')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching pre-owned item:', error);
    return null;
  }

  return data;
};

export const getPreOwnedById = async (id: string): Promise<PreOwned | null> => {
  const { data, error } = await supabase
    .from('pre_owned')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching pre-owned item:', error);
    return null;
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

// Home hero images
export const getHomeHeroImages = async (): Promise<HomeHeroImage[]> => {
  const { data, error } = await supabase
    .from('home_hero_images')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching home hero images:', error);
    return [];
  }

  return data || [];
};

// Admin: list all (including unpublished)
export const adminListHomeHeroImages = async (): Promise<HomeHeroImage[]> => {
  const { data, error } = await supabase
    .from('home_hero_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error listing home hero images (admin):', error);
    return [];
  }
  return data || [];
};

export const createHomeHeroImage = async (item: Partial<HomeHeroImage>) => {
  const { data, error } = await supabase
    .from('home_hero_images')
    .insert([item])
    .select()
    .single();
  return { data, error };
};

export const updateHomeHeroImage = async (id: string, item: Partial<HomeHeroImage>) => {
  const { data, error } = await supabase
    .from('home_hero_images')
    .update(item)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteHomeHeroImage = async (id: string) => {
  const { error } = await supabase
    .from('home_hero_images')
    .delete()
    .eq('id', id);
  return { error };
};

// Image URL helper
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Handle different image path formats
  let cleanPath = imagePath;
  
  // If it's a full URL, extract just the filename
  if (cleanPath.startsWith('http')) {
    // Extract filename from URL
    const urlParts = cleanPath.split('/');
    cleanPath = urlParts[urlParts.length - 1];
  }
  
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
export const adminGetAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:product_categories!products_category_id_fkey(id, name, slug),
      manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data || [];
};

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

// Get products by their IDs (for cross-referenced products)
export const getProductsByIds = async (productIds: string[]): Promise<Product[]> => {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:product_categories!products_category_id_fkey(id, name, slug),
      manufacturer:manufacturers!products_manufacturer_id_fkey(id, name, slug)
    `)
    .in('id', productIds)
    .eq('published', true);

  if (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }

  return data || [];
};

// Get related products based on manufacturer and category (fallback)
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

// Get testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
};