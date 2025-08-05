import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getManufacturerBySlug, getProductsWithCategories, getProductCategories } from '../lib/supabase';
import { Manufacturer, Product, ProductCategory } from '../lib/supabase';
import { parseStatamicContent } from '../lib/utils';

export const ManufacturerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadManufacturerData = async () => {
      if (!slug) return;
      
      try {
        const manufacturerData = await getManufacturerBySlug(slug);
        if (manufacturerData) {
          setManufacturer(manufacturerData);
          
          // Get all products by this manufacturer
          const allProducts = await getProductsWithCategories();
          const manufacturerProducts = allProducts.filter(product => 
            product.manufacturer?.id === manufacturerData.id
          );
          setProducts(manufacturerProducts);

          // Get unique categories for this manufacturer's products
          const uniqueCategories = manufacturerProducts
            .map(product => product.categories)
            .filter((category, index, self) => 
              category && self.findIndex(c => c?.id === category.id) === index
            )
            .filter(Boolean) as ProductCategory[];

          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error loading manufacturer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadManufacturerData();
  }, [slug]);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.categories?.id === selectedCategory)
    : products;

  // Sort products by price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!a.price && !b.price) return 0;
    if (!a.price) return 1;
    if (!b.price) return -1;
    
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading manufacturer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manufacturer Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The manufacturer you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/manufacturers')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Manufacturers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/manufacturers')}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Manufacturers
                </button>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 dark:text-white">{manufacturer.name}</span>
              </li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{manufacturer.name}</h1>
              {manufacturer.description && (
                <div className="mt-2 text-gray-600 dark:text-gray-300 max-w-4xl">
                  <p>{parseStatamicContent(manufacturer.description)}</p>
                </div>
              )}
              {manufacturer.website && (
                <a
                  href={manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <span>Visit Website</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            
            {manufacturer.logo && (
              <div className="flex-shrink-0">
                <img
                  src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${manufacturer.logo}`}
                  alt={`${manufacturer.name} logo`}
                  className="h-16 w-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Products by {manufacturer.name} ({sortedProducts.length})
                {selectedCategory && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    - {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
              </h2>
              
              <div className="flex items-center space-x-4">
                {/* Price Sort - Only show if products have prices */}
                {sortedProducts.some(product => product.price) && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor="price-sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sort by Price:
                    </label>
                    <select
                      id="price-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">No Sort</option>
                      <option value="price-low">Low to High</option>
                      <option value="price-high">High to Low</option>
                    </select>
                    {sortBy && (
                      <button
                        onClick={() => setSortBy('')}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
                
                {/* Category Filter - Only show if manufacturer has multiple categories */}
                {categories.length > 1 && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filter by Category:
                    </label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedCategory 
                  ? 'No products found in the selected category.'
                  : 'No products are available from this manufacturer at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
                  <Link to={`/products/${product.slug}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {product.product_hero_image ? (
                        <img
                          src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${product.product_hero_image}`}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.title}</h3>
                      {product.brief_description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{product.brief_description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.categories && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {product.categories.name}
                            </span>
                          )}
                        </div>
                        {product.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                            Featured
                          </span>
                        )}
                      </div>
                      {product.price && (
                        <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                          ${product.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 