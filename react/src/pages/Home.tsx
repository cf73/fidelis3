import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  getProducts, 
  getManufacturers, 
  getNews, 
  getEvergreenCarousel,
  getImageUrl,
  type Product,
  type Manufacturer,
  type News,
  type EvergreenCarousel
} from '../lib/supabase';
import { ProductCard, Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [carousel, setCarousel] = useState<EvergreenCarousel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, manufacturersData, newsData, carouselData] = await Promise.all([
          getProducts(),
          getManufacturers(),
          getNews(),
          getEvergreenCarousel()
        ]);

        setProducts(productsData);
        setManufacturers(manufacturersData);
        setNews(newsData);
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
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  const featuredProducts = products.filter(product => product.featured).slice(0, 6);
  const recentNews = news.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="custom" customBackground="bg-gradient-to-r from-stone-900 to-stone-700">
        <Container>
          <div className="relative h-screen flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <H1 className="text-white mb-6">Fidelis Audio</H1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <BodyLarge className="text-white mb-8 max-w-2xl mx-auto">
                  Experience the finest in high-end audio equipment and exceptional service
                </BodyLarge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/products">
                  <Button variant="primary" size="lg">
                    Explore Products
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
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
          <Grid cols={3} gap="lg">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/products/${product.slug}`}>
                  <ProductCard
                    product={product}
                    size="md"
                    showBadges={true}
                    showPrice={true}
                  />
                </Link>
              </motion.div>
            ))}
          </Grid>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {manufacturers.slice(0, 12).map((manufacturer, index) => (
              <motion.div
                key={manufacturer.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Link to={`/manufacturers/${manufacturer.slug}`}>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    {manufacturer.logo ? (
                      <img 
                        src={getImageUrl(manufacturer.logo)} 
                        alt={manufacturer.name}
                        className="w-full h-16 object-contain mb-2"
                      />
                    ) : (
                      <div className="w-full h-16 bg-stone-100 rounded flex items-center justify-center mb-2">
                        <span className="text-stone-500 text-sm">{manufacturer.name}</span>
                      </div>
                    )}
                    <p className="text-sm font-medium text-stone-700">{manufacturer.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Latest News */}
      <Section variant="default" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <H2 className="text-center mb-12">Latest News</H2>
          </motion.div>
          <Grid cols={3} gap="lg">
            {recentNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <H3 className="mb-2">{article.title}</H3>
                  <Body className="mb-4 line-clamp-3 text-stone-600">
                    {article.brief_description}
                  </Body>
                  <Link 
                    to={`/news/${article.slug}`}
                    className="text-stone-600 hover:text-stone-800 font-semibold"
                  >
                    Read More →
                  </Link>
                </div>
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
              <H2 className="text-white mb-6">Ready to Experience Premium Audio?</H2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BodyLarge className="text-white mb-8 max-w-2xl">
                Visit our showroom or browse our extensive collection of high-end audio equipment
              </BodyLarge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-x-4"
            >
              <Link to="/products">
                <Button variant="primary" size="lg">
                  Browse Products
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-stone-900">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </Flex>
        </Container>
      </Section>
    </div>
  );
};

export { Home }; 