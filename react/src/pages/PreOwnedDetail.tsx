import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, TruckIcon, CubeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
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
      {/* Header */}
      <section className="bg-warm-white border-b border-stone-200">
        <div className="container-custom py-6">
          <Link to="/pre-owned" className="inline-flex items-center text-stone-600 hover:text-stone-900">
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
                {/* Swiper Carousel */}
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
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
                  className="preowned-images-swiper"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-w-1 aspect-h-1 bg-stone-100 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(image)}
                          alt={`${item.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button className="custom-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-warm-white/95 hover:bg-warm-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                    
                    <button className="custom-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-warm-white/95 hover:bg-warm-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Custom Pagination */}
                {images.length > 1 && (
                  <div className="custom-swiper-pagination flex justify-center items-center space-x-2 mt-4"></div>
                )}
              </div>
            ) : (
              <div className="aspect-w-1 aspect-h-1 bg-stone-100 rounded-lg flex items-center justify-center">
                <p className="text-stone-500">No images available</p>
              </div>
            )}
          </div>

          {/* Item Info */}
          <div>
            <div className="mb-6">
                             <h1 className="text-4xl font-bold text-stone-900 mb-4">{item.title}</h1>
              
              {/* Pricing */}
              <div className="mb-6">
                {item.your_price && !item.hide_your_price && (
                  <div className="flex items-center gap-4 mb-4">
                                         <span className="text-4xl font-bold text-accent-600">
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
                  <div className="flex items-center gap-2 text-lg">
                    <TagIcon className="h-5 w-5 text-green-600" />
                                       <span className="text-green-600 font-medium">
                     Save {formatPrice(savings.savings)} ({savings.percentage.toFixed(0)}% off)
                   </span>
                  </div>
                )}
              </div>

                             {/* Description */}
               {item.description && (
                 <div className="mb-8">
                   <h3 className="text-lg font-semibold mb-4 text-stone-900">Description</h3>
                                       <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                 </div>
               )}

              {/* Details */}
              <div className="space-y-4">
                {item.original_accessories && (
                  <div className="flex items-start gap-3">
                                         <CubeIcon className="h-5 w-5 text-stone-500 mt-0.5" />
                     <div>
                       <h4 className="font-semibold text-stone-900">Original Accessories</h4>
                       <p className="text-stone-600">{item.original_accessories}</p>
                     </div>
                  </div>
                )}
                
                {item.shipping !== null && (
                  <div className="flex items-start gap-3">
                                         <TruckIcon className="h-5 w-5 text-stone-500 mt-0.5" />
                     <div>
                       <h4 className="font-semibold text-stone-900">Shipping</h4>
                       <p className="text-stone-600">
                         {item.shipping === 0 ? 'Free shipping' : `Shipping: ${formatPrice(item.shipping || 0)}`}
                       </p>
                     </div>
                  </div>
                )}

                {item.date && (
                  <div className="flex items-start gap-3">
                                         <CalendarIcon className="h-5 w-5 text-stone-500 mt-0.5" />
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

                                 {item.local_only && (
                   <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                     <div className="flex items-center gap-2">
                       <span className="text-accent-600 font-medium">Local pickup only</span>
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
             <section className="bg-warm-white py-16">
         <div className="container-custom">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">
               About This Pre-Owned Item
             </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                                 <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                   <TagIcon className="h-6 w-6 text-accent-600" />
                 </div>
                 <h3 className="font-semibold mb-2 text-stone-900">Exceptional Value</h3>
                 <p className="text-stone-600 text-sm">
                   Significant savings on high-end audio equipment that maintains its performance and quality.
                 </p>
               </div>
               <div className="text-center">
                 <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                   <CubeIcon className="h-6 w-6 text-accent-600" />
                 </div>
                 <h3 className="font-semibold mb-2 text-stone-900">Carefully Inspected</h3>
                 <p className="text-stone-600 text-sm">
                   Each item is thoroughly tested and inspected to ensure it meets our quality standards.
                 </p>
               </div>
               <div className="text-center">
                 <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                   <TruckIcon className="h-6 w-6 text-accent-600" />
                 </div>
                 <h3 className="font-semibold mb-2 text-stone-900">Warranty Available</h3>
                 <p className="text-stone-600 text-sm">
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