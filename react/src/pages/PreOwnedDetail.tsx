import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, TagIcon, TruckIcon, CubeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { statamicApi, StatamicPreOwned } from '../lib/statamic';

const PreOwnedDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<StatamicPreOwned | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const data = await statamicApi.getPreOwned();
        const foundItem = data.find(item => item.id === id);
        setItem(foundItem || null);
      } catch (error) {
        console.error('Error fetching pre-owned item:', error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

  const parseImages = (imagesArray: any[]): any[] => {
    if (!imagesArray || !Array.isArray(imagesArray)) return [];
    return imagesArray;
  };

  const nextImage = () => {
    if (!item) return;
    const images = parseImages(item.images || []);
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
  };

  const prevImage = () => {
    if (!item) return;
    const images = parseImages(item.images || []);
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Item Not Found</h2>
          <Link to="/pre-owned" className="btn-primary">
            Back to Pre-Owned
          </Link>
        </div>
      </div>
    );
  }

  const images = parseImages(item.images || []);
  const savings = item.your_price && item.new_retail_price 
    ? calculateSavings(item.your_price, item.new_retail_price)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <Link to="/pre-owned" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pre-Owned
          </Link>
        </div>
      </section>

      {/* Item Details */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            {images.length > 0 ? (
              <div className="relative">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={statamicApi.getImageUrl(images[currentImageIndex])}
                    alt={`${item.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg"
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </button>
                  </>
                )}
                
                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-accent-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No images available</p>
              </div>
            )}
          </div>

          {/* Item Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h1>
              
              {/* Pricing */}
              <div className="mb-6">
                {item.your_price && !item.hide_your_price && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-accent-600 dark:text-accent-400">
                      {formatPrice(item.your_price)}
                    </span>
                    {item.new_retail_price && (
                      <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(item.new_retail_price)}
                      </span>
                    )}
                  </div>
                )}
                
                {savings && (
                  <div className="flex items-center gap-2 text-lg">
                    <TagIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Save {formatPrice(savings.savings)} ({savings.percentage.toFixed(0)}% off)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Description</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                {item.original_accessories && (
                  <div className="flex items-start gap-3">
                    <CubeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Original Accessories</h4>
                      <p className="text-gray-600 dark:text-gray-300">{item.original_accessories}</p>
                    </div>
                  </div>
                )}
                
                {item.shipping !== null && (
                  <div className="flex items-start gap-3">
                    <TruckIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Shipping</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.shipping === 0 ? 'Free shipping' : `Shipping: ${formatPrice(item.shipping || 0)}`}
                      </p>
                    </div>
                  </div>
                )}

                {item.date && (
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Listed Date</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {item.local_only && (
                  <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-700 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-600 dark:text-accent-400 font-medium">Local pickup only</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex-1">
                Contact for Details
              </button>
              <button className="btn-secondary flex-1">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              About This Pre-Owned Item
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TagIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Exceptional Value</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Significant savings on high-end audio equipment that maintains its performance and quality.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CubeIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Carefully Inspected</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Each item is thoroughly tested and inspected to ensure it meets our quality standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Warranty Available</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
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

export default PreOwnedDetail; 