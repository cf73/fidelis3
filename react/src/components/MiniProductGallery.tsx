import React, { useState } from 'react';
import { getImageUrl } from '../lib/supabase';
import LazyImage from './LazyImage';

interface MiniProductGalleryProps {
  images: string[];
  itemTitle: string;
  itemId: string;
}

const MiniProductGallery: React.FC<MiniProductGalleryProps> = ({ images, itemTitle, itemId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch/Mouse event handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const threshold = 50;
    
    // Only register as swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        prevImage(); // Swipe right = previous
      } else {
        nextImage(); // Swipe left = next
      }
    }
    
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    }
  };

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    // Single image - maintain same aspect ratio as stack
    return (
      <div className="mini-product-gallery">
        <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <img
            src={getImageUrl(images[0])}
            alt={itemTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mini-product-gallery relative">
      {/* Custom Stack Effect */}
      <div 
        className="stack-container aspect-[4/3] relative cursor-pointer group select-none"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but capture horizontal
      >
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % images.length;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;
          const isVisible = isActive || isNext || isPrev;
          
          if (!isVisible) return null;
          
          let zIndex = 10;
          let transform = '';
          let opacity = 1;
          
          if (isActive) {
            zIndex = 30;
            transform = 'translateX(0) rotate(0deg) scale(1)';
          } else if (isNext) {
            zIndex = 20;
            transform = 'translateX(15px) rotate(2deg) scale(0.94)';
            opacity = 0.7;
          } else if (isPrev) {
            zIndex = 20;
            transform = 'translateX(-15px) rotate(-2deg) scale(0.94)';
            opacity = 0.7;
          }
          
          return (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                zIndex,
                transform,
                opacity,
              }}
            >
                                  <div className="mini-product-card aspect-[4/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <LazyImage
                        src={getImageUrl(image)}
                        alt={`${itemTitle} - Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
            </div>
          );
        })}
        
        {/* Navigation arrows for mouse users */}
        {images.length > 1 && (
          <>
            {/* Left arrow */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragging) prevImage();
              }}
              aria-label="Previous image"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {/* Right arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragging) nextImage();
              }}
              aria-label="Next image"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mini indicator dots */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-1 mt-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-stone-600'
                  : 'bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .stack-container {
          padding: 0 20px;
          overflow: visible;
        }
        
        .mini-product-card {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        
        .mini-product-gallery {
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

export default MiniProductGallery;
