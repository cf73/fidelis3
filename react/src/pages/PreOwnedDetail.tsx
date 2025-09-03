import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { ArrowLeftIcon, TagIcon, TruckIcon, CubeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ProductGallery from '../components/PolaroidStack';
import { getPreOwnedById, getImageUrl, type PreOwned } from '../lib/supabase';

const PreOwnedDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<PreOwned | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const data = await getPreOwnedById(id);
        setItem(data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Item Not Found</h2>
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
      className="min-h-screen bg-warm-white"
    >
      <SEOHead
        title={`Pre-Owned: ${item.title}`}
        description={`${item.title} - ${item.description ? item.description.substring(0, 150) + '...' : 'High-quality pre-owned audio equipment'} Available at Fidelis Audio.`}
        canonical={`/pre-owned/${item.id}`}
        type="product"
        productData={{
          price: item.your_price?.toString(),
          availability: 'InStock',
          category: 'Pre-Owned Audio Equipment'
        }}
        image={item.images?.[0] ? getImageUrl(item.images[0]) : undefined}
      />
      {/* Hero Section */}
      <section className="bg-warm-beige border-b border-stone-200 -mt-4">
        <div className="pt-6 pb-16 lg:pb-24">
          <div className="pl-[88px] pr-6 lg:pr-8 mb-12">
            <Link to="/pre-owned" className="inline-flex items-center text-stone-600 hover:text-stone-900 transition-colors duration-200">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Pre-Owned
            </Link>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Item Info - Above Gallery */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-light text-stone-900 leading-tight tracking-wide mb-6">{item.title}</h1>
            
            {/* Pricing */}
            <div className="mb-6">
              {item.your_price && !item.hide_your_price && (
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-4xl font-light text-stone-900">
                     {formatPrice(item.your_price)}
                   </span>
                   {item.new_retail_price && (
                     <span className="text-xl text-stone-500 line-through">
                       {formatPrice(item.new_retail_price)}
                     </span>
                   )}
                </div>
              )}
              
              {savings && (
                <div className="flex items-center justify-center gap-2 text-lg">
                  <TagIcon className="h-5 w-5 text-stone-600" />
                  <span className="text-stone-600 font-medium">
                   Save {formatPrice(savings.savings)} ({savings.percentage.toFixed(0)}% off)
                 </span>
                </div>
              )}
            </div>
          </div>

          {/* Large Image Gallery */}
          <div className="mb-16">
            {images.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <ProductGallery images={images} itemTitle={item.title} />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto aspect-w-1 aspect-h-1 bg-stone-100 rounded-lg flex items-center justify-center">
                <p className="text-stone-500">No images available</p>
              </div>
            )}
          </div>

          {/* Additional Details - Below Gallery */}
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            {item.description && (
              <div className="mb-8 text-center">
                <div className="prose max-w-none mx-auto">
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
              </div>
            )}

            {/* Details - Centered Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 text-center">
              {item.original_accessories && (
                <div className="flex flex-col items-center gap-2">
                  <CubeIcon className="h-5 w-5 text-stone-500" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Original Accessories</h4>
                    <p className="text-stone-600">{item.original_accessories}</p>
                  </div>
                </div>
              )}
              
              {item.shipping !== null && (
                <div className="flex flex-col items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-stone-500" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Shipping</h4>
                       <p className="text-stone-600">
                         {item.shipping === 0 ? 'Free shipping' : `Shipping: ${formatPrice(item.shipping || 0)}`}
                       </p>
                     </div>
                  </div>
                                )}

              {item.date && (
                <div className="flex flex-col items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-stone-500" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Listed Date</h4>
                    <p className="text-stone-600">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {item.local_only && (
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-8 text-center max-w-md mx-auto">
                <span className="text-stone-600 font-medium">Local pickup only</span>
              </div>
            )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <button className="bg-stone-900 text-white py-4 px-8 font-medium tracking-wide hover:bg-stone-800 transition-all duration-300 text-center flex-1">
                Contact for Details
              </button>
              <button className="bg-white border-2 border-stone-900 text-stone-900 py-4 px-8 font-medium tracking-wide hover:bg-stone-900 hover:text-white transition-all duration-300 text-center flex-1">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-warm-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">
              Pre-Owned Audio at Fidelis
            </h2>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700">
              <p className="mb-6">
                Quality audio gear is built to last. Many of the components we sell pre-owned deliver performance that rivals or exceeds newer equipment at significantly higher prices.
              </p>
              <p className="mb-6">
                We thoroughly test and inspect every item before it goes on our floor. Each piece meets the same standards we apply to new equipment.
              </p>
              <p>
                Pre-owned gear offers serious value for both newcomers and seasoned audiophiles looking to upgrade or complete their systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PreOwnedDetail; 