import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getHomeHeroImages, type HomeHeroImage, getImageUrl } from '../lib/supabase';
import { Section, Container, H1, BodyLarge } from './ui';

/**
 * HeroShowcase
 * Full-bleed hero with a randomly selected background image from Supabase.
 * Text animates in over the image.
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
    <div className="relative w-full bg-black">
      <div className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
          {/* Background image */}
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt={selected?.alt_text || 'Homepage hero'}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => {
                // Prevent layout shifts by ensuring the image is fully loaded
                console.log('Hero image loaded');
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-700" />
          )}

          {/* Sophisticated overlay with multiple gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Optional credit */}
          {selected?.credit && (
            <div className="absolute bottom-6 right-6 z-10 text-xs text-white/70 backdrop-blur-md bg-black/30 rounded-lg px-3 py-2 border border-white/10">
              {selected.credit}
            </div>
          )}

          {/* Content with premium typography and spacing */}
          <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-8"
              >
                <h1 className="text-white font-light tracking-tight text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mb-8 leading-none">
                  <span className="block">Music</span>
                  <span className="block">for Life</span>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                                 <p className="text-white/90 text-lg sm:text-xl lg:text-2xl font-light tracking-wide max-w-4xl mx-auto leading-relaxed">
                   the joy of two-channel audio in your home
                 </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
};

export { HeroShowcase };


