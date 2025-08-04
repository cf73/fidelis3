import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  getProductsWithCategories, 
  getManufacturers,
  getImageUrl,
  type Product,
  type Manufacturer
} from '../lib/supabase';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, manufacturersData] = await Promise.all([
          getProductsWithCategories(),
          getManufacturers()
        ]);

        setProducts(productsData);
        setManufacturers(manufacturersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories from products
  const categories = Array.from(new Set(
    products.flatMap(product => product.categories?.map(cat => cat.name) || [])
  )).sort();

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      (product.categories && product.categories.some(cat => cat.name === selectedCategory));
    
    const matchesManufacturer = selectedManufacturer === 'all' || 
      (product.manufacturer && product.manufacturer === selectedManufacturer);
    
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesManufacturer && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-4"
          >
            Our Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto"
          >
            Discover our extensive collection of high-end audio equipment from the world's finest manufacturers
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Manufacturer Filter */}
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Manufacturers</option>
                {manufacturers.map(manufacturer => (
                  <option key={manufacturer.id} value={manufacturer.title}>
                    {manufacturer.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <Link to={`/products/${product.slug}`}>
                      <div className="aspect-w-16 aspect-h-9">
                        <img 
                          src={getImageUrl(product.product_hero_image)} 
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
                        {product.manufacturer && (
                          <p className="text-sm text-gray-600 mb-2">{product.manufacturer}</p>
                        )}
                        {product.price && (
                          <p className="text-lg font-bold text-blue-600 mb-2">${product.price.toLocaleString()}</p>
                        )}
                        {/* Removed description to simplify product cards */}
                        {product.categories && product.categories.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {product.categories.slice(0, 2).map(category => (
                              <span 
                                key={category.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedManufacturer('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products; 