import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getImageUrl } from '../lib/supabase';

interface ProductGalleryProps {
  images: string[];
  itemTitle: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, itemTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const nextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const prevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Product Gallery */}
      <div className="product-card-stack">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.activeIndex);
          }}
          effect="cards"
          grabCursor={true}
          modules={[EffectCards]}
          cardsEffect={{
            perSlideOffset: 8,
            perSlideRotate: 2,
            rotate: true,
            slideShadows: true,
          }}
          className="product-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="product-slide">
              <div className="product-card h-full overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <img
                  src={getImageUrl(image)}
                  alt={`${itemTitle} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={prevSlide}
            className="bg-white border-2 border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Current Position Indicator */}
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-stone-600 scale-125'
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white border-2 border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}

      {/* Click hint */}
      {images.length > 1 && (
        <p className="text-center text-stone-500 text-sm mt-4">
          Swipe or click to view photos
        </p>
      )}

      <style jsx>{`
        .product-swiper {
          width: 100%;
          height: 600px;
        }
        
        .product-slide {
          border-radius: 0.5rem;
          overflow: visible;
        }
        
        .product-card {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        
        :global(.swiper-slide-shadow-cards) {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;
