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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Custom styles for mini carousel and polaroid effects
const miniCarouselStyles = `
  .preowned-swiper-bullet {
    width: 6px;
    height: 6px;
    background: rgb(168 162 158);
    border-radius: 50%;
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .preowned-swiper-bullet-active {
    background: rgb(120 113 108);
    opacity: 1;
    transform: scale(1.2);
  }
  .polaroid-card {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .polaroid-card:hover {
    transform: rotate(var(--hover-rotation)) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = miniCarouselStyles;
  if (!document.head.querySelector('[data-preowned-carousel-styles]')) {
    styleElement.setAttribute('data-preowned-carousel-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

// Generate true Apple squircle path using superellipse formula
const generateSquirclePath = (size: number = 100, cornerRadius: number = 24) => {
  const points: string[] = [];
  const steps = 360;
  const a = size / 2; // semi-major axis
  const b = size / 2; // semi-minor axis
  const n = 4.8; // Squircle exponent (Apple uses ~4.8)
  
  for (let i = 0; i <= steps; i++) {
    const angle = (2 * Math.PI * i) / steps;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    // Superellipse formula: |x/a|^n + |y/b|^n = 1
    const x = a * Math.sign(cosAngle) * Math.pow(Math.abs(cosAngle), 2/n);
    const y = b * Math.sign(sinAngle) * Math.pow(Math.abs(sinAngle), 2/n);
    
    const scaledX = x + size/2;
    const scaledY = y + size/2;
    
    if (i === 0) {
      points.push(`M ${scaledX} ${scaledY}`);
    } else {
      points.push(`L ${scaledX} ${scaledY}`);
    }
  }
  points.push('Z');
  return points.join(' ');
};

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
  const baseClasses = 'rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 ease-out overflow-hidden cursor-pointer';
  
  const variants = {
    default: 'bg-white',
    product: 'bg-[#f4f0ed] hover:bg-[#e8e4e1]',
    news: 'bg-white hover:shadow-xl',
    manufacturer: 'bg-white/50 hover:bg-white/80 shadow-none hover:shadow-none border-0',
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
    variant === 'manufacturer' ? 'rounded-xl transition-all duration-200 ease-out overflow-hidden cursor-pointer' : baseClasses,
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
  showCategory?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showBadges = true,
  showPrice = true,
  showCategory = true,
  className = ''
}) => {
  return (
    <div className={`group cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.01] ${className}`}>
      {/* Product Image - Square card with TRUE Apple squircle using superellipse mathematics */}
      <div 
        className="bg-[#f4f0ed] hover:bg-[#e8e4e1] transition-all duration-200 ease-out aspect-square mb-1 relative"
        style={{
          maskImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path d='${generateSquirclePath(100, 38)}' fill='white'/>
            </svg>
          `)}")`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path d='${generateSquirclePath(100, 38)}' fill='white'/>
            </svg>
          `)}")`,
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat'
        }}
      >
        {product.product_hero_image ? (
          <img
            src={getImageUrl(product.product_hero_image)}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Product Content - Outside the card */}
      <div className="space-y-0.5 pt-1 text-center">
        {/* Product name - centered */}
        <h3 className="text-base font-semibold text-stone-900 leading-tight">{product.title}</h3>
        
        {/* Manufacturer - centered */}
        {product.manufacturer && (
          <p className="text-xs text-stone-600">{typeof product.manufacturer === 'string' ? product.manufacturer : product.manufacturer.name}</p>
        )}
        
        {/* Price - centered */}
        {showPrice && product.price && (
          <p className="text-sm font-semibold text-stone-900">${product.price.toLocaleString()}</p>
        )}
        
        {/* Badges - centered */}
        {showBadges && (showCategory && product.categories || product.featured) && (
          <div className="flex flex-wrap gap-1 justify-center">
            {showCategory && product.categories && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-200 text-stone-700">
                {product.categories.name}
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-800 text-white">
                Featured
              </span>
            )}
          </div>
        )}
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
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  className = ''
}) => {
  return (
    <div className={`bg-[#f4f0ed] rounded-3xl hover:bg-[#e8e4e1] transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden flex flex-col md:flex-row h-full group ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden w-full md:w-1/2">
        <div className="w-full h-48 md:h-full">
          {article.image ? (
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
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
      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-6 md:pt-8 flex flex-col justify-between w-full md:w-1/2 min-h-48 md:min-h-0">
        <div>
          {/* Date */}
          {article.news_date && (
            <div className="flex items-center text-sm text-gray-600 mb-2 md:mb-3">
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
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
            {article.title}
          </h3>
          
          {/* Description/Summary */}
          {(article.summary || article.brief_description) && (
            <p className="text-gray-600 mb-3 md:mb-4 text-sm leading-relaxed line-clamp-3">
              {article.summary || article.brief_description}
            </p>
          )}
        </div>
        
        {/* Read More */}
        <div className="flex items-center text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-200 mt-3 md:mt-4">
          <span className="text-sm">Read Full Article</span>
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
            className="h-32 sm:h-20 mx-auto object-contain mix-blend-multiply transition-opacity"
          />
        ) : (
          <div className="h-32 w-32 sm:h-20 sm:w-20 mx-auto rounded-lg flex items-center justify-center">
            <svg className="h-16 w-16 sm:h-10 sm:w-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  };
  className?: string;
}

// Mid-century card, aligned with ProductCard styling
export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  return (
    <div className={`group cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.01] flex flex-col h-full ${className}`}>
      {/* Category Image - Square card with Apple squircle */}
      <div 
        className="bg-[#f4f0ed] hover:bg-[#e8e4e1] transition-all duration-200 ease-out aspect-square mb-1 relative"
        style={{
          maskImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path d='${generateSquirclePath(100, 38)}' fill='white'/>
            </svg>
          `)}")`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path d='${generateSquirclePath(100, 38)}' fill='white'/>
            </svg>
          `)}")`,
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat'
        }}
      >
        {category.heroImage ? (
          <img
            src={getImageUrl(category.heroImage)}
            alt={category.name}
            className="w-full h-full object-contain mix-blend-multiply p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Category Content - Outside the card */}
      <div className="flex flex-col flex-grow pt-1">
        <h3 className="text-base font-semibold text-stone-900 leading-tight text-center">{category.name}</h3>
      </div>
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
                      style={{ 
                        transitionDelay: `${index * 100}ms`,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                      }}
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
                  <span 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase bg-white/25 text-white backdrop-blur-sm"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                    }}
                  >
                    {activeCategoryData.productCount} {activeCategoryData.productCount === 1 ? 'Product' : 'Products'}
                  </span>
                )}
                {activeCategoryData.brandCount && (
                  <span 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase bg-white/15 text-white/90 backdrop-blur-sm"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                    }}
                  >
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
                className={`w-full p-4 text-left transition-all duration-200 ease-out border ${
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

// Pre-owned equipment card component
export interface PreOwnedCardProps {
  item: {
    id: string;
    title: string;
    description?: string;
    images?: string[];
    your_price?: number;
    new_retail_price?: number;
    hide_your_price?: boolean;
    local_only?: boolean;
    shipping?: number;
    original_accessories?: string;
    updated_at: string;
  };
  className?: string;
  index?: number;
  isVisible?: boolean;
}

export const PreOwnedCard: React.FC<PreOwnedCardProps> = ({
  item,
  className = '',
  index = 0,
  isVisible = true
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (yourPrice: number, retailPrice: number) => {
    const savings = retailPrice - yourPrice;
    const percentage = (savings / retailPrice) * 100;
    return { savings, percentage };
  };

  const formatListingDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Listed today';
    if (diffInDays === 1) return 'Listed yesterday';
    if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
    if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const savings = item.your_price && item.new_retail_price 
    ? calculateSavings(item.your_price, item.new_retail_price)
    : null;

  // Generate a consistent subtle random rotation for each card based on its ID
  const getCardRotation = (id: string) => {
    // Use the ID to generate a consistent "random" rotation between -1 and 1 degrees
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rotation = ((hash % 200) - 100) / 100; // Range: -1 to 1
    return rotation;
  };

  const cardRotation = getCardRotation(item.id);
  // Create a subtle hover rotation (add 0.8 degree shift)
  const hoverRotation = cardRotation + (cardRotation > 0 ? 0.8 : -0.8);

  // Calculate staggered animation delay (faster now)
  const animationDelay = index * 80; // 80ms between each card

  return (
    <div 
      className={`group cursor-pointer transition-all duration-400 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{ 
        transitionDelay: `${animationDelay}ms`
      }}
    >
      {/* Image Section - White card with carousel */}
      {item.images && item.images.length > 0 && (
        <div 
          className="polaroid-card bg-white rounded-2xl p-4 shadow-md mb-3 transition-transform duration-300 ease-out"
          style={{ 
            '--base-rotation': `${cardRotation}deg`,
            '--hover-rotation': `${hoverRotation}deg`,
            transform: `rotate(${cardRotation}deg)`
          } as React.CSSProperties & { '--base-rotation': string; '--hover-rotation': string }}
        >
          {item.images.length === 1 ? (
            /* Single image */
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-50">
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  style={{ 
                    imageRendering: 'high-quality',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
                {/* Polaroid inward shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Local pickup badge */}
                {item.local_only && (
                  <div className="absolute top-3 right-3">
                    <span 
                      className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-800 shadow-sm"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                      }}
                    >
                      Local Pickup
                    </span>
                  </div>
                )}
              </div>
              {/* Empty space for pagination alignment */}
              <div className="h-[7.2px] mt-3"></div>
              
              {/* Polaroid bottom area with title */}
              <div className="pt-3 pb-2">
                <h3 className="text-sm font-medium text-stone-800 leading-tight text-center line-clamp-2 min-h-[2.5rem] tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          ) : (
            /* Multiple images - Mini Carousel */
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  nextEl: `.preowned-swiper-next-${item.id}`,
                  prevEl: `.preowned-swiper-prev-${item.id}`,
                }}
                pagination={{
                  clickable: true,
                  el: `.preowned-swiper-pagination-${item.id}`,
                  bulletClass: 'preowned-swiper-bullet',
                  bulletActiveClass: 'preowned-swiper-bullet-active',
                }}
                className="preowned-card-swiper"
              >
                {item.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-[4/3] bg-stone-50 rounded-xl overflow-hidden">
                      <img
                        src={getImageUrl(image)}
                        alt={`${item.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        style={{ 
                          imageRendering: 'high-quality',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
                      />
                      {/* Polaroid inward shadow */}
                      <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Mini Navigation Buttons */}
              <button className={`preowned-swiper-prev-${item.id} absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}>
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              
              <button className={`preowned-swiper-next-${item.id} absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}>
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              
              {/* Mini Pagination */}
              <div className={`preowned-swiper-pagination-${item.id} flex justify-center items-center space-x-1 mt-3`}></div>
              
              {/* Polaroid bottom area with title */}
              <div className="pt-3 pb-2">
                <h3 className="text-sm font-medium text-stone-800 leading-tight text-center line-clamp-2 min-h-[2.5rem] tracking-wide">
                  {item.title}
                </h3>
              </div>
              
              {/* Local pickup badge */}
              {item.local_only && (
                <div className="absolute top-3 right-3 z-10">
                  <span 
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-800 shadow-sm"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                    }}
                  >
                    Local Pickup
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Content Section - Centered */}
      <div className="space-y-2 text-center">
        {/* Pricing Section */}
        {item.your_price && !item.hide_your_price && (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-stone-900">
                {formatPrice(item.your_price)}
              </span>
              {item.new_retail_price && (
                <span className="text-xs text-stone-500 line-through">
                  {formatPrice(item.new_retail_price)}
                </span>
              )}
            </div>
            
            {/* Savings Badge */}
            {savings && (
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Save {savings.percentage.toFixed(0)}% off
                </span>
              </div>
            )}
          </div>
        )}

        {/* Listing Date */}
        <div className="text-xs text-stone-500 font-medium">
          {formatListingDate(item.updated_at)}
        </div>
      </div>
    </div>
  );
};
