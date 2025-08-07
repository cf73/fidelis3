/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * ProductCard Component - Refined Midcentury Modern Design
 * Captures the sophisticated card design we developed in the moodboard
 */

import React from 'react';
import { Product } from '../lib/supabase';
import { getImageUrl } from '../lib/supabase';

export interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'elevated' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showBadges?: boolean;
  showPrice?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  size = 'md',
  showBadges = true,
  showPrice = true,
  className = ''
}) => {
  // Visual styling variants - no functionality changes
  const variants = {
    default: {
      card: 'bg-[#f4f0ed] rounded-3xl hover:bg-[#ede9e6] transition-all duration-300 cursor-pointer',
      title: 'text-3xl font-bold text-gray-900 mb-2',
      price: 'text-xl font-bold text-gray-900',
      manufacturer: 'text-sm text-gray-600',
      category: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-200 text-stone-700',
      featured: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-800 text-stone-50'
    },
    elevated: {
      card: 'bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1',
      title: 'text-2xl font-bold text-gray-900 mb-2',
      price: 'text-xl font-bold text-gray-900',
      manufacturer: 'text-sm text-gray-600',
      category: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700',
      featured: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700'
    },
    minimal: {
      card: 'bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 cursor-pointer',
      title: 'text-xl font-semibold text-gray-900 mb-2',
      price: 'text-lg font-bold text-gray-900',
      manufacturer: 'text-sm text-gray-500',
      category: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600',
      featured: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700'
    }
  };

  const sizes = {
    sm: {
      image: 'aspect-square',
      content: 'px-4 pb-4 pt-6',
      title: 'text-lg font-bold text-gray-900 mb-1',
      price: 'text-base font-bold text-gray-900',
      manufacturer: 'text-xs text-gray-600'
    },
    md: {
      image: 'aspect-square',
      content: 'px-6 pb-6 pt-8',
      title: 'text-3xl font-bold text-gray-900 mb-2',
      price: 'text-xl font-bold text-gray-900',
      manufacturer: 'text-sm text-gray-600'
    },
    lg: {
      image: 'aspect-square',
      content: 'px-8 pb-8 pt-10',
      title: 'text-4xl font-bold text-gray-900 mb-3',
      price: 'text-2xl font-bold text-gray-900',
      manufacturer: 'text-base text-gray-600'
    }
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <div className={`${currentVariant.card} ${currentSize.image} relative overflow-hidden ${className}`}>
      {/* Product Image - Full Bleed */}
      <div>
        {product.product_hero_image ? (
          <img
            src={getImageUrl(product.product_hero_image)}
            alt={product.title}
            className="w-full aspect-square object-cover"
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
      <div className={currentSize.content}>
        <h3 className={currentSize.title}>{product.title}</h3>
        
        {product.manufacturer && (
          <p className={currentSize.manufacturer}>{product.manufacturer.name}</p>
        )}
        
        {showPrice && product.price && (
          <p className={currentSize.price}>${product.price.toLocaleString()}</p>
        )}
        
        {showBadges && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {product.categories && (
                <span className={currentVariant.category}>
                  {product.categories.name}
                </span>
              )}
              {product.featured && (
                <span className={currentVariant.featured}>
                  Featured
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 font-light">2 Variants</span>
          </div>
        )}
      </div>
    </div>
  );
};
