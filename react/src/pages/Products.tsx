/**
 * @preserve-visual-language
 * DO NOT MODIFY: Styling, layout, or visual presentation
 * Only modify: Functionality, data handling, or performance
 * 
 * Visual Language:
 * - Colors: Primary blue, accent gold, neutral grays
 * - Typography: Inter font, established scale
 * - Spacing: 4px base unit system
 * - Layout: Responsive grid, consistent padding
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductsWithCategories, getProductCategories, getManufacturers, getImageUrl } from '../lib/supabase';
import { Product, ProductCategory, Manufacturer } from '../lib/supabase';
import { ProductForm } from '../components/ProductForm';
import { Card, H4, BodySmall, Price, Caption, Button } from '../components/ui';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>(searchParams.get('manufacturer') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const { user } = useAuth();

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, manufacturersData] = await Promise.all([
          getProductsWithCategories(),
          getProductCategories(),
          getManufacturers(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setManufacturers(manufacturersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Watch for URL parameter changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const manufacturerFromUrl = searchParams.get('manufacturer') || '';
    const sortFromUrl = searchParams.get('sort') || 'newest';

    setSelectedCategory(categoryFromUrl);
    setSelectedManufacturer(manufacturerFromUrl);
    setSortBy(sortFromUrl);
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (type: 'category' | 'manufacturer' | 'sort', value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (type === 'category') {
      if (value) {
        newSearchParams.set('category', value);
      } else {
        newSearchParams.delete('category');
      }
      setSelectedCategory(value);
    } else if (type === 'manufacturer') {
      if (value) {
        newSearchParams.set('manufacturer', value);
      } else {
        newSearchParams.delete('manufacturer');
      }
      setSelectedManufacturer(value);
    } else if (type === 'sort') {
      newSearchParams.set('sort', value);
      setSortBy(value);
    }
    
    setSearchParams(newSearchParams);
  };

  const handleProductFormSuccess = async () => {
    setIsProductFormOpen(false);
    // Reload products after adding a new one
    try {
      const [productsData, categoriesData, manufacturersData] = await Promise.all([
        getProductsWithCategories(),
        getProductCategories(),
        getManufacturers(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setManufacturers(manufacturersData);
    } catch (error) {
      console.error('Error reloading data:', error);
    }
  };

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || product.categories?.id === selectedCategory;
    const manufacturerMatch = !selectedManufacturer || product.manufacturer?.id === selectedManufacturer;
    return categoryMatch && manufacturerMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
                  : 'Products'
                }
              </h1>
              <p className="mt-2 text-gray-600">
                {selectedCategory
                  ? `Browse our ${categories.find(c => c.id === selectedCategory)?.name?.toLowerCase()} collection`
                  : 'Discover our collection of high-quality audio equipment'
                }
              </p>
              {selectedCategory && (
                <div className="flex items-center space-x-4 mt-2">
                  <Link
                    to="/products/list"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    View All Products
                  </Link>
                </div>
              )}
            </div>
            {user && (
              <Button
                onClick={() => setIsProductFormOpen(true)}
                variant="primary"
              >
                Add Product
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className={`grid gap-4 ${selectedCategory ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {!selectedCategory && (
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="manufacturer-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Manufacturer
              </label>
                              <select
                  id="manufacturer-filter"
                  value={selectedManufacturer}
                  onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                <option value="">All Manufacturers</option>
                {(() => {
                  // Filter manufacturers to only show those with products in the current category
                  const relevantManufacturers = selectedCategory
                    ? manufacturers.filter(manufacturer =>
                        products.some(product =>
                          product.manufacturer?.id === manufacturer.id &&
                          product.categories?.id === selectedCategory
                        )
                      )
                    : manufacturers;

                  return relevantManufacturers.map(manufacturer => (
                    <option key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </option>
                  ));
                })()}
              </select>
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory || selectedManufacturer
                ? 'Try adjusting your filters to see more products.'
                : 'No products are available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} hover className="overflow-hidden">
                <Link to={`/products/${product.slug}`} className="block">
                  {/* Product Image */}
                  <div className="aspect-w-16 aspect-h-9 w-full">
                    {product.product_hero_image ? (
                      <img
                        src={getImageUrl(product.product_hero_image)}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Content */}
                  <div className="p-4">
                    {/* Title */}
                    <H4 className="mb-2 truncate">{product.title}</H4>
                    
                    {/* Description */}
                    {product.brief_description && (
                      <BodySmall className="mb-3 line-clamp-2">{product.brief_description}</BodySmall>
                    )}
                    
                    {/* Manufacturer */}
                    {product.manufacturer && (
                      <Caption className="text-gray-500 mb-2">{product.manufacturer.name}</Caption>
                    )}
                    
                    {/* Price */}
                    {product.price && (
                      <Price className="mt-2">${product.price.toLocaleString()}</Price>
                    )}
                    
                    {/* Badges */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        {product.categories && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {product.categories.name}
                          </span>
                        )}
                        {product.manufacturer && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.manufacturer.name}
                          </span>
                        )}
                      </div>
                      {product.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        <ProductForm
          isOpen={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          onSuccess={handleProductFormSuccess}
        />
      </div>
    </div>
  );
}; 