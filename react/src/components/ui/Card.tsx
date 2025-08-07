/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 *
 * Card Component System - Refined Midcentury Modern Design
 * Unified card system for all card types across the site
 */

import React from 'react';
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
    <Card variant="news" className={className}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="w-full h-64">
          {article.image ? (
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
      <div className="p-6">
        {/* Date */}
        {article.news_date && (
          <div className="flex items-center text-sm text-stone-500 mb-3">
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
        <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        {/* Description */}
        {article.brief_description && (
          <p className="text-stone-600 mb-4 line-clamp-3">
            {article.brief_description}
          </p>
        )}
        
        {/* Read More */}
        <div className="flex items-center text-stone-600 hover:text-stone-700 font-medium transition-colors duration-200">
          <span>Read Full Article</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
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
    <div className={`${isDark ? 'bg-[#f4f0ed] hover:bg-[#ede9e6]' : 'bg-[#f4f0ed] hover:bg-[#ede9e6]'} rounded-3xl transition-all duration-300 cursor-pointer relative overflow-hidden ${className}`}>
      {/* Category Image */}
      <div className={`${isDark ? 'border-b border-stone-900' : 'border-b border-[#f4f0ed]'} border-solid`} style={{ borderWidth: '1px' }}>
        {category.heroImage ? (
          <img
            src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${category.heroImage}`}
            alt={category.name}
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Category Content */}
      <div className={`px-6 pb-6 pt-8 ${isDark ? 'bg-stone-900' : ''}`}>
        <h3 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
        {category.description && (
          <p className={`text-sm mb-4 ${isDark ? 'text-stone-300' : 'text-gray-600'}`}>{category.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {category.productCount !== undefined && (
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'}`}>
                {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>
          <span className={`text-xs font-light ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>Explore →</span>
        </div>
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
