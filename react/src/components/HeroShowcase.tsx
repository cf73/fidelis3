import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getHomeHeroImages, type HomeHeroImage, getImageUrl } from '../lib/supabase';
import { Section, Container, H1, BodyLarge } from './ui';

/**
 * HeroShowcase
 * Split-column hero: image on left, text on right, compact 30vh height
 */
const HeroShowcase: React.FC = () => {
  const [images, setImages] = useState<HomeHeroImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getHomeHeroImages();
        if (isMounted) setImages(data);
      } catch (error) {
        console.error('Error loading hero images', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selected = useMemo(() => {
    if (!images || images.length === 0) return null;
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, [images]);

  const backgroundUrl = selected?.image ? getImageUrl(selected.image) : '';

  return (
    <div className="relative w-full h-[62vh] min-h-[500px] bg-[#fffcf9] overflow-hidden">
      <div className="relative h-full flex">
        {/* Left Column - Image (Golden ratio: ~61.8%) */}
        <div className="relative w-[61.8%] h-full">
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt={selected?.alt_text || 'Homepage hero'}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => {
                console.log('Hero image loaded');
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
      
      {/* Sophisticated dark gradient along top for navigation contrast */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-30 pointer-events-none" />
    </div>
  );
};

export { HeroShowcase };


