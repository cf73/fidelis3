import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  getEvergreenCarousel,
  getPreOwned,
  getImageUrl,
  supabase,
  type Product,
  type Manufacturer,
  type News,
  type EvergreenCarousel,
  type PreOwned
} from '../lib/supabase';
import { ProductCard, ManufacturerCard, NewsCard, PreOwnedCard, Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';
import { HeroShowcase } from '../components/HeroShowcase';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [preOwned, setPreOwned] = useState<PreOwned[]>([]);
  const [carousel, setCarousel] = useState<EvergreenCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, manufacturersData, newsData, preOwnedData, carouselData] = await Promise.all([
          getProductsWithCategories(),
          getManufacturers(),
          getNews(),
          getPreOwned(),
          getEvergreenCarousel()
        ]);

        setProducts(productsData);
        setManufacturers(manufacturersData);
        setNews(newsData);
        setPreOwned(preOwnedData);
        setCarousel(carouselData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);







  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9]">
        {/* Match the actual content structure to prevent layout shift */}
        <div className="pt-28">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
              <p className="mt-4 text-stone-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Random selection of featured products (until CMS flag added)
  const featuredProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
  const recentNews = news.slice(0, 2);
  const recentPreOwned = preOwned.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* New Hero Showcase */}
      <HeroShowcase />

      {/* Latest News */}
      <Section variant="default" background="white">
        <Container>
          <div className="flex justify-between items-center mb-12">
            <H2>Latest News</H2>
            <Link to="/news">
              <Button variant="ghost" size="sm">
                View All
                <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
          <Grid cols={2} gap="lg">
            {recentNews.map((article, index) => (
              <div key={article.id}>
                <Link to={`/news/${article.slug || article.id}`} className="block h-full">
                  <NewsCard article={article} />
                </Link>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

            {/* Featured Products */}
      <Section variant="default" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <H2 className="text-center mb-12">Featured Products</H2>
          </motion.div>
          
          {/* Swiper Carousel */}
          <div className="relative">
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
                1280: { slidesPerView: 3 },
              }}
              className="featured-products-swiper"
            >
              {featuredProducts.map((product, index) => (
                <SwiperSlide key={product.id} className="flex">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex w-full"
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
        </Container>
      </Section>

      {/* Manufacturers */}
      <Section variant="default" background="stone-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <H2 className="text-center mb-12">Our Manufacturers</H2>
          </motion.div>
          <div className="relative">
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
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
            )}
            {manufacturers.length > 12 && (
              <div className="mt-8 flex justify-center relative z-10">
                <button
                  onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 transition"
                >
                  {showAllManufacturers ? 'Show Less' : 'Show All Manufacturers'}
                  <svg className={`w-4 h-4 ml-2 transition-transform ${showAllManufacturers ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 12z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* New in Pre-Owned */}
      <Section variant="default" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <H2>New in Pre-Owned</H2>
            <Link to="/pre-owned">
              <Button variant="ghost" size="sm">
                View All
                <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </motion.div>
          <Grid cols={4} gap="lg">
            {recentPreOwned.map((item, index) => (
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
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="default" background="custom" customBackground="bg-stone-900">
        <Container>
          <Flex direction="col" align="center" className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <H2 className="text-white mb-6">Stay Informed</H2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BodyLarge className="text-white mb-8 max-w-2xl">
                Get updates when we receive new shipments from our manufacturers, host listening sessions in our Nashua showroom, or have insights worth sharing.
              </BodyLarge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 w-full px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
              />
              <Button variant="primary" size="lg" className="w-full sm:w-auto whitespace-nowrap">
                Keep Me Posted
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4"
            >
              <p className="text-white/70 text-sm">
                We don't spam. Just the good stuff when it matters.
              </p>
            </motion.div>
          </Flex>
        </Container>
      </Section>
    </div>
  );
};

export { Home }; 