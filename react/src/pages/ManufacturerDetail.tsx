import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getManufacturerBySlug, getProductsWithCategories, getProductCategories } from '../lib/supabase';
import { Manufacturer, Product, ProductCategory } from '../lib/supabase';
import { ProductCard, Section, Container, H1, H2, H3, Body, Button } from '../components/ui';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';

export const ManufacturerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Scroll to products grid function
  const scrollToProducts = () => {
    setTimeout(() => {
      const productsGrid = document.querySelector('.products-grid') || 
                          document.querySelector('[class*="grid grid-cols"]');
      if (productsGrid) {
        const navHeight = 80; // Approximate navigation height
        const elementTop = productsGrid.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - navHeight - 20; // Extra 20px for breathing room
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure state updates have processed
  };

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
            <p className="mt-4 text-stone-600">{getRandomMusicalMessage()}</p>
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

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              {/* Logo first on mobile, centered */}
              {manufacturer.logo && (
                <div className="flex justify-center lg:order-2 lg:flex-shrink-0 lg:ml-8">
                  <img
                    src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${manufacturer.logo}`}
                    alt={`${manufacturer.name} logo`}
                    className="h-20 lg:h-16 w-auto"
                  />
                  </div>
              )}
              
              {/* Content second on mobile, takes full width */}
              <div className="flex-1 lg:order-1">
                <H1 className="text-center lg:text-left">{manufacturer.name}</H1>
                {manufacturer.description && (
                  <div className="mt-2 max-w-4xl">
                                        <div className="relative">
                      <div 
                        className={`prose prose-stone max-w-none transition-all duration-300 ${
                          isDescriptionExpanded ? '' : 'max-h-[6.5rem] overflow-hidden'
                        }`}
                        dangerouslySetInnerHTML={{ __html: manufacturer.description }}
                      ></div>
                      {!isDescriptionExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-warm-white to-transparent pointer-events-none"></div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200 font-medium flex items-center space-x-1 mx-auto lg:mx-0"
                    >
                      <span>{isDescriptionExpanded ? 'Show Less' : 'Read More'}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {manufacturer.website && (
                  <div className="flex justify-center lg:justify-start">
                  <Link
                    to={manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 text-stone-600 hover:text-stone-700 transition-colors"
                  >
                    Visit Website
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>


          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-80 lg:flex-shrink-0 pt-16">
              <div className="lg:sticky lg:top-32">
                <h3 className="text-lg font-semibold text-stone-900 mb-6">Filters</h3>
                <div className="space-y-8">
                  {categories.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Filter by Category
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="radio"
                              name="category"
                              value=""
                              checked={selectedCategory === ''}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              selectedCategory === '' 
                                ? 'border-primary-600 bg-primary-600' 
                                : 'border-stone-300 group-hover:border-stone-400'
                            }`}>
                              {selectedCategory === '' && (
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              )}
                            </div>
                          </div>
                          <span className="text-stone-700 group-hover:text-stone-900 transition-colors">All Categories</span>
                        </label>
                        
                        {categories.map(category => (
                          <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="radio"
                                name="category"
                                value={category.id}
                                checked={selectedCategory === category.id}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                selectedCategory === category.id 
                                  ? 'border-primary-600 bg-primary-600' 
                                  : 'border-stone-300 group-hover:border-stone-400'
                              }`}>
                                {selectedCategory === category.id && (
                                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                )}
                              </div>
                            </div>
                            <span className="text-stone-700 group-hover:text-stone-900 transition-colors">{category.name}</span>
                          </label>
                        ))}
                      </div>
                  </div>
                )}
                
                  {sortedProducts.some(product => product.price) && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Sort by
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="radio"
                              name="sort"
                              value="price-low"
                              checked={sortBy === 'price-low'}
                              onChange={(e) => {
                                setSortBy(e.target.value);
                                scrollToProducts();
                              }}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              sortBy === 'price-low' 
                                ? 'border-primary-600 bg-primary-600' 
                                : 'border-stone-300 group-hover:border-stone-400'
                            }`}>
                              {sortBy === 'price-low' && (
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              )}
                            </div>
                          </div>
                          <span className="text-stone-700 group-hover:text-stone-900 transition-colors">Price Low to High</span>
                    </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="radio"
                              name="sort"
                              value="price-high"
                              checked={sortBy === 'price-high'}
                              onChange={(e) => {
                                setSortBy(e.target.value);
                                scrollToProducts();
                              }}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              sortBy === 'price-high' 
                                ? 'border-primary-600 bg-primary-600' 
                                : 'border-stone-300 group-hover:border-stone-400'
                            }`}>
                              {sortBy === 'price-high' && (
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              )}
                            </div>
                          </div>
                          <span className="text-stone-700 group-hover:text-stone-900 transition-colors">Price High to Low</span>
                        </label>
                      </div>
                  </div>
                )}
                </div>
            </div>
          </div>

            {/* Products Grid Section */}
            <div className="flex-1 pt-8 pb-16">
          {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="block h-full">
                  <ProductCard
                    product={product}
                    showBadges={true}
                    showPrice={true}
                        showCategory={!selectedCategory}
                    className="h-full"
                  />
                </Link>
              ))}
            </div>
          )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}; 