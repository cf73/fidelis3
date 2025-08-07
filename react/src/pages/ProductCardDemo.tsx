/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * ProductCard Demo Page - Showcases our refined card design
 */

import React, { useState, useEffect } from 'react';
import { getProductsWithCategories } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { ProductCard } from '../components/ui';

export const ProductCardDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProductsWithCategories();
        
        // Filter for products with long titles for stress testing
        const stressTestProducts = productsData.filter(product => 
          product.title && (
            product.title.includes('Rigid Rack') ||
            product.title.includes('Sigma v2') ||
            product.title.includes('Platinum Eclipse') ||
            product.title.includes('Speaker Cable') ||
            product.title.includes('Interconnect') ||
            product.title.length > 25
          )
        );
        
        // Use stress test products if found, otherwise fall back to first 6
        const displayProducts = stressTestProducts.length > 0 
          ? stressTestProducts.slice(0, 6) 
          : productsData.slice(0, 6);
          
        setProducts(displayProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading ProductCard demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-light tracking-wide text-stone-800 mb-2">
            ProductCard Component Demo
          </h1>
          <p className="text-stone-600 font-light">
            Showcasing our refined midcentury modern card design with stress test products
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="py-20 bg-[#fffcf9]">
        <div className="container-custom">
          <h2 className="text-2xl font-light tracking-wide text-stone-800 mb-8">
            Product Cards (Midcentury Modern)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div className="py-20 bg-stone-50">
        <div className="container-custom">
          <h2 className="text-2xl font-light tracking-wide text-stone-800 mb-8">
            Size Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                size={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Without Badges */}
      <div className="py-20 bg-[#fffcf9]">
        <div className="container-custom">
          <h2 className="text-2xl font-light tracking-wide text-stone-800 mb-2">
            Without Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                size="md"
                showBadges={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
