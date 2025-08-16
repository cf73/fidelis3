import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getPreOwnedById, getImageUrl, type PreOwned } from '../lib/supabase';
import { Section, Container, H1, H2, H3, Body, Button } from '../components/ui';

// CSS for polaroid card hover effects
const polaroidStyles = `
  .polaroid-detail-card {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .polaroid-detail-card:hover {
    transform: rotate(var(--hover-rotation)) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = polaroidStyles;
  if (!document.head.querySelector('[data-polaroid-detail-styles]')) {
    styleElement.setAttribute('data-polaroid-detail-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const PreOwnedDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const formatListingDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Listed today';
    if (diffInDays === 1) return 'Listed yesterday';
    if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
    if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const parseImages = (imagesArray: any[]): any[] => {
    if (!imagesArray || !Array.isArray(imagesArray)) return [];
    return imagesArray;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <Body className="mt-4 text-stone-600">Loading...</Body>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf9]">
        <div className="text-center">
          <H2 className="text-stone-900 mb-4">Item Not Found</H2>
          <Link to="/pre-owned">
            <Button variant="primary">Back to Pre-Owned</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = parseImages(item.images || []);
  const savings = item.your_price && item.new_retail_price 
    ? calculateSavings(item.your_price, item.new_retail_price)
    : null;

  // Generate a consistent subtle random rotation for the card based on item ID
  const getCardRotation = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rotation = ((hash % 200) - 100) / 100; // Range: -1 to 1
    return rotation;
  };

  const cardRotation = getCardRotation(item.id);
  const hoverRotation = cardRotation + (cardRotation > 0 ? 0.8 : -0.8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#fffcf9]"
    >
      {/* Header Navigation */}
      <Section variant="compact" background="white">
        <Container>
          <Link to="/pre-owned" className="inline-flex items-center text-stone-600 hover:text-stone-900 transition-colors duration-200">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pre-Owned
          </Link>
        </Container>
      </Section>

      {/* Hero Section */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container className="xl:max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Image Carousel */}
            <div 
              className="polaroid-detail-card bg-white rounded-3xl p-6 shadow-md h-fit transition-transform duration-300 ease-out"
              style={{ 
                '--base-rotation': `${cardRotation}deg`,
                '--hover-rotation': `${hoverRotation}deg`,
                transform: `rotate(${cardRotation}deg)`
              } as React.CSSProperties & { '--base-rotation': string; '--hover-rotation': string }}
            >
              {images.length > 0 ? (
                <div className="relative">
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
                        <div className="relative aspect-[4/3] bg-stone-50 rounded-2xl overflow-hidden">
                          <img
                            src={getImageUrl(image)}
                            alt={`${item.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{ 
                              imageRendering: 'high-quality',
                              backfaceVisibility: 'hidden',
                              transform: 'translateZ(0)'
                            }}
                          />
                          {/* Polaroid inward shadow */}
                          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Custom Navigation Buttons */}
                  {images.length > 1 && (
                    <>
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
                    </>
                  )}
                  
                  {/* Custom Pagination */}
                  {images.length > 1 && (
                    <div className="custom-swiper-pagination flex justify-center items-center space-x-2 mt-6"></div>
                  )}
                </div>
              ) : (
                <div className="relative aspect-[4/3] bg-stone-50 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Body className="text-stone-500">No images available</Body>
                  {/* Polaroid inward shadow for consistency */}
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="space-y-8">
              {/* Title and Pricing */}
              <div>
                <H1 className="text-stone-900 mb-6">{item.title}</H1>
                
                {/* Pricing */}
                <div className="space-y-4">
                  {item.your_price && !item.hide_your_price && (
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-bold text-stone-900">
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                      <TagIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        Save {formatPrice(savings.savings)} ({savings.percentage.toFixed(0)}% off)
                      </span>
                    </div>
                  )}

                  {/* Listing Date */}
                  <div className="text-sm text-stone-600 font-medium">
                    {formatListingDate(item.updated_at)}
                  </div>

                  {/* Local pickup badge */}
                  {item.local_only && (
                    <div className="inline-flex items-center px-3 py-1.5 bg-accent-50 text-accent-700 rounded-full border border-accent-100 text-sm font-medium">
                      Local pickup only
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div>
                  <H3 className="text-stone-900 mb-4">Description</H3>
                  <div className="prose prose-stone max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-6">
                {item.original_accessories && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <CubeIcon className="h-4 w-4 text-stone-600" />
                    </div>
                    <div>
                      <H3 className="text-stone-900 text-base mb-1">Original Accessories</H3>
                      <Body className="text-stone-600">{item.original_accessories}</Body>
                    </div>
                  </div>
                )}
                
                {item.shipping !== null && item.shipping !== undefined && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <TruckIcon className="h-4 w-4 text-stone-600" />
                    </div>
                    <div>
                      <H3 className="text-stone-900 text-base mb-1">Shipping</H3>
                      <Body className="text-stone-600">
                        {item.shipping === 0 ? 'Free shipping' : `Shipping: ${formatPrice(item.shipping)}`}
                      </Body>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => navigate(`/contact?product=${encodeURIComponent(item.title)}&inquiry=purchase&preowned=true`)}
                >
                  Contact for Details
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => navigate(`/contact?product=${encodeURIComponent(item.title)}&inquiry=demo&preowned=true`)}
                >
                  Request Demo
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* About Pre-Owned Section */}
      <Section variant="hero" background="white" className="py-40">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="text-stone-900 mb-12 text-center">
              About This Pre-Owned Item
            </H2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TagIcon className="h-8 w-8 text-accent-600" />
                </div>
                <H3 className="text-stone-900 mb-3">Exceptional Value</H3>
                <Body className="text-stone-600">
                  Significant savings on high-end audio equipment that maintains its performance and quality.
                </Body>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CubeIcon className="h-8 w-8 text-accent-600" />
                </div>
                <H3 className="text-stone-900 mb-3">Carefully Inspected</H3>
                <Body className="text-stone-600">
                  Each item is thoroughly tested and inspected to ensure it meets our quality standards.
                </Body>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TruckIcon className="h-8 w-8 text-accent-600" />
                </div>
                <H3 className="text-stone-900 mb-3">Warranty Available</H3>
                <Body className="text-stone-600">
                  Many pre-owned items come with warranty coverage for your peace of mind.
                </Body>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};

export default PreOwnedDetail; 