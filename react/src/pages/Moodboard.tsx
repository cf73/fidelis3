/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Visual Language:
 * - Colors: Primary blue, accent gold, neutral grays
 * - Typography: Inter font, established scale
 * - Spacing: 4px base unit system
 * - Layout: Responsive grid, consistent padding
 */

import React, { useState, useEffect } from 'react';
import { getProductsWithCategories, getImageUrl } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { Card, H1, H2, H3, H4, Body, BodySmall, Price, Caption, Button } from '../components/ui';

export const Moodboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'premium' | 'modern' | 'classic' | 'midcentury'>('midcentury');

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
        
        // Use stress test products if found, otherwise fall back to first 8
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading moodboard...</p>
        </div>
      </div>
    );
  }

  const sampleProduct = products[0] || {
    id: '1',
    title: 'Sample Audio Component',
    brief_description: 'High-end audio component with exceptional sound quality and premium build.',
    price: 2499,
    manufacturer: { name: 'Premium Audio' },
    categories: { name: 'Amplifiers' },
    product_hero_image: null,
    featured: true,
    slug: 'sample'
  };

  const styleVariants = {
    minimal: {
      card: 'bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
      title: 'text-lg font-semibold text-gray-900 mb-2',
      price: 'text-xl font-bold text-green-600',
      manufacturer: 'text-sm text-gray-500',
      category: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700',
      featured: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700'
    },
    premium: {
      card: 'bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
      title: 'text-lg font-bold text-gray-900 mb-2',
      price: 'text-2xl font-bold text-green-600',
      manufacturer: 'text-sm font-medium text-gray-600',
      category: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800',
      featured: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-800'
    },
    modern: {
      card: 'bg-gradient-to-br from-white to-gray-50 border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105',
      title: 'text-lg font-bold text-gray-900 mb-2',
      price: 'text-2xl font-bold text-green-600',
      manufacturer: 'text-sm font-medium text-gray-600',
      category: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white',
      featured: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-accent-500 to-accent-600 text-white'
    },
    classic: {
      card: 'bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200',
      title: 'text-lg font-semibold text-gray-900 mb-2',
      price: 'text-xl font-bold text-green-700',
      manufacturer: 'text-sm text-gray-600 italic',
      category: 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800',
      featured: 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-accent-200 text-accent-800'
    },
    midcentury: {
      card: 'bg-[#f4f0ed] rounded-3xl hover:bg-[#ede9e6] transition-all duration-300 cursor-pointer',
      title: 'text-3xl font-bold text-gray-900 mb-2',
      price: 'text-xl font-bold text-gray-900',
      manufacturer: 'text-sm text-gray-600',
      category: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-200 text-stone-700',
      featured: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-800 text-stone-50'
    }
  };

  const currentStyle = styleVariants[selectedStyle];

  return (
    <div className={`min-h-screen ${selectedStyle === 'midcentury' ? 'bg-[#fffcf9]' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`px-8 py-6 ${selectedStyle === 'midcentury' ? 'bg-white' : 'bg-gray-900'}`}>
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <a href="#" className={`font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-800' : 'text-white'}`}>PRODUCTS▾</a>
            <a href="#" className={`font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-800' : 'text-white'}`}>ABOUT▾</a>
            <a href="#" className={`font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-800' : 'text-white'}`}>CONTACT▾</a>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`font-light ${selectedStyle === 'midcentury' ? 'text-stone-800' : 'text-white'}`}>Cart (0)</span>
          </div>
        </div>
      </nav>

      {/* Hero Section with Massive Brand Name Overlay */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl(products[0]?.product_hero_image || '')}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Massive Brand Name Overlay */}
        <div className="relative z-10 h-screen flex items-center">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Brand Name */}
              <div>
                <H1 className={`${selectedStyle === 'midcentury' ? 'text-stone-50 font-light tracking-wide text-9xl' : 'text-white'}`}>
                  FIDELIS
                </H1>
                <div className="mt-8">
                  <p className={`text-lg font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-200' : 'text-gray-300'}`}>
                    TOUCH AUDIO SYSTEMS
                  </p>
                  <p className={`mt-4 max-w-md text-sm font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-300' : 'text-gray-400'}`}>
                    Discover handcrafted pieces designed to bring exceptional sound quality and premium build to every corner of your listening space.
                  </p>
                  <button className={`mt-8 px-8 py-4 font-light tracking-wide border ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50 border-stone-800 hover:bg-stone-700' : 'bg-black text-white border-black hover:bg-gray-800'}`}>
                    Talk With Us →
                  </button>
                </div>
              </div>

              {/* Right Side - Product Variants */}
              <div className="flex flex-col space-y-4">
                {products.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${selectedStyle === 'midcentury' ? 'border-stone-400' : 'border-white'}`}>
                      <img
                        src={getImageUrl(product.product_hero_image || '')}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-200' : 'text-white'}`}>
                        {product.title}
                      </p>
                      <p className={`text-xs font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-400' : 'text-gray-400'}`}>
                        {product.manufacturer?.name}
                      </p>
                    </div>
                  </div>
                ))}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedStyle === 'midcentury' ? 'border-stone-400 text-stone-400' : 'border-white text-white'}`}>
                  <span className="text-xs">▾</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Brand Badge */}
        <div className={`absolute bottom-8 right-8 w-24 h-24 rounded-full flex items-center justify-center ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50' : 'bg-black text-white'}`}>
          <div className="text-center text-xs font-light tracking-wide">
            <div>BRAND.</div>
            <div>EXPLORE.</div>
            <div>OUR.</div>
          </div>
        </div>
      </div>

      {/* Stats Section - Dark Background */}
      <div className={`py-20 ${selectedStyle === 'midcentury' ? 'bg-stone-800' : 'bg-black'}`}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Stats */}
            <div>
              <H2 className={`mb-12 ${selectedStyle === 'midcentury' ? 'text-stone-50 font-light tracking-wide text-4xl' : 'text-white'}`}>
                our stats
              </H2>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className={`text-5xl font-light mb-2 ${selectedStyle === 'midcentury' ? 'text-stone-50' : 'text-white'}`}>500+</div>
                  <div className={`text-sm font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-300' : 'text-gray-400'}`}>Products</div>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-light mb-2 ${selectedStyle === 'midcentury' ? 'text-stone-50' : 'text-white'}`}>25+</div>
                  <div className={`text-sm font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-300' : 'text-gray-400'}`}>Brands</div>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-light mb-2 ${selectedStyle === 'midcentury' ? 'text-stone-50' : 'text-white'}`}>25+</div>
                  <div className={`text-sm font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-300' : 'text-gray-400'}`}>Years</div>
                </div>
              </div>
            </div>

            {/* Right Side - Project Title */}
            <div className="flex flex-col justify-center">
              <H2 className={`mb-8 ${selectedStyle === 'midcentury' ? 'text-stone-50 font-light tracking-wide text-4xl' : 'text-white'}`}>
                featured project
              </H2>
              <button className={`px-8 py-4 font-light tracking-wide border w-fit ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50 border-stone-800 hover:bg-stone-700' : 'bg-black text-white border-black hover:bg-gray-800'}`}>
                View Project →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Showcase Section */}
      <div className={`py-20 ${selectedStyle === 'midcentury' ? 'bg-stone-800' : 'bg-black'}`}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Project List */}
            <div>
              <div className="space-y-6">
                {['01 Living Room System', '02 Home Theater', '03 Studio Setup', '04 Portable Audio'].map((project, index) => (
                  <div key={index} className={`p-4 border ${index === 1 ? (selectedStyle === 'midcentury' ? 'border-stone-400 bg-stone-700' : 'border-white bg-gray-800') : (selectedStyle === 'midcentury' ? 'border-stone-600' : 'border-gray-600')} transition-colors duration-200 cursor-pointer`}>
                    <div className={`text-lg font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-50' : 'text-white'}`}>{project}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Project Images */}
            <div className="space-y-8">
              <div className="relative">
                <img
                  src={getImageUrl(products[1]?.product_hero_image || '')}
                  alt="Project 1"
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50' : 'bg-black text-white'}`}>
                  <span className="text-lg">+</span>
                </div>
              </div>
              <div className="relative">
                <img
                  src={getImageUrl(products[2]?.product_hero_image || '')}
                  alt="Project 2"
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50' : 'bg-black text-white'}`}>
                  <span className="text-lg">+</span>
                </div>
                {/* Product Popup */}
                <div className={`absolute bottom-4 left-4 p-4 ${selectedStyle === 'midcentury' ? 'bg-stone-50 text-stone-800' : 'bg-white text-black'}`}>
                  <p className="text-sm font-light">Premium amplifier</p>
                  <p className="text-xs font-light">AUDIO</p>
                  <a href="#" className="text-xs font-light underline">View details →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className={`py-20 ${selectedStyle === 'midcentury' ? 'bg-stone-800' : 'bg-black'}`}>
        <div className="container-custom">
          <H2 className={`mb-12 ${selectedStyle === 'midcentury' ? 'text-stone-50 font-light tracking-wide text-4xl' : 'text-white'}`}>
            shop by category
          </H2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['Amplifiers', 'Speakers', 'Sources', 'Cables', 'Accessories', 'Pre-owned'].map((category, index) => (
              <div key={category} className={`p-6 border ${index === 2 ? (selectedStyle === 'midcentury' ? 'border-stone-400 bg-stone-700' : 'border-white bg-gray-800') : (selectedStyle === 'midcentury' ? 'border-stone-600 hover:border-stone-400' : 'border-gray-600 hover:border-gray-400')} transition-colors duration-200 cursor-pointer`}>
                <div className={`text-lg font-light tracking-wide ${selectedStyle === 'midcentury' ? 'text-stone-50' : 'text-white'}`}>{category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

             {/* Product Grid Section */}
       <div className={`py-20 ${selectedStyle === 'midcentury' ? 'bg-[#fffcf9]' : 'bg-gray-50'}`}>
        <div className="container-custom">
          <H2 className={`mb-12 ${selectedStyle === 'midcentury' ? 'text-stone-800 font-light tracking-wide text-4xl' : 'text-gray-900'}`}>
            featured products
          </H2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {products.slice(0, 6).map((product) => (
                                               <div key={product.id} className={`${currentStyle.card} relative overflow-hidden`}>
                  {/* Product Image */}
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
                   <div className="px-6 pb-6 pt-8">
                    <h3 className={currentStyle.title}>{product.title}</h3>
                    {product.manufacturer && (
                      <p className={currentStyle.manufacturer}>{product.manufacturer.name}</p>
                    )}
                    {product.price && (
                      <p className={currentStyle.price}>${product.price.toLocaleString()}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {product.categories && (
                          <span className={currentStyle.category}>
                            {product.categories.name}
                          </span>
                        )}
                        {product.featured && (
                          <span className={currentStyle.featured}>
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 font-light">2 Variants</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="flex justify-end mt-12">
            <button className={`px-8 py-4 font-light tracking-wide border ${selectedStyle === 'midcentury' ? 'bg-stone-800 text-stone-50 border-stone-800 hover:bg-stone-700' : 'bg-black text-white border-black hover:bg-gray-800'}`}>
              View All Products →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
