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
// Removed ProductForm import as this page no longer mounts it directly
import { ProductCard, Section, Grid, Container, Flex, H1, H2, H3, H4, Body, BodySmall, Caption, Button, Card, Price } from '../components/ui';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>(searchParams.get('manufacturer') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'price-low');
  // Removed isProductFormOpen state since this page no longer opens the form
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [maxVisibleItems, setMaxVisibleItems] = useState(6);
  const { user } = useAuth();

  // Calculate dynamic truncation based on viewport height
  useEffect(() => {
    const calculateMaxItems = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 80; // Approximate header height
      const filterHeaderHeight = 120; // "Filters" title + spacing
      const sortingHeight = 200; // Sorting controls + spacing
      const buttonHeight = 40; // "Show More" button height
      const padding = 100; // Extra padding for breathing room
      
      // Available height for filter lists
      const availableHeight = viewportHeight - headerHeight - filterHeaderHeight - sortingHeight - buttonHeight - padding;
      
      // Each filter item is approximately 40px (32px + 8px spacing)
      const itemHeight = 40;
      const maxItems = Math.max(4, Math.floor(availableHeight / (itemHeight * 2))); // Divide by 2 since we have 2 filter sections
      
      setMaxVisibleItems(Math.min(maxItems, 12)); // Cap at 12 for very large screens
    };

    calculateMaxItems();
    window.addEventListener('resize', calculateMaxItems);
    
    return () => window.removeEventListener('resize', calculateMaxItems);
  }, []);

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
    const sortFromUrl = searchParams.get('sort') || 'price-low';

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
    
    // Reset scroll position to top of products grid when filters change
    if (type === 'manufacturer' || type === 'category' || type === 'sort') {
      setTimeout(() => {
        const productsGrid = document.querySelector('.products-grid');
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
    }
  };

  const handleProductFormSuccess = async () => {
    // No-op for now; retained for potential future use
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
  let filteredProducts = products;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(product => 
      product.categories?.id === selectedCategory
    );
  }

  if (selectedManufacturer) {
    filteredProducts = filteredProducts.filter(product => 
      (typeof product.manufacturer === 'object' && product.manufacturer?.id === selectedManufacturer)
    );
  }

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;

    if (sortBy === 'price-high') return priceB - priceA;
    return priceA - priceB; // default low to high
  });

  // Show loading spinner if data is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <div className="pt-28">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
              <p className="mt-4 text-stone-600">{getRandomMusicalMessage()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <Section variant="default" className="!pt-8 !pb-16">
        <Container>
                     <div className="max-w-4xl mx-auto text-center">
             <H1 className="mb-4">
               {selectedCategory
                 ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
                 : 'Products'
               }
             </H1>
             
             {selectedCategory ? (
               <div className="mb-6">
                 <div className="max-w-3xl mx-auto">
                   <Body className="text-base leading-relaxed text-stone-700">
                     {categories.find(c => c.id === selectedCategory)?.category_description || `Browse our ${categories.find(c => c.id === selectedCategory)?.name?.toLowerCase()} collection`}
                   </Body>
                 </div>
                 
                 <div className="flex items-center justify-center mt-4 space-x-6">
                   <Link
                     to="/products/list"
                     className="inline-flex items-center text-stone-600 hover:text-stone-700 text-sm font-medium transition-colors"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                     View All Products
                   </Link>
                   
                   {user && (
                     <Button
                       onClick={() => navigate('/products/new')}
                       variant="primary"
                       size="sm"
                     >
                       Add Product
                     </Button>
                   )}
                 </div>
               </div>
             ) : (
               <div className="mb-6">
                 <Body className="text-base leading-relaxed text-stone-700 max-w-2xl mx-auto">
                   Discover our collection of high-quality audio equipment
                 </Body>
                 
                 {user && (
                   <div className="mt-4">
                     <Button
                       onClick={() => navigate('/products/new')}
                       variant="primary"
                       size="sm"
                     >
                       Add Product
                     </Button>
                   </div>
                 )}
               </div>
             )}
           </div>
        </Container>
      </Section>

      {/* Main Content with Sidebar */}
      <Section variant="default" background="custom" customBackground="bg-warm-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
                         {/* Sidebar Filters */}
             <div className="lg:w-80 lg:flex-shrink-0 pt-16">
               <div className="lg:sticky lg:top-32">
                 <h3 className="text-lg font-semibold text-stone-900 mb-6">Filters</h3>
                 <div className="space-y-8">
                                     {!selectedCategory && (
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
                              onChange={(e) => handleFilterChange('category', e.target.value)}
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
                        
                        {(() => {
                          // Show dynamic number of categories based on viewport height, or all if expanded
                          const displayedCategories = showAllCategories 
                            ? categories 
                            : categories.slice(0, maxVisibleItems);

                          return (
                            <>
                              <div className={showAllCategories ? "max-h-64 overflow-y-auto pr-2 space-y-2" : "space-y-2"}>
                                {displayedCategories.map(category => (
                                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative">
                                      <input
                                        type="radio"
                                        name="category"
                                        value={category.id}
                                        checked={selectedCategory === category.id}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
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
                              
                              {categories.length > maxVisibleItems && (
                                <button
                                  onClick={() => setShowAllCategories(!showAllCategories)}
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors mt-2"
                                >
                                  {showAllCategories 
                                    ? `Show Less (${categories.length - maxVisibleItems} fewer)` 
                                    : `Show More (${categories.length - maxVisibleItems} more)`
                                  }
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                                       <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Filter by Manufacturer
                      </label>
                                             <div className="space-y-2">
                         <label className="flex items-center space-x-3 cursor-pointer group">
                           <div className="relative">
                             <input
                               type="radio"
                               name="manufacturer"
                               value=""
                               checked={selectedManufacturer === ''}
                               onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                               className="sr-only"
                             />
                             <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                               selectedManufacturer === '' 
                                 ? 'border-primary-600 bg-primary-600' 
                                 : 'border-stone-300 group-hover:border-stone-400'
                             }`}>
                               {selectedManufacturer === '' && (
                                 <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                               )}
                             </div>
                           </div>
                           <span className="text-stone-700 group-hover:text-stone-900 transition-colors">All Manufacturers</span>
                         </label>
                         
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

                           // Show dynamic number of manufacturers based on viewport height, or all if expanded
                           const displayedManufacturers = showAllManufacturers 
                             ? relevantManufacturers 
                             : relevantManufacturers.slice(0, maxVisibleItems);

                           return (
                             <>
                               <div className={showAllManufacturers ? "max-h-64 overflow-y-auto pr-2 space-y-2" : "space-y-2"}>
                                 {displayedManufacturers.map(manufacturer => (
                                   <label key={manufacturer.id} className="flex items-center space-x-3 cursor-pointer group">
                                     <div className="relative">
                                       <input
                                         type="radio"
                                         name="manufacturer"
                                         value={manufacturer.id}
                                         checked={selectedManufacturer === manufacturer.id}
                                         onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                                         className="sr-only"
                                       />
                                       <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                         selectedManufacturer === manufacturer.id 
                                           ? 'border-primary-600 bg-primary-600' 
                                           : 'border-stone-300 group-hover:border-stone-400'
                                       }`}>
                                         {selectedManufacturer === manufacturer.id && (
                                           <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                         )}
                                       </div>
                                     </div>
                                     <span className="text-stone-700 group-hover:text-stone-900 transition-colors">{manufacturer.name}</span>
                                   </label>
                                 ))}
                               </div>
                               
                               {relevantManufacturers.length > maxVisibleItems && (
                                 <button
                                   onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                                   className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors mt-2"
                                 >
                                   {showAllManufacturers 
                                     ? `Show Less (${relevantManufacturers.length - maxVisibleItems} fewer)` 
                                     : `Show More (${relevantManufacturers.length - maxVisibleItems} more)`
                                   }
                                 </button>
                               )}
                             </>
                           );
                         })()}
                       </div>
                    </div>

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
                             onChange={(e) => handleFilterChange('sort', e.target.value)}
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
                             onChange={(e) => handleFilterChange('sort', e.target.value)}
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
                 </div>
               </div>
             </div>

                         {/* Products Grid Section */}
             <div className="flex-1 pt-8 pb-16 products-grid">
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

export { Products };
