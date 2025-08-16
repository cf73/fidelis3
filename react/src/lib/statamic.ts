// Statamic API client for headless CMS
const STATAMIC_API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: relative URL (same domain)
  : 'http://localhost:8000/api';  // Development: Statamic backend on port 8000

// Types based on Statamic's API structure
export interface StatamicProduct {
  id: string;
  title: string;
  manufacturer?: {
    id: string;
    title: string;
    logo?: string;
    tagline?: string;
    description?: string;
  };
  product_hero_image?: string;
  price?: number;
  show_price?: boolean;
  available_for_demo?: boolean;
  available_to_buy_online?: boolean;
  local_only?: boolean;
  description?: any; // Bard field
  description_text?: string;
  quote?: string;
  quote_attribution?: string;
  specs?: any; // Bard field
  specs_text?: string;
  'product-categories'?: StatamicTaxonomyTerm;
  system_category?: StatamicTaxonomyTerm;
  pairs_well_with?: StatamicProduct[];
  also_consider?: StatamicProduct[];
  created_at?: string;
  updated_at?: string;
}

export interface StatamicManufacturer {
  id: string;
  title: string;
  logo?: string;
  tagline?: string;
  website?: string;
  hero_image?: string;
  description?: string;
  'product-categories'?: StatamicTaxonomyTerm;
  created_at?: string;
  updated_at?: string;
}

export interface StatamicNews {
  id: string;
  title: string;
  content?: any; // Bard field
  excerpt?: string;
  date?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatamicTaxonomyTerm {
  id: string;
  title: string;
  slug: string;
  category_description?: string;
  category_hero_image?: string;
  feature_on_homepage?: boolean;
  feature_a_product?: boolean;
  product?: StatamicProduct;
  featured_product_text?: any; // Bard field
  created_at?: string;
  updated_at?: string;
}

export interface StatamicPreOwned {
  id: string;
  title: string;
  description?: string;
  your_price?: number;
  new_retail_price?: number;
  hide_your_price?: boolean;
  local_only?: boolean;
  shipping?: number;
  original_accessories?: string;
  date?: string;
  images?: Array<{
    id: string;
    url: string;
    permalink: string;
    alt?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface StatamicTestimonial {
  id: string;
  title: string;
  content?: string;
  author?: string;
  attribution?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatamicPage {
  id: string;
  title: string;
  content?: any; // Bard field
  excerpt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatamicEvergreenCarousel {
  id: string;
  title: string;
  content?: any; // Bard field
  excerpt?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

// API client
export const statamicApi = {
  // Get all products with resolved relationships
  async getProducts(): Promise<StatamicProduct[]> {
    try {
      let allProducts: StatamicProduct[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/products/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allProducts = [...allProducts, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get a single product by ID
  async getProduct(id: string): Promise<StatamicProduct | null> {
    try {
      const response = await fetch(`${STATAMIC_API_BASE}/collections/products/entries/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get all manufacturers with resolved relationships
  async getManufacturers(): Promise<StatamicManufacturer[]> {
    try {
      let allManufacturers: StatamicManufacturer[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/manufacturers/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allManufacturers = [...allManufacturers, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allManufacturers;
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      return [];
    }
  },

  // Get a single manufacturer by ID
  async getManufacturer(id: string): Promise<StatamicManufacturer | null> {
    try {
      const response = await fetch(`${STATAMIC_API_BASE}/collections/manufacturers/entries/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching manufacturer:', error);
      return null;
    }
  },

  // Get all news articles
  async getNews(): Promise<StatamicNews[]> {
    try {
      let allNews: StatamicNews[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/news/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allNews = [...allNews, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allNews;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  // Get a single news article by ID
  async getNewsArticle(id: string): Promise<StatamicNews | null> {
    try {
      const response = await fetch(`${STATAMIC_API_BASE}/collections/news/entries/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching news article:', error);
      return null;
    }
  },

  // Get taxonomy terms
  async getTaxonomyTerms(taxonomy: string): Promise<StatamicTaxonomyTerm[]> {
    try {
      const response = await fetch(`${STATAMIC_API_BASE}/taxonomies/${taxonomy}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching taxonomy terms:', error);
      return [];
    }
  },

  // Get a single taxonomy term
  async getTaxonomyTerm(taxonomy: string, slug: string): Promise<StatamicTaxonomyTerm | null> {
    try {
      const response = await fetch(`${STATAMIC_API_BASE}/taxonomies/${taxonomy}/${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching taxonomy term:', error);
      return null;
    }
  },

  // Get pre-owned items
  async getPreOwned(): Promise<StatamicPreOwned[]> {
    try {
      let allPreOwned: StatamicPreOwned[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/pre-owned/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allPreOwned = [...allPreOwned, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allPreOwned;
    } catch (error) {
      console.error('Error fetching pre-owned items:', error);
      return [];
    }
  },

  // Get testimonials
  async getTestimonials(): Promise<StatamicTestimonial[]> {
    try {
      let allTestimonials: StatamicTestimonial[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/testimonials/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allTestimonials = [...allTestimonials, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allTestimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  // Get pages
  async getPages(): Promise<StatamicPage[]> {
    try {
      let allPages: StatamicPage[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/pages/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allPages = [...allPages, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allPages;
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  },

  // Get evergreen carousel items
  async getEvergreenCarousel(): Promise<StatamicEvergreenCarousel[]> {
    try {
      let allCarouselItems: StatamicEvergreenCarousel[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`${STATAMIC_API_BASE}/collections/evergreen-carousel/entries?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          allCarouselItems = [...allCarouselItems, ...data.data];
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return allCarouselItems;
    } catch (error) {
      console.error('Error fetching evergreen carousel:', error);
      return [];
    }
  },

  // Helper function to extract text from Bard fields
  extractTextFromBard(bardField: any): string {
    if (!bardField || !Array.isArray(bardField)) return '';
    
    return bardField
      .map(block => {
        if (block.type === 'paragraph') {
          return block.content
            ?.map(content => content.text || '')
            .join('') || '';
        }
        return '';
      })
      .join(' ')
      .trim();
  },

  // Helper function to get image URL from Statamic asset object
  getImageUrl(asset: any): string {
    if (!asset) return '';
    
    // If asset is a string (legacy format), return as is
    if (typeof asset === 'string') {
      return asset; // Return as-is, will be relative URL
    }
    
    // If asset is an object with url property
    if (asset && typeof asset === 'object' && asset.url) {
      // In development, point to Statamic server; in production, use relative URL
      if (process.env.NODE_ENV === 'development') {
        return `http://localhost:8000${asset.url}`;
      }
      return asset.url; // Return relative URL for production
    }
    
    // If asset is an object with permalink property
    if (asset && typeof asset === 'object' && asset.permalink) {
      return asset.permalink;
    }
    
    // If asset is an object with id and url properties (new format)
    if (asset && typeof asset === 'object' && asset.id && asset.url) {
      // In development, point to Statamic server; in production, use relative URL
      if (process.env.NODE_ENV === 'development') {
        return `http://localhost:8000${asset.url}`;
      }
      return asset.url; // Return relative URL for production
    }
    
    return '';
  }
}; 