import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getHomeHeroImages, type HomeHeroImage, getImageUrl } from '../lib/supabase';
import { Section, Container, H1, BodyLarge } from './ui';
import { useAuth } from '../contexts/AuthContext';

/**
 * HeroShowcase
 * Split-column hero: image on left, text on right, compact 30vh height
 */
interface HeroShowcaseProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onLoadingChange }) => {
  const { user } = useAuth();
  const [images, setImages] = useState<HomeHeroImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Failsafe timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('🖼️ Hero loading timeout - forcing load');
      setIsLoading(false);
      setImageLoaded(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        console.log('🖼️ Loading hero images...');
        const data = await getHomeHeroImages();
        console.log('🖼️ Hero images loaded:', data?.length);
        if (isMounted) setImages(data);
      } catch (error) {
        console.error('❌ Error loading hero images', error);
      } finally {
        if (isMounted) {
          console.log('🖼️ Hero data loading complete');
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selected = useMemo(() => {
    if (!images || images.length === 0) return null;
    
    // If admin has selected a specific image, use that
    if (selectedImageId) {
      const selectedImage = images.find(img => img.id === selectedImageId);
      if (selectedImage) return selectedImage;
    }
    
    // Otherwise use random selection
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, [images, selectedImageId]);

  // Reset image loaded state when selected image changes
  useEffect(() => {
    if (selected) {
      console.log('🖼️ Selected image changed, resetting imageLoaded');
      setImageLoaded(false);
    }
  }, [selected]);

  const backgroundUrl = selected?.image ? getImageUrl(selected.image) : '';

  const isHeroLoading = isLoading || (backgroundUrl && !imageLoaded);
  
  // If no backgroundUrl (no images available), consider it loaded after data fetch
  useEffect(() => {
    if (!isLoading && !backgroundUrl) {
      console.log('🖼️ No background URL available, considering hero loaded');
      setImageLoaded(true);
    }
  }, [isLoading, backgroundUrl]);

  // Notify parent of loading state changes
  useEffect(() => {
    console.log('🖼️ Hero loading state changed:', isHeroLoading);
    onLoadingChange?.(isHeroLoading);
  }, [isHeroLoading, onLoadingChange]);

  // Always render the hero - no internal loading state
  // The parent (Home) will handle showing/hiding the entire page

  return (
    <div
      data-home-hero="main"
      className="relative w-full h-[75vh] lg:h-[62vh] min-h-[500px] bg-[#fefcfa] overflow-hidden"
    >
      <div data-home-hero="sentinel" />
      {/* Admin Hero Image Selector - Compact Bottom Right */}
      {user && (
        <div className="fixed bottom-4 right-4 z-[9999] pointer-events-auto group">
          <div className="bg-black/90 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl transition-all duration-300 ease-out group-hover:scale-105">
            {/* Compact State */}
            <div className="group-hover:hidden p-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Expanded State */}
            <div className="hidden group-hover:block p-3 min-w-[220px]">
              <label className="block text-xs text-white/70 font-medium tracking-wider uppercase mb-2">
                Preview Hero Image
              </label>
              <select
                value={selectedImageId || ''}
                onChange={(e) => setSelectedImageId(e.target.value || null)}
                className="w-full bg-white/10 border border-white/20 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 cursor-pointer"
              >
                <option value="">Random (Default)</option>
                {images.map((image) => (
                  <option key={image.id} value={image.id} className="bg-stone-900 text-white">
                    {image.alt_text || `Image ${image.id.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Layout - Split Column */}
      <div className="hidden lg:flex relative h-full">
        {/* Left Column - Image (Golden ratio: ~61.8%) */}
        <div className="relative w-[61.8%] h-full">
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt={selected?.alt_text || 'Homepage hero'}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => {
                console.log('🖼️ Hero image onLoad fired');
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
          )}
          
          {/* Strong gradient overlay transitioning smoothly to right column */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-60% via-stone-900/60 via-85% to-stone-900" />
          
          {/* Optional credit */}
          {selected?.credit && (
            <div className="absolute bottom-4 left-4 z-10 text-xs text-white/70 backdrop-blur-md bg-black/30 rounded-lg px-3 py-2 border border-white/10">
              {selected.credit}
            </div>
          )}
        </div>

        {/* Right Column - Text on dark background (Golden ratio: ~38.2%) */}
        <div className="relative w-[38.2%] h-full bg-stone-900 flex items-center justify-center" style={{ paddingTop: '100px' }}>
          {/* Gradient overlay for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-900" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              <h1 className="text-white font-normal tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-none">
                <span className="block font-light">Music</span>
                <span className="block font-medium">for Life</span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-white/95 text-lg sm:text-xl lg:text-2xl font-light tracking-wide leading-relaxed">
                bringing home the passion<br />for over six decades
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Width Image with Overlapping Text */}
      <div className="lg:hidden relative h-[75vh] min-h-[600px] bg-stone-900">
        {/* Full Width Image - Same height as before */}
        <div className="relative w-full h-[60vh] min-h-[450px]">
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt={selected?.alt_text || 'Homepage hero'}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => {
                console.log('🖼️ Hero image onLoad fired');
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
          )}
          
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          
          {/* Optional credit */}
          {selected?.credit && (
            <div className="absolute bottom-4 left-4 z-10 text-xs text-white/70 backdrop-blur-md bg-black/30 rounded-lg px-3 py-2 border border-white/10">
              {selected.credit}
            </div>
          )}
        </div>

        {/* Text Content - Positioned to overlap image and extend beyond */}
        <div className="absolute bottom-0 left-0 right-0 z-50 pb-12">
          {/* Gradient background behind text for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          
          {/* Text Content */}
          <div className="relative z-50 text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1
              }}
              className="mb-6"
            >
              <h1 className="text-white font-normal tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] mb-6 leading-[0.85]">
                <motion.span 
                  className="block font-light drop-shadow-2xl"
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 1.4, 
                    delay: 0.3, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.05)',
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
                  }}
                >
                  Music
                </motion.span>
                <motion.span 
                  className="block font-bold drop-shadow-2xl"
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 1.4, 
                    delay: 0.5, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
                    filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.5))'
                  }}
                >
                  for Life
                </motion.span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.4, 
                delay: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <p className="text-white/98 text-lg sm:text-xl md:text-2xl font-light tracking-wide leading-relaxed drop-shadow-xl">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.0 }}
                >
                  bringing home the passion
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                >
                  for over six decades
                </motion.span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Sophisticated dark gradient along top for navigation contrast */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-30 pointer-events-none" />
    </div>
  );
};

export { HeroShowcase };


