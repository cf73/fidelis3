import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, TagIcon, TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import { statamicApi, StatamicPreOwned } from '../lib/statamic';

const PreOwned: React.FC = () => {
  const [preOwnedItems, setPreOwnedItems] = useState<StatamicPreOwned[]>([]);
  const [filteredItems, setFilteredItems] = useState<StatamicPreOwned[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await statamicApi.getPreOwned();
        setPreOwnedItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error loading pre-owned data:', error);
        setPreOwnedItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = preOwnedItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(item =>
      (!item.your_price || (item.your_price >= priceRange[0] && item.your_price <= priceRange[1]))
    );

    // Local only filter
    if (showLocalOnly) {
      filtered = filtered.filter(item => item.local_only);
    }

    setFilteredItems(filtered);
  }, [preOwnedItems, searchTerm, priceRange, showLocalOnly]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (yourPrice: number, retailPrice: number) => {
    const savings = retailPrice - yourPrice;
    const percentage = (savings / retailPrice) * 100;
    return { savings, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pre-Owned Equipment</h1>
          <p className="text-lg text-gray-600">
            Discover exceptional value on carefully selected pre-owned audio equipment. 
            Each item has been thoroughly inspected and tested to ensure quality performance.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pre-owned equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            {/* Local Only Filter */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLocalOnly}
                onChange={(e) => setShowLocalOnly(e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm text-gray-700">Local pickup only</span>
            </label>
          </div>
        </div>
      </section>

      {/* Pre-Owned Items Grid */}
      <section className="container-custom py-12">
        {filteredItems.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {filteredItems.length} of {preOwnedItems.length} pre-owned items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const savings = item.your_price && item.new_retail_price 
                  ? calculateSavings(item.your_price, item.new_retail_price)
                  : null;

                return (
                                     <Link
                     to={`/pre-owned/${item.id}`}
                     className="block"
                   >
                     <motion.div
                       key={item.id}
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       whileHover={{ y: -5 }}
                       className="card overflow-hidden"
                     >
                       {/* Image */}
                       {item.images && item.images.length > 0 && (
                         <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                           <img
                             src={statamicApi.getImageUrl(item.images[0])}
                             alt={item.images[0].alt || item.title}
                             className="w-full h-48 object-cover"
                           />
                         </div>
                       )}
                       <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        
                        {/* Pricing */}
                        <div className="mb-4">
                          {item.your_price && !item.hide_your_price && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold text-accent-600">
                                {formatPrice(item.your_price)}
                              </span>
                              {item.new_retail_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.new_retail_price)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {savings && (
                            <div className="flex items-center gap-2 text-sm">
                              <TagIcon className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                Save {formatPrice(savings.savings)} ({savings.percentage.toFixed(0)}% off)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {item.description && (
                          <div className="mb-4">
                            <div 
                              className="text-sm text-gray-600 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                                                     {item.original_accessories && (
                             <div className="flex items-center gap-2">
                               <CubeIcon className="h-4 w-4" />
                               <span>{item.original_accessories}</span>
                             </div>
                           )}
                          
                          {item.shipping !== null && (
                            <div className="flex items-center gap-2">
                              <TruckIcon className="h-4 w-4" />
                                                             <span>
                                 {item.shipping === 0 ? 'Free shipping' : `Shipping: ${formatPrice(item.shipping || 0)}`}
                               </span>
                            </div>
                          )}

                          {item.local_only && (
                            <div className="flex items-center gap-2 text-accent-600">
                              <span className="text-xs font-medium bg-accent-100 px-2 py-1 rounded">
                                Local pickup only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-accent-600 font-medium">View Details →</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No pre-owned items found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Pre-Owned?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TagIcon className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="font-semibold mb-2">Exceptional Value</h3>
                <p className="text-gray-600 text-sm">
                  Significant savings on high-end audio equipment that maintains its performance and quality.
                </p>
              </div>
              <div className="text-center">
                                 <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                   <CubeIcon className="h-6 w-6 text-accent-600" />
                 </div>
                <h3 className="font-semibold mb-2">Carefully Inspected</h3>
                <p className="text-gray-600 text-sm">
                  Each item is thoroughly tested and inspected to ensure it meets our quality standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Available</h3>
                <p className="text-gray-600 text-sm">
                  Many pre-owned items come with warranty coverage for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PreOwned; 