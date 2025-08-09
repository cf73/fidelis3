import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getManufacturerBySlug, getProductsWithCategories, getProductCategories } from '../lib/supabase';
import { Manufacturer, Product, ProductCategory } from '../lib/supabase';
import { ProductCard, Section, Container, H1, H2, H3, Body, Button } from '../components/ui';

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
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading manufacturer...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <Container>
          <div className="text-center">
            <H1 className="mb-4">Manufacturer Not Found</H1>
            <Body className="mb-6 text-stone-600">The manufacturer you're looking for doesn't exist.</Body>
            <Link to="/manufacturers">
              <Button variant="primary">Back to Manufacturers</Button>
            </Link>
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
          <div className="mb-4">
            <nav className="flex mb-3" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link
                    to="/manufacturers"
                    className="text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Manufacturers
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-stone-900 ml-2">{manufacturer.name}</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <H1>{manufacturer.name}</H1>
                {manufacturer.description && (
                  <div className="mt-2 max-w-4xl">
                    <div 
                      className="text-stone-600 text-base font-light tracking-wide line-clamp-3" 
                      dangerouslySetInnerHTML={{ __html: manufacturer.description }}
                    ></div>
                  </div>
                )}
                {manufacturer.website && (
                  <Link
                    to={manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-stone-600 hover:text-stone-700 transition-colors"
                  >
                    Visit Website
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}
              </div>
              
              {manufacturer.logo && (
                <div className="flex-shrink-0 ml-8">
                  <img
                    src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${manufacturer.logo}`}
                    alt={`${manufacturer.name} logo`}
                    className="h-16 w-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          <div className="mb-4 bg-white rounded-xl border border-stone-200 p-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <H2 className="text-stone-900">
                Products by {manufacturer.name} ({sortedProducts.length})
                {selectedCategory && (
                  <span className="text-lg font-normal text-stone-600 ml-2">
                    - {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
              </H2>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Price Sort - Only show if products have prices */}
                {sortedProducts.some(product => product.price) && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor="price-sort" className="text-sm font-medium text-stone-700">
                      Sort by Price:
                    </label>
                    <select
                      id="price-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 text-sm"
                    >
                      <option value="">No Sort</option>
                      <option value="price-low">Low to High</option>
                      <option value="price-high">High to Low</option>
                    </select>
                    {sortBy && (
                      <button
                        onClick={() => setSortBy('')}
                        className="text-sm text-stone-600 hover:text-stone-700 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
                
                {/* Category Filter - Only show if manufacturer has multiple categories */}
                {categories.length > 1 && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="category-filter" className="text-sm font-medium text-stone-700">
                      Filter by Category:
                    </label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 text-sm"
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
                        className="text-sm text-stone-600 hover:text-stone-700 transition-colors"
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
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <H3 className="mt-2">No products found</H3>
              <Body className="mt-1 text-stone-500">
                {selectedCategory 
                  ? 'No products found in the selected category.'
                  : 'No products are available from this manufacturer at the moment.'
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
    </div>
  );
}; 