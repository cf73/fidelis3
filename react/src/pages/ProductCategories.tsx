import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { getProductCategories, getProductsWithCategories } from '../lib/supabase';
import { ProductCategory, Product } from '../lib/supabase';

interface CategoryWithHero extends ProductCategory {
  heroImage?: string;
  productCount?: number;
}

export const ProductCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithHero[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getProductCategories(),
          getProductsWithCategories(),
        ]);

        // Enhance categories with hero images and product counts
        const enhancedCategories = categoriesData.map(category => {
          const categoryProducts = productsData.filter(product => 
            product.categories?.id === category.id
          );
          
          // Get the first product with a hero image for this category
          const heroProduct = categoryProducts.find(product => 
            product.product_hero_image
          );

          return {
            ...category,
            heroImage: heroProduct?.product_hero_image,
            productCount: categoryProducts.length
          };
        });

        setCategories(enhancedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Product Categories</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore our comprehensive collection of high-quality audio equipment, organized by category to help you find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products/list?category=${category.id}`}
              className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative">
                {/* Hero Image */}
                {category.heroImage ? (
                  <div className="aspect-w-16 aspect-h-9 w-full">
                    <img
                      src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${category.heroImage}`}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-8">
                  {/* Category Title and Count */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                    {category.productCount !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </span>
                    )}
                  </div>

                  {/* Category Description */}
                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                      {category.description}
                    </p>
                  )}

                  {/* Explore Button */}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-lg group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    <span>Explore {category.name}</span>
                    <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Products Link */}
        <div className="mt-20 text-center">
          <Link
            to="/products/list"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}; 