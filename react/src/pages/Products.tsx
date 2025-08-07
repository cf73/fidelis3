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
import { ProductCard, Section, Grid, Container, Flex, H1, H2, H3, H4, Body, BodySmall, Caption, Button, Card, Price } from '../components/ui';

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
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading products...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Container>
          <Flex justify="between" align="center">
            <div>
              <H1>
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
                  : 'Products'
                }
              </H1>
              <Body className="mt-2 text-stone-600">
                {selectedCategory
                  ? `Browse our ${categories.find(c => c.id === selectedCategory)?.name?.toLowerCase()} collection`
                  : 'Discover our collection of high-quality audio equipment'
                }
              </Body>
              {selectedCategory && (
                <div className="flex items-center space-x-4 mt-2">
                  <Link
                    to="/products/list"
                    className="inline-flex items-center text-stone-600 hover:text-stone-700 text-sm font-medium"
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
          </Flex>
        </Container>
      </Section>

      {/* Filters Section */}
      <Section variant="default" background="white">
        <Container>
          <div className="mb-8 bg-stone-50 rounded-xl border border-stone-200 p-6">
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
        </Container>
      </Section>

      {/* Products Grid Section */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <H3 className="mt-2">No products found</H3>
              <Body className="mt-1 text-stone-500">
                {selectedCategory || selectedManufacturer
                  ? 'Try adjusting your filters to see more products.'
                  : 'No products are available at the moment.'
                }
              </Body>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="block h-full">
                  <ProductCard
                    product={product}
                    showBadges={true}
                    showPrice={true}
                    className="h-full"
                  />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSuccess={handleProductFormSuccess}
      />
    </div>
  );
}; 