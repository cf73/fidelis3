import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryCard } from './ui/Card';
import { useCategories } from '../contexts/CategoriesContext';
import { getImageUrl } from '../lib/supabase';

// Cheeky megamenu messages that wink at audiophile behavior
const megamenuMessages = [
  "Because you know exactly what you're looking for",
  "Ready for your next upgrade?",
  "Just one more component...",
  "Your system is never really finished",
  "Because good enough isn't good enough",
  "Chasing that perfect soundstage",
  "You've been researching this for months",
  "Time to justify another purchase",
  "Your ears deserve better",
  "Because your neighbors need to hear this too",
  "Upgrading since before streaming was a thing",
  "You can hear the difference",
  "Your vinyl collection demands it",
  "Because cables do matter",
  "Pursuing audio perfection, one component at a time",
  "Your significant other doesn't understand",
  "But this one goes to eleven",
  "Because you've outgrown your current setup",
  "Feeding the audiophile addiction",
  "Your music deserves this",
  "Because you know what you heard at the show",
  "Time to complete the system... again",
  "Chasing that elusive perfect sound",
  "Your current gear is holding you back",
  "Because you've been saving up",
  "Ready to hear what you've been missing?",
  "Your demo playlist is ready",
  "Because good sound is addictive",
  "Time for the next level",
  "Your ears have expensive taste"
];

// Custom styles for megamenu cards - keep light backgrounds but adjust text for dark/light themes
const megamenuStyles = `
  .megamenu-card .bg-\\[\\#f4f0ed\\] {
    background-color: #f4f0ed !important;
    transition: all 200ms ease-out !important;
  }
  .megamenu-card:hover .bg-\\[\\#f4f0ed\\] {
    background-color: #fefcfa !important; /* warm-white */
  }
  
  /* Light megamenu - dark text on light cards */
  .megamenu-light .megamenu-card h3 {
    color: #1c1917 !important; /* stone-900 */
  }
  
  /* Dark megamenu - light text on light cards for contrast */
  .megamenu-dark .megamenu-card h3 {
    color: #f9fafb !important; /* gray-50 */
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = megamenuStyles;
  if (!document.head.querySelector('[data-megamenu-styles]')) {
    styleElement.setAttribute('data-megamenu-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

interface MegamenuProps {
  isOpen: boolean;
  onClose: () => void;
  hasScrolled: boolean;
}

export const Megamenu: React.FC<MegamenuProps> = ({ isOpen, onClose, hasScrolled }) => {
  const { categories, loading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  // Random message selection - pick a new one each time the megamenu opens
  const [currentMessage, setCurrentMessage] = useState(() => 
    megamenuMessages[Math.floor(Math.random() * megamenuMessages.length)]
  );

  // Preload all category images efficiently when categories are available
  useEffect(() => {
    if (categories.length > 0 && !imagesPreloaded) {
      const preloadImages = () => {
        console.log('🖼️ MEGAMENU: Preloading', categories.length, 'category images');
        
        // Create a batch of image preloads
        const imagePromises = categories.map((category, index) => {
          return new Promise<void>((resolve) => {
            if (category.heroImage) {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Don't block on errors
              img.src = getImageUrl(category.heroImage);
            } else {
              resolve();
            }
          });
        });

        // Preload in small batches to avoid overwhelming the browser
        const batchSize = 4;
        const batches = [];
        for (let i = 0; i < imagePromises.length; i += batchSize) {
          batches.push(imagePromises.slice(i, i + batchSize));
        }

        // Process batches sequentially with small delays
        const processBatches = async () => {
          for (const batch of batches) {
            await Promise.all(batch);
            // Small delay between batches to keep UI responsive
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          console.log('🖼️ MEGAMENU: All images preloaded');
          setImagesPreloaded(true);
        };

        processBatches();
      };

      // Use requestIdleCallback for optimal performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(preloadImages);
      } else {
        setTimeout(preloadImages, 200);
      }
    }
  }, [categories, imagesPreloaded]);

  // Pick a new random message when megamenu opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMessage(megamenuMessages[Math.floor(Math.random() * megamenuMessages.length)]);
    }
  }, [isOpen]);

  // Track scroll position for arrows
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position for arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  // Set up scroll position tracking
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && isOpen) {
      checkScrollPosition();
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, [isOpen, categories]);

  // Scroll functions - increased distance for better mouse navigation
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Scroll by approximately 3-4 cards worth (48 * 4 = 192, plus gaps)
      scrollContainerRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Scroll by approximately 3-4 cards worth (48 * 4 = 192, plus gaps)
      scrollContainerRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Megamenu Container */}
          <motion.div
            initial={{ 
              opacity: 0, 
              y: -20
            }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              y: -20
            }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className={`
              fixed left-0 right-0 z-50 overflow-hidden top-[88px]
              ${hasScrolled 
                ? 'bg-white/50 backdrop-blur-xl shadow-white/20 shadow-lg megamenu-light' 
                : 'bg-stone-900/40 backdrop-blur-xl shadow-black/10 shadow-lg megamenu-dark'
              }
            `}
            style={{
              backgroundImage: hasScrolled 
                ? 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                : 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 4px)'
            }}
          >
            <div className="py-8">
              {/* Header - aligned with nav content: left-6 + Container px-8 + Flex px-8 = 88px from left edge */}
              <div style={{ paddingLeft: '88px', paddingRight: '88px' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-light tracking-wide ${
                      hasScrolled ? 'text-stone-900' : 'text-white'
                    }`}>
                      {currentMessage}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-2 ${
                      hasScrolled 
                        ? 'text-stone-500 hover:text-stone-700' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Categories Scroll Container - full width, cards can extend beyond nav alignment */}
              <div className="relative">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
                      <span className="ml-3 text-stone-600">Loading categories...</span>
                    </div>
                  ) : !imagesPreloaded ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-pulse rounded-full h-8 w-8 bg-stone-300"></div>
                      <span className="ml-3 text-stone-600">Optimizing images...</span>
                    </div>
                  ) : (
                    <>
                      {/* Horizontal scroll container - full width with proper arrow positioning */}
                      <div className="relative">
                        {/* Left scroll arrow - positioned relative to nav content area */}
                        {canScrollLeft && (
                          <button
                            onClick={scrollLeft}
                            className="absolute top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                            style={{ left: '96px' }} // 88px (nav alignment) + 8px spacing
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Right scroll arrow - positioned relative to nav content area */}
                        {canScrollRight && (
                          <button
                            onClick={scrollRight}
                            className="absolute top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                            style={{ right: '96px' }} // 88px (nav alignment) + 8px spacing
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        
                        <div 
                          ref={scrollContainerRef}
                          className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                          style={{ 
                            paddingLeft: '88px', // Exact nav alignment: left-6 + Container px-8 + Flex px-8 = 88px
                            paddingRight: '88px' // Match right side alignment
                          }}
                        >
                        {categories.map((category, index) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex-shrink-0 w-48"
                            onClick={onClose}
                          >
                            <Link
                              to={`/products/list?category=${category.id}`}
                              className="block h-full"
                            >
                              <CategoryCard category={category} className="h-full megamenu-card" />
                            </Link>
                          </motion.div>
                        ))}
                        
                        {/* View All Products Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: categories.length * 0.05 }}
                          className="flex-shrink-0 w-48"
                          onClick={onClose}
                        >
                          <Link
                            to="/products/list"
                            className="block h-full"
                          >
                            <div className="h-full flex flex-col bg-stone-900 rounded-lg p-6 transition-all duration-300 hover:bg-stone-800 text-white">
                              <div className="flex-grow flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <h3 className="text-base font-semibold text-white leading-tight">
                                  View All Products
                                </h3>
                                <p className="text-sm text-white/70 mt-1">
                                  Browse everything
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

