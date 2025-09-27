import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHeadBasic from '../components/SEOHeadBasic';
import { checkPageSEO, printSEOReport } from '../utils/seoChecker';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { 
  getProductsWithCategories, 
  getManufacturers, 
  getNews, 
  getPreOwned,
  getProductCategories,
  getImageUrl,
  supabase,
  type Product,
  type Manufacturer,
  type News,
  type PreOwned,
  type ProductCategory
} from '../lib/supabase';
import { ProductCard, ManufacturerCard, NewsCard, PreOwnedCard, CategoryCard, Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';
import { HeroShowcase } from '../components/HeroShowcase';
import { Header } from '../components/Header';

interface CategoryWithHero extends ProductCategory {
  heroImage?: string;
  productCount?: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [preOwned, setPreOwned] = useState<PreOwned[]>([]);
  const [categories, setCategories] = useState<CategoryWithHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [categoryImagesLoaded, setCategoryImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, manufacturersData, newsData, preOwnedData, categoriesData] = await Promise.all([
          getProductsWithCategories(),
          getManufacturers(),
          getNews(),
          getPreOwned(),
          getProductCategories()
        ]);

        setProducts(productsData);
        setManufacturers(manufacturersData);
        setNews(newsData);
        setPreOwned(preOwnedData);

        // Enhance categories with hero images and product counts (same logic as ProductCategories page)
        const enhancedCategories = categoriesData.map(category => {
          const categoryProducts = productsData.filter(product => 
            product.categories?.id === category.id
          );
          
          // Use manually selected product's image if available, otherwise get the first product with a hero image
          let heroImage;
          
          if (category.hero_product_id) {
            // Find the manually selected product
            const selectedProduct = productsData.find(product => 
              product.id === category.hero_product_id
            );
            heroImage = selectedProduct?.product_hero_image;
          }
          
          if (!heroImage) {
            // Fallback to first product with a hero image for this category
            const heroProduct = categoryProducts.find(product => 
              product.product_hero_image
            );
            heroImage = heroProduct?.product_hero_image;
          }

          return {
            ...category,
            heroImage,
            productCount: categoryProducts.length
          };
        });

        setCategories(enhancedCategories);

        // Preload category images in background without blocking
        if (enhancedCategories && enhancedCategories.length > 0) {
          console.log('🏠 HOME: Starting non-blocking category image preload for', enhancedCategories.length, 'categories');
          
          // Use requestIdleCallback for optimal performance, fallback to setTimeout
          const schedulePreload = () => {
            const preloadPromises = enhancedCategories.map((category, index) => {
              return new Promise<void>((resolve) => {
                if (category.heroImage) {
                  const img = new Image();
                  img.onload = () => {
                    console.log(`🏠 HOME: Preloaded ${index + 1}/${enhancedCategories.length}:`, category.name);
                    resolve();
                  };
                  img.onerror = () => {
                    console.warn(`🏠 HOME: Failed to preload image for ${category.name}`);
                    resolve(); // Still resolve on error
                  };
                  img.src = getImageUrl(category.heroImage);
                } else {
                  resolve();
                }
              });
            });

            Promise.all(preloadPromises).then(() => {
              console.log('🏠 HOME: All category images preloaded successfully!');
              setCategoryImagesLoaded(true);
            }).catch(() => {
              console.warn('🏠 HOME: Some category images failed to preload');
              setCategoryImagesLoaded(true); // Still mark as done
            });
          };
          
          // Use requestIdleCallback if available, otherwise setTimeout
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(schedulePreload);
          } else {
            setTimeout(schedulePreload, 100);
          }
        } else {
          setCategoryImagesLoaded(true); // No categories to preload
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategoryImagesLoaded(true); // Don't block on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Run SEO check in development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        const seoResult = checkPageSEO(document);
        printSEOReport(seoResult);
      }, 3000); // Wait for dynamic content to load
    }
  }, []);







  console.log('🏠 Home render: loading =', loading, ', heroLoading =', heroLoading, ', categoryImagesLoaded =', categoryImagesLoaded);
  
  // Only block on essential loading (data + hero), let category images preload in background
  const isPageLoading = loading || heroLoading;

  // Random selection of featured products (until CMS flag added)
  const featuredProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
  const recentNews = news.slice(0, 2);
  const recentPreOwned = preOwned.slice(0, 4);

  return (
    <div className="min-h-screen bg-warm-white relative">
      {/* Loading Overlay */}
      {isPageLoading && (
        <div data-loading-overlay className="fixed inset-0 bg-[#fffcf9] z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div 
        className={`transition-opacity duration-700 ease-out ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          pointerEvents: isPageLoading ? 'none' : 'auto',
          // Ensure smooth transition that doesn't interfere with animations
          transitionDelay: isPageLoading ? '0ms' : '100ms'
        }}
      >
        <Header />
      <SEOHeadBasic
        title="Premium High-End Audio Equipment"
        description="New Hampshire's premier destination for high-end audio equipment. Top brands in speakers, amplifiers, turntables, and components."
        canonical="/"
        localBusiness={true}
      />
      
      {/* New Hero Showcase */}
      <HeroShowcase onLoadingChange={setHeroLoading} />

      {/* Product Categories Section */}
      <div className="relative z-20">
        <div className="relative bg-[#f8f6f3]">
          <Container>
            <div className="pt-16 pb-20">
            {/* Category Grid - Constrained container for symmetrical 3x2 layout */}
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12 relative"
              >
                {/* Desktop Layout - Horizontal with line separator */}
                <div className="hidden md:flex items-center">
                  <div className="bg-[#f8f6f3] pr-6">
                    <span className="text-lg font-light text-stone-700 tracking-widest uppercase">What's Next?</span>
                  </div>
                  <div className="flex-grow border-t border-stone-300"></div>
                  <div className="bg-[#f8f6f3] pl-6">
                    <Link to="/products" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                      View All Product Categories
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Mobile Layout - Stacked and centered */}
                <div className="md:hidden flex flex-col items-center space-y-3">
                  <div className="bg-[#f8f6f3] px-4 py-2">
                    <span className="text-lg font-light text-stone-700 tracking-widest uppercase">What's Next?</span>
                  </div>
                  <div className="bg-[#f8f6f3] px-4 py-2">
                    <Link to="/products" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                      View All Product Categories
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  'Turntables',
                  'Integrated Amplifiers', 
                  "DAC's",
                  'Speakers',
                  'Headphones',
                  'Multi Function'
                ].map((categoryName, index) => {
                  // Find the matching category from our fetched data
                  const category = categories.find(cat => 
                    cat.name.toLowerCase().includes(categoryName.toLowerCase().replace("'s", "")) ||
                    categoryName.toLowerCase().includes(cat.name.toLowerCase())
                  );
                  
                  if (!category) return null;
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <Link to={`/products/list?category=${category.id}`} className="block h-full">
                        <CategoryCard category={category} className="h-full" />
                      </Link>
                    </motion.div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
            </div>
          </Container>
        </div>
      </div>

      {/* News */}
      <div className="relative bg-warm-white z-10">
        <Container>
          <div className="pt-16 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="max-w-6xl mx-auto">
                {/* Desktop Layout - Horizontal with line separator */}
                <div className="hidden md:flex items-center mb-4">
                  <div className="bg-warm-white pr-6">
                    <span className="text-lg font-light text-stone-700 tracking-widest uppercase">News & Events</span>
                  </div>
                  <div className="flex-grow border-t border-stone-300"></div>
                  <div className="bg-warm-white pl-6">
                    <Link to="/news" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                      View All
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Mobile Layout - Stacked and centered */}
                <div className="md:hidden flex flex-col items-center space-y-2 mb-4">
                  <div className="bg-warm-white px-4 py-2">
                    <span className="text-lg font-light text-stone-700 tracking-widest uppercase">News & Events</span>
                  </div>
                  <div className="bg-warm-white px-4 py-2">
                    <Link to="/news" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                      View All
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Simple uniform news grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {news.slice(0, 6).map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link to={`/news/${article.slug || article.id}`} className="block h-full group">
                      <div className="h-full flex flex-col bg-warm-beige rounded-xl overflow-hidden transition-colors duration-300 group-hover:bg-[#f4f0ed]">
                        
                        {/* Article Image */}
                        {article.image && (
                          <div className="aspect-[5/4] overflow-hidden relative">
                            <img
                              src={getImageUrl(article.image)}
                              alt={article.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 mix-blend-multiply"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        )}
                        
                        {/* Article Content */}
                        <div className="flex-grow space-y-4 p-6">
                          {/* Date with accent bar */}
                          {(article.published_at || article.news_date) && (
                            <div className="relative pl-4">
                              <div className="text-xs text-stone-500 font-medium tracking-[0.15em] uppercase">
                                {new Date(article.published_at || article.news_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
                            </div>
                          )}
                          
                          {/* Title with refined typography */}
                          <h3 className="text-2xl lg:text-3xl font-light text-stone-900 leading-[1.2] group-hover:text-stone-700 transition-colors duration-300 tracking-[-0.02em] line-clamp-2">
                            {article.title}
                          </h3>
                          
                          {/* Summary with better hierarchy */}
                          {(article.summary || article.excerpt) && (
                            <p className="text-stone-600 text-sm leading-[1.6] line-clamp-3 font-light">
                              {article.summary || article.excerpt}
                            </p>
                          )}
                          
                          {/* Subtle read more indicator */}
                          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-xs text-stone-500 font-medium tracking-wider uppercase">
                              Read More
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Featured Products Section */}
      <div className="relative z-10">
        <div className="relative bg-[#f8f6f3]">
          <Container>
            <div className="pt-16 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="mb-16">
                    {/* Desktop Layout - Horizontal with line separator */}
                    <div className="hidden md:flex items-center">
                      <div className="bg-[#f8f6f3] pr-6">
                        <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Featured Products</span>
                      </div>
                      <div className="flex-grow border-t border-stone-300"></div>
                      <div className="bg-[#f8f6f3] pl-6">
                        <Link to="/products" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                          View All
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Mobile Layout - Stacked and centered */}
                    <div className="md:hidden flex flex-col items-center space-y-2">
                      <div className="bg-[#f8f6f3] px-4 py-2">
                        <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Featured Products</span>
                      </div>
                      <div className="bg-[#f8f6f3] px-4 py-2">
                        <Link to="/products" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                          View All
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
          
          {/* Swiper Carousel */}
          <div className="relative max-w-6xl mx-auto overflow-visible">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.custom-swiper-next',
                prevEl: '.custom-swiper-prev',
              }}
              pagination={{
                clickable: true,
                el: '.custom-swiper-pagination',
                bulletClass: 'custom-swiper-bullet',
                bulletActiveClass: 'custom-swiper-bullet-active',
              }}
              breakpoints={{
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="featured-products-swiper overflow-visible"
            >
              {featuredProducts.map((product, index) => (
                <SwiperSlide key={product.id} className="flex overflow-visible">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex w-full overflow-visible"
                  >
                    <Link to={`/products/${product.slug}`} className="block w-full">
                      <ProductCard product={product} showBadges={true} showPrice={true} className="h-full" />
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="custom-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            <button className="custom-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {/* Custom Pagination */}
            <div className="custom-swiper-pagination flex justify-center items-center space-x-2 mt-6"></div>

          </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Manufacturers Section */}
      <div className="relative z-10">
        <div className="relative bg-warm-white overflow-hidden">
          <Container>
            <div className="pt-16 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="max-w-6xl mx-auto">
                  {/* Desktop Layout - Horizontal with line separator */}
                  <div className="hidden md:flex items-center">
                    <div className="bg-warm-white pr-6">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Our Manufacturers</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                    <div className="bg-warm-white pl-6">
                      <Link to="/manufacturers" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                        View All
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile Layout - Stacked and centered */}
                  <div className="md:hidden flex flex-col items-center space-y-2">
                    <div className="bg-warm-white px-4 py-2">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Our Manufacturers</span>
                    </div>
                    <div className="bg-warm-white px-4 py-2">
                      <Link to="/manufacturers" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                        View All
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Swiper Carousel */}
              <div className="relative max-w-6xl mx-auto overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView={2}
                  navigation={{
                    nextEl: '.manufacturers-swiper-next',
                    prevEl: '.manufacturers-swiper-prev',
                  }}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 5 },
                  }}
                  className="manufacturers-swiper overflow-visible"
                >
                  {manufacturers.map((manufacturer, index) => (
                    <SwiperSlide key={manufacturer.id} className="flex overflow-visible">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="flex w-full overflow-visible"
                      >
                        <Link to={`/manufacturers/${manufacturer.slug}`} className="block w-full">
                          <ManufacturerCard manufacturer={manufacturer} className="h-full" />
                        </Link>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <div className="manufacturers-swiper-prev absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-stone-600 group-hover:text-stone-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="manufacturers-swiper-next absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-stone-600 group-hover:text-stone-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Pre-Owned Section */}
      <div className="relative z-10">
        <div className="relative bg-warm-beige">
          <Container>
            <div className="pt-16 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="mb-6">
                    {/* Desktop Layout - Horizontal with line separator */}
                    <div className="hidden md:flex items-center">
                      <div className="bg-warm-beige pr-6">
                        <span className="text-lg font-light text-stone-700 tracking-widest uppercase">New in Pre-Owned</span>
                      </div>
                      <div className="flex-grow border-t border-stone-300"></div>
                      <div className="bg-warm-beige pl-6">
                        <Link to="/pre-owned" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                          View All
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Mobile Layout - Stacked and centered */}
                    <div className="md:hidden flex flex-col items-center space-y-2">
                      <div className="bg-warm-beige px-4 py-2">
                        <span className="text-lg font-light text-stone-700 tracking-widest uppercase">New in Pre-Owned</span>
                      </div>
                      <div className="bg-warm-beige px-4 py-2">
                        <Link to="/pre-owned" className="inline-flex items-center text-stone-500 hover:text-stone-700 transition-colors duration-300 text-sm font-light tracking-wide">
                          View All
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
          <div className="max-w-6xl mx-auto">
            <Grid cols={3} gap="lg">
            {recentPreOwned.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/pre-owned/${item.slug || item.id}`} className="block h-full">
                  <PreOwnedCard item={item} className="h-full" />
                </Link>
              </motion.div>
            ))}
          </Grid>
          </div>
            </div>
          </Container>
        </div>
      </div>

      {/* About Fidelis & Stay Informed - Combined Section */}
      <div className="relative z-10">
        {/* Desktop Layout - Two Columns */}
        <div className="hidden md:flex">
          {/* Left Column with Warm White Background */}
          <div className="w-1/2 bg-warm-white" style={{ paddingLeft: '88px' }}>
            <div className="py-20 pr-16 lg:pr-20 pl-12 lg:pl-16">
              {/* About Fidelis Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center">
                    <div className="bg-warm-white pr-6">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">About Fidelis</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-stone-700 leading-relaxed text-left"
                >
                  <p className="mb-6">
                    As America's premiere importer of high-end audio gear, we source and import the world's finest equipment directly from manufacturers. What you'll find here comes from decades of relationships with the most respected names in audio, sold through our New Hampshire store and distributed nationwide through our dealer network.
                  </p>
                  <p className="mb-6">
                    In a world of warehouses and return policies that don't support manufacturers, we believe in curation, guidance, and real service. Every recommendation comes from hands-on experience with the gear, not algorithms or sales targets. We're here to help you navigate choices that matter, backed by expertise you can trust.
                  </p>
                  <p>
                    We host listening events, maintain one of New England's finest record collections, and believe the best audio discoveries happen through conversation. Come by the store, bring your favorite music, and experience the difference that genuine expertise and passion make.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column with Warm White + Pinstripe */}
          <div 
            className="w-1/2 bg-warm-white relative" 
            style={{ paddingRight: '88px' }}
          >
            {/* Vertical Pinstripe Pattern */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 1px, #f4f0ed 1px, #f4f0ed 2px, transparent 2px, transparent 4px)',
                mixBlendMode: 'multiply'
              }}
            ></div>
            <div className="relative z-10 py-20 pl-16 lg:pl-20 pr-12 lg:pr-16">
              {/* Stay Informed CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col justify-center h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center">
                    <div className="pr-6">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Stay Informed</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-stone-700 leading-relaxed mb-8">
                    Get updates when we receive new shipments from our manufacturers, host listening sessions in our Nashua showroom, or have insights worth sharing.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="newsletter-email" className="text-stone-900 text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email"
                      aria-describedby="newsletter-privacy"
                      className="w-full px-6 py-4 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300"
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full py-4 text-lg font-medium bg-stone-900 hover:bg-stone-800 text-white"
                    aria-describedby="newsletter-privacy"
                  >
                    Keep Me Posted
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-4"
                >
                  <p id="newsletter-privacy" className="text-stone-600 text-sm">
                    We don't spam. Just the good stuff when it matters.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked Vertically */}
        <div className="md:hidden bg-warm-white">
          {/* About Fidelis Section */}
          <div className="px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="flex items-center">
                  <div className="bg-warm-white pr-6">
                    <span className="text-lg font-light text-stone-700 tracking-widest uppercase">About Fidelis</span>
                  </div>
                  <div className="flex-grow border-t border-stone-300"></div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-stone-700 leading-relaxed text-left"
              >
                <p className="mb-4">
                  As America's premiere importer of high-end audio gear, we source and import the world's finest equipment directly from manufacturers. What you'll find here comes from decades of relationships with the most respected names in audio, sold through our New Hampshire store and distributed nationwide through our dealer network.
                </p>
                <p className="mb-4">
                  In a world of warehouses and return policies that don't support manufacturers, we believe in curation, guidance, and real service. Every recommendation comes from hands-on experience with the gear, not algorithms or sales targets. We're here to help you navigate choices that matter, backed by expertise you can trust.
                </p>
                <p>
                  We host listening events, maintain one of New England's finest record collections, and believe the best audio discoveries happen through conversation. Come by the store, bring your favorite music, and experience the difference that genuine expertise and passion make.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Stay Informed Section */}
          <div className="px-6 py-12 bg-warm-white relative">
            {/* Vertical Pinstripe Pattern */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 1px, #f4f0ed 1px, #f4f0ed 2px, transparent 2px, transparent 4px)',
              mixBlendMode: 'multiply'
              }}
            ></div>
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="flex items-center">
                    <div className="pr-6">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Stay Informed</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-stone-700 leading-relaxed mb-6">
                    Get updates when we receive new shipments from our manufacturers, host listening sessions in our Nashua showroom, or have insights worth sharing.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="newsletter-email-mobile" className="text-stone-900 text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="newsletter-email-mobile"
                      type="email"
                      placeholder="Enter your email"
                      aria-describedby="newsletter-privacy-mobile"
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300"
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full py-3 text-base font-medium bg-stone-900 hover:bg-stone-800 text-white"
                    aria-describedby="newsletter-privacy-mobile"
                  >
                    Keep Me Posted
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-4"
                >
                  <p id="newsletter-privacy-mobile" className="text-stone-600 text-sm">
                    We don't spam. Just the good stuff when it matters.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      </div> {/* End Main Content */}
    </div>
  );
};

export { Home }; 