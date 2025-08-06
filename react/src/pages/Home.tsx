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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const featuredProducts = products.filter(product => product.featured).slice(0, 6);
  const recentNews = news.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold mb-6"
          >
            Fidelis Audio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Experience the finest in high-end audio equipment and exceptional service
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/products" 
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                                     <img 
                     src={product.product_hero_image ? getImageUrl(product.product_hero_image) : ''} 
                     alt={product.title}
                     className="w-full h-48 object-cover"
                   />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                                     <p className="text-gray-600 mb-4 line-clamp-2">
                     {product.brief_description}
                   </p>
                  <Link 
                    to={`/products/${product.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our Manufacturers
          </motion.h2>
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
                                     <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                     {manufacturer.logo ? (
                       <img 
                         src={getImageUrl(manufacturer.logo)} 
                         alt={manufacturer.name}
                         className="w-full h-16 object-contain mb-2"
                       />
                     ) : (
                       <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center mb-2">
                         <span className="text-gray-500 text-sm">{manufacturer.name}</span>
                       </div>
                     )}
                     <p className="text-sm font-medium text-gray-700">{manufacturer.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Latest News
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                                 className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
               >

                 <div className="p-6">
                   <h3 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h3>
                   <p className="text-gray-600 mb-4 line-clamp-3">
                     {article.brief_description}
                   </p>
                   <Link 
                     to={`/news/${article.slug}`}
                     className="text-blue-600 hover:text-blue-800 font-semibold"
                   >
                     Read More →
                   </Link>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to Experience Premium Audio?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Visit our showroom or browse our extensive collection of high-end audio equipment
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-x-4"
          >
            <Link 
              to="/products" 
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
            <Link 
              to="/contact" 
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Home }; 