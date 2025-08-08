/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 *
 * Card Component System - Refined Midcentury Modern Design
 * Unified card system for all card types across the site
 * Updated: Fixed module export issue
 */

import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../lib/supabase';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'product' | 'news' | 'manufacturer' | 'category' | 'featured' | 'value';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  href,
  as: Component = 'div'
}) => {
  const baseClasses = 'rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer';
  
  const variants = {
    default: 'bg-white',
    product: 'bg-[#f4f0ed] hover:bg-[#ede9e6]',
    news: 'bg-white hover:shadow-xl',
    manufacturer: 'bg-white border border-stone-200 hover:border-stone-300',
    category: 'bg-white hover:shadow-xl transform hover:-translate-y-2 group',
    featured: 'bg-gradient-to-br from-stone-600 to-stone-700 text-white',
    value: 'bg-white text-center'
  };
  
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    className
  ].filter(Boolean).join(' ');
  
  const content = (
    <Component className={classes} onClick={onClick}>
      {children}
    </Component>
  );
  
  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  
  return content;
};

// Specialized card components for different use cases
export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price?: number;
    manufacturer?: string | { name: string };
    product_hero_image?: string;
    categories?: { name: string };
    featured?: boolean;
  };
  showBadges?: boolean;
  showPrice?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showBadges = true,
  showPrice = true,
  className = ''
}) => {
  return (
    <div className={`bg-[#f4f0ed] rounded-3xl hover:bg-[#ede9e6] transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col ${className}`}>
      {/* Product Image */}
      <div className="border-b border-[#f4f0ed] border-solid" style={{ borderWidth: '1px' }}>
        {product.product_hero_image ? (
          <img
            src={getImageUrl(product.product_hero_image)}
            alt={product.title}
            className="w-full aspect-square object-contain mix-blend-multiply"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
             {/* Product Content */}
       <div className="px-6 pb-6 pt-8 flex flex-col flex-grow">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h3>
        {product.manufacturer && (
          <p className="text-sm text-gray-600">{typeof product.manufacturer === 'string' ? product.manufacturer : product.manufacturer.name}</p>
        )}
        {showPrice && product.price && (
          <p className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {showBadges && product.categories && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-200 text-stone-700">
                {product.categories.name}
              </span>
            )}
            {showBadges && product.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-800 text-stone-50">
                Featured
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-light">2 Variants</span>
        </div>
      </div>
    </div>
  );
};

export interface NewsCardProps {
  article: {
    id: string;
    title: string;
    summary?: string;
    brief_description?: string;
    image?: string;
    news_date?: string;
    slug?: string;
  };
  variant?: 'horizontal-left' | 'horizontal-right';
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'horizontal-left',
  className = ''
}) => {
  const isLeftText = variant === 'horizontal-left';
  
  return (
    <div className={`bg-[#f4f0ed] rounded-3xl hover:bg-[#ede9e6] transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col md:flex-row h-full group ${className}`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${isLeftText ? 'md:order-2' : 'md:order-1'} w-full md:w-1/2`}>
        <div className="w-full h-64 md:h-full">
          {article.image ? (
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <svg className="h-16 w-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`px-6 pb-6 pt-8 flex flex-col justify-between ${isLeftText ? 'md:order-1' : 'md:order-2'} w-full md:w-1/2 min-h-64 md:min-h-0`}>
        <div>
          {/* Date */}
          {article.news_date && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.news_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 line-clamp-2">
            {article.title}
          </h3>
          
          {/* Description/Summary */}
          {(article.summary || article.brief_description) && (
            <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
              {article.summary || article.brief_description}
            </p>
          )}
        </div>
        
        {/* Read More */}
        <div className="flex items-center text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-200 mt-4">
          <span className="text-sm md:text-base">Read Full Article</span>
          <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export interface ManufacturerCardProps {
  manufacturer: {
    id: string;
    name: string;
    logo?: string;
    description?: string;
  };
  className?: string;
}

export const ManufacturerCard: React.FC<ManufacturerCardProps> = ({
  manufacturer,
  className = ''
}) => {
  return (
    <Card variant="manufacturer" className={className}>
      <div className="p-6 text-center">
        {/* Logo */}
        {manufacturer.logo ? (
          <img
            src={getImageUrl(manufacturer.logo)}
            alt={manufacturer.name}
            className="h-20 mx-auto object-contain"
          />
        ) : (
          <div className="h-20 w-20 mx-auto bg-stone-100 rounded-lg flex items-center justify-center">
            <svg className="h-10 w-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

export interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    heroImage?: string;
    productCount?: number;
    brandCount?: number;
    featuredBrands?: string[];
    tags?: string[];
  };
  variant?: 'light' | 'dark';
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  variant = 'light',
  className = ''
}) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer group ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {category.heroImage ? (
          <img
            src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${category.heroImage}`}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-600 to-stone-800" />
        )}
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-transparent' : 'bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent'}`} />
      </div>
      
             {/* Content */}
       <div className="relative h-80 flex flex-col justify-end p-8">
         {/* Tags */}
         {category.tags && category.tags.length > 0 && (
           <div className="mb-4 flex flex-wrap gap-2">
             {category.tags.map((tag, index) => (
               <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDark ? 'bg-white/15 text-white/90 backdrop-blur-sm' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                 {tag}
               </span>
             ))}
           </div>
         )}
         
         {/* Title */}
         <h3 className={`text-5xl font-black tracking-tight mb-3 leading-tight ${isDark ? 'text-white' : 'text-white'}`}>
           {category.name}
         </h3>
         
         {/* Description */}
         {category.description && (
           <p className={`text-lg font-light mb-4 leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-100'}`}>
             {category.description}
           </p>
         )}
         
         {/* Featured Brands */}
         {category.featuredBrands && category.featuredBrands.length > 0 && (
           <div className="mb-4">
             <p className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-200'}`}>
               Featuring {category.featuredBrands.slice(0, 3).join(', ')}
               {category.featuredBrands.length > 3 && ' & more'}
             </p>
           </div>
         )}
         
         {/* Stats Row */}
         <div className="flex items-center gap-4 mb-6">
           {category.productCount !== undefined && (
             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDark ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-white/25 text-white backdrop-blur-sm'}`}>
               {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
             </span>
           )}
                       {category.brandCount && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDark ? 'bg-white/15 text-white/90 backdrop-blur-sm' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                {category.brandCount} Brands
              </span>
            )}
         </div>
         
         {/* Explore Link */}
         <div className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group/link">
           <span className="text-sm font-medium tracking-wide uppercase">Explore Collection</span>
           <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
           </svg>
         </div>
       </div>
      
      {/* Subtle Border */}
      <div className={`absolute inset-0 rounded-3xl border ${isDark ? 'border-white/10' : 'border-white/20'}`} />
    </div>
  );
};

export interface ValueCardProps {
  value: {
    icon: string;
    title: string;
    description: string;
  };
  className?: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({
  value,
  className = ''
}) => {
  return (
    <Card variant="value" size="lg" className={className}>
      <div className="text-center">
        <div className="text-4xl mb-4">{value.icon}</div>
        <h3 className="text-xl font-semibold text-stone-900 mb-4">
          {value.title}
        </h3>
        <p className="text-stone-600">
          {value.description}
        </p>
      </div>
    </Card>
  );
};

export interface CategoryNavigationProps {
  categories: {
    id: string;
    name: string;
    description?: string;
    heroImage?: string;
    productCount?: number;
    brandCount?: number;
    featuredBrands?: string[];
    tags?: string[];
  }[];
  className?: string;
  variant?: 'dramatic' | 'organic';
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  className = '',
  variant = 'dramatic'
}) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  // Preload all images for instant transitions
  useEffect(() => {
    categories.forEach(category => {
      if (category.heroImage) {
        const img = new Image();
        img.src = `https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${category.heroImage}`;
      }
    });
  }, [categories]);

  const handleCategoryHover = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTextVisible(false);
    
    setActiveCategory(index);
    
    // Staggered animation timing
    setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => setTextVisible(true), 150); // Text appears after image transition
    }, 500);
  };

  const activeCategoryData = activeCategory !== null ? categories[activeCategory] : null;

  if (variant === 'organic') {
    return (
      <div className={`relative h-screen flex ${className}`}>
        {/* Organic Image Layout - Randomly Positioned */}
        <div className="w-1/2 relative overflow-hidden bg-black">
          {activeCategoryData?.heroImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${activeCategoryData.heroImage}`}
                alt={activeCategoryData.name}
                className={`w-96 h-96 object-cover rounded-2xl shadow-2xl transition-all duration-700 ease-in-out ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ 
                  opacity: isTransitioning ? 0 : 1,
                  transition: 'all 700ms ease-in-out',
                  transform: `translate(${Math.sin(activeCategory || 0) * 50}px, ${Math.cos(activeCategory || 0) * 30}px)`
                }}
              />
            </div>
          )}
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Category Navigation - Right Half */}
        <div className="w-1/2 bg-black flex flex-col">
          {/* Header */}
          <div className="p-12 border-b border-white/10">
            <h3 className="text-white text-2xl font-light tracking-wide uppercase mb-2">
              Shop by Category
            </h3>
            <p className="text-stone-400 text-sm">
              Hover to explore our collections
            </p>
          </div>
          
          {/* Category Tiles - Organic Grid */}
          <div className="flex-1 p-8">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onMouseEnter={() => handleCategoryHover(index)}
                  onClick={() => {
                    window.location.href = `/products?category=${category.id}`;
                  }}
                  className={`p-6 text-left transition-all duration-500 border rounded-lg ${
                    index === activeCategory
                      ? 'border-white/40 bg-white/10 text-white scale-105'
                      : 'border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5 hover:scale-102'
                  }`}
                >
                  <span className="text-lg font-medium tracking-wide uppercase block mb-2">
                    {category.name}
                  </span>
                  {category.productCount && (
                    <span className="text-xs text-stone-400">
                      {category.productCount} products
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original dramatic layout
  return (
    <div className={`relative h-screen flex ${className}`}>
      {/* Dynamic Image Section - Full Bleed Left */}
      <div className="w-1/2 relative overflow-hidden">
        {/* Background Image with Seamless Cross-Dissolve */}
        {activeCategoryData?.heroImage ? (
          <img
            src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${activeCategoryData.heroImage}`}
            alt={activeCategoryData.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              opacity: isTransitioning ? 0 : 1,
              transition: 'opacity 500ms ease-in-out'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-600 to-stone-800" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-transparent" />
        
        {/* Content Overlay with Staggered Animations */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          {activeCategoryData ? (
            <>
              {/* Tags - Staggered Animation */}
              {activeCategoryData.tags && activeCategoryData.tags.length > 0 && (
                <div className={`mb-6 flex flex-wrap gap-2 transition-all duration-700 ease-out ${
                  textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {activeCategoryData.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 text-white backdrop-blur-sm"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Title - Staggered Animation */}
              <h2 className={`text-6xl font-black tracking-tight mb-6 leading-tight text-white transition-all duration-700 ease-out ${
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '200ms' }}>
                {activeCategoryData.name}
              </h2>
              
              {/* Description - Staggered Animation */}
              {activeCategoryData.description && (
                <p className={`text-xl font-light mb-8 leading-relaxed text-stone-200 max-w-lg transition-all duration-700 ease-out ${
                  textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '300ms' }}>
                  {activeCategoryData.description}
                </p>
              )}
              
              {/* Featured Brands - Staggered Animation */}
              {activeCategoryData.featuredBrands && activeCategoryData.featuredBrands.length > 0 && (
                <div className={`mb-8 transition-all duration-700 ease-out ${
                  textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '400ms' }}>
                  <p className="text-lg font-medium text-stone-300">
                    Featuring {activeCategoryData.featuredBrands.slice(0, 3).join(', ')}
                    {activeCategoryData.featuredBrands.length > 3 && ' & more'}
                  </p>
                </div>
              )}
              
              {/* Stats Row - Staggered Animation */}
              <div className={`flex items-center gap-6 mb-8 transition-all duration-700 ease-out ${
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '500ms' }}>
                {activeCategoryData.productCount !== undefined && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase bg-white/25 text-white backdrop-blur-sm">
                    {activeCategoryData.productCount} {activeCategoryData.productCount === 1 ? 'Product' : 'Products'}
                  </span>
                )}
                {activeCategoryData.brandCount && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase bg-white/15 text-white/90 backdrop-blur-sm">
                    {activeCategoryData.brandCount} Brands
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Default State - No Category Selected */
            <div className="text-center">
              <h2 className="text-6xl font-black tracking-tight mb-6 leading-tight text-white">
                Explore Our Collections
              </h2>
              <p className="text-xl font-light mb-8 leading-relaxed text-stone-200 max-w-lg">
                Hover over a category to discover our curated selection of premium audio equipment.
              </p>
            </div>
          )}
        </div>
        
        {/* Subtle Border */}
        <div className="absolute inset-0 border border-white/10" />
      </div>
      
      {/* Category Navigation - Right Quarter */}
      <div className="w-1/4 bg-black flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <h3 className="text-white text-lg font-medium tracking-wide uppercase">
            Shop by Category
          </h3>
        </div>
        
        {/* Category Tiles - Grid Layout */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onMouseEnter={() => handleCategoryHover(index)}
                onClick={() => {
                  // Navigate to category page
                  window.location.href = `/products?category=${category.id}`;
                }}
                className={`w-full p-4 text-left transition-all duration-300 border ${
                  index === activeCategory
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-sm font-medium tracking-wide uppercase">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
