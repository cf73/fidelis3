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
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);

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
      } catch (error) {
        console.error('Error fetching data:', error);
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







  console.log('🏠 Home render: loading =', loading, ', heroLoading =', heroLoading);
  
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
        <div className="fixed inset-0 bg-[#fffcf9] z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div 
        className={`transition-opacity duration-500 ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ pointerEvents: isPageLoading ? 'none' : 'auto' }}
      >
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
                <div className="flex items-center">
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
                <div className="flex items-center mb-4">
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
              </div>
            </motion.div>

            {/* Sophisticated news grid layout */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-12 gap-8">
                {news.slice(0, 10).map((article, index) => {
                  let gridClass = '';
                  let contentClass = '';
                  
                  // First article - hero featured
                  if (index === 0) {
                    gridClass = 'col-span-12 lg:col-span-8';
                    contentClass = 'hero-article';
                  }
                  // Second article - secondary featured  
                  else if (index === 1) {
                    gridClass = 'col-span-12 lg:col-span-4';
                    contentClass = 'secondary-article';
                  }
                  // Articles 3-4 - medium cards
                  else if (index <= 3) {
                    gridClass = 'col-span-12 md:col-span-6 lg:col-span-6';
                    contentClass = 'medium-article';
                  }
                  // Articles 5-10 - compact titles only
                  else {
                    gridClass = 'col-span-12 md:col-span-6 lg:col-span-4';
                    contentClass = 'compact-article';
                  }

                  return (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className={`group ${gridClass}`}
                    >
                      <Link to={`/news/${article.slug || article.id}`} className="block h-full">
                        <div className="h-full flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-stone-300">
                          
                          {/* Hero Article (index 0) */}
                          {index === 0 && (
                            <>
                              {article.image && (
                                <div className="aspect-[16/9] overflow-hidden">
                                  <img
                                    src={getImageUrl(article.image)}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <div className="flex-grow p-8">
                                {(article.published_at || article.news_date) && (
                                  <div className="text-xs text-stone-500 mb-3 font-medium tracking-wider uppercase">
                                    {new Date(article.published_at || article.news_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                )}
                                <h3 className="text-2xl font-light text-stone-900 mb-4 leading-tight group-hover:text-stone-700 transition-colors duration-300 tracking-wide">
                                  {article.title}
                                </h3>
                                {(article.summary || article.excerpt) && (
                                  <p className="text-stone-600 leading-relaxed line-clamp-3">
                                    {article.summary || article.excerpt}
                                  </p>
                                )}
                              </div>
                            </>
                          )}

                          {/* Secondary Article (index 1) */}
                          {index === 1 && (
                            <>
                              {article.image && (
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={getImageUrl(article.image)}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <div className="flex-grow p-6">
                                {(article.published_at || article.news_date) && (
                                  <div className="text-xs text-stone-500 mb-3 font-medium tracking-wider uppercase">
                                    {new Date(article.published_at || article.news_date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                )}
                                <h3 className="text-lg font-light text-stone-900 mb-3 leading-tight group-hover:text-stone-700 transition-colors duration-300 tracking-wide line-clamp-2">
                                  {article.title}
                                </h3>
                                {(article.summary || article.excerpt) && (
                                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                                    {article.summary || article.excerpt}
                                  </p>
                                )}
                              </div>
                            </>
                          )}

                          {/* Medium Articles (index 2-3) */}
                          {index >= 2 && index <= 3 && (
                            <>
                              {article.image && (
                                <div className="aspect-[3/2] overflow-hidden">
                                  <img
                                    src={getImageUrl(article.image)}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <div className="flex-grow p-5">
                                {(article.published_at || article.news_date) && (
                                  <div className="text-xs text-stone-500 mb-2 font-medium tracking-wider uppercase">
                                    {new Date(article.published_at || article.news_date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                )}
                                <h3 className="text-base font-light text-stone-900 leading-tight group-hover:text-stone-700 transition-colors duration-300 line-clamp-2 tracking-wide">
                                  {article.title}
                                </h3>
                              </div>
                            </>
                          )}

                          {/* Compact Articles (index 4+) - Title only */}
                          {index >= 4 && (
                            <div className="p-5 border-b border-stone-100 last:border-b-0">
                              {(article.published_at || article.news_date) && (
                                <div className="text-xs text-stone-500 mb-2 font-medium tracking-wider uppercase">
                                  {new Date(article.published_at || article.news_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                              <h3 className="text-sm font-light text-stone-900 leading-tight group-hover:text-stone-700 transition-colors duration-300 line-clamp-2 tracking-wide">
                                {article.title}
                              </h3>
                            </div>
                          )}

                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
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
                    <div className="flex items-center">
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
        <div className="relative bg-warm-white">
          <Container>
            <div className="pt-16 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center">
                    <div className="bg-warm-white pr-6">
                      <span className="text-lg font-light text-stone-700 tracking-widest uppercase">Our Manufacturers</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                </div>
              </motion.div>
          <div className="max-w-6xl mx-auto relative">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(showAllManufacturers ? manufacturers : manufacturers.slice(0, 12)).map((manufacturer, index) => (
                <motion.div
                  key={manufacturer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link to={`/manufacturers/${manufacturer.slug}`} className="block h-full">
                    <ManufacturerCard manufacturer={manufacturer} className="h-full" />
                  </Link>
                </motion.div>
              ))}
            </div>
            {!showAllManufacturers && manufacturers.length > 12 && (
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-warm-white to-transparent pointer-events-none" />
            )}
            {manufacturers.length > 12 && (
              <div className="mt-8 flex justify-center relative z-10">
                <button
                  onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-warm-white text-stone-800 font-medium shadow-sm hover:shadow-md hover:bg-stone-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 border border-stone-200/60 hover:border-stone-300"
                >
                  {showAllManufacturers ? 'Show Less' : 'Show All Manufacturers'}
                  <svg className={`w-4 h-4 ml-2 transition-transform ${showAllManufacturers ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 12z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
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
                    <div className="flex items-center">
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
        <div className="flex">
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
                    <div className="bg-warm-white pr-6">
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
      </div>
      
      </div> {/* End Main Content */}
    </div>
  );
};

export { Home }; 