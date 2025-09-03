/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Visual Language:
 * - Colors: Primary blue, accent gold, neutral grays
 * - Typography: Inter font, established scale
 * - Spacing: 4px base unit system
 * - Layout: Responsive grid, consistent padding
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, TagIcon, TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import { getPreOwned, getImageUrl, type PreOwned } from '../lib/supabase';
import { 
  Section, 
  Container, 
  Grid, 
  Flex, 
  H1, 
  H2, 
  H3, 
  Body, 
  BodyLarge, 
  Button,
  PreOwnedCard,
  ValueCard
} from '../components/ui';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';

const PreOwned: React.FC = () => {
  const [preOwnedItems, setPreOwnedItems] = useState<PreOwned[]>([]);
  const [filteredItems, setFilteredItems] = useState<PreOwned[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [showInitialSpinner, setShowInitialSpinner] = useState(true);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPreOwned();
        setPreOwnedItems(data);
        setFilteredItems(data);
        
        // Preload all first images
        const preloadPromises = data.map(item => {
          return new Promise<void>((resolve) => {
            if (item.images && item.images.length > 0) {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Resolve even on error
              img.src = getImageUrl(item.images[0]);
            } else {
              resolve(); // No image to load
            }
          });
        });
        
        // Wait for all images to preload (with timeout)
        const preloadWithTimeout = Promise.race([
          Promise.all(preloadPromises),
          new Promise(resolve => setTimeout(resolve, 3000)) // 3 second timeout
        ]);
        
        await preloadWithTimeout;
        
        // Initialize cards as hidden
        setCardsVisible(new Array(data.length).fill(false));
        
        // Hide spinner and start sequential animation
        setShowInitialSpinner(false);
        
        // Trigger sequential card animation
        setTimeout(() => {
          data.forEach((_, index) => {
            setTimeout(() => {
              setCardsVisible(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 80); // Fast 80ms intervals
          });
        }, 200); // Brief delay after spinner disappears
        
      } catch (error) {
        console.error('Error loading pre-owned data:', error);
        setPreOwnedItems([]);
        setFilteredItems([]);
        setShowInitialSpinner(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = preOwnedItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Local only filter
    if (showLocalOnly) {
      filtered = filtered.filter(item => item.local_only);
    }

    setFilteredItems(filtered);
    
    // Reset and animate cards when filters change
    if (filtered.length !== filteredItems.length) {
      setCardsVisible(new Array(filtered.length).fill(false));
      setTimeout(() => {
        filtered.forEach((_, index) => {
          setTimeout(() => {
            setCardsVisible(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }, index * 60); // Even faster for filter changes
        });
      }, 100);
    }
  }, [preOwnedItems, searchTerm, showLocalOnly, filteredItems.length]);

  if (loading || showInitialSpinner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{getRandomMusicalMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#fffcf9]"
    >
      {/* Hero Section */}
      <Section variant="hero" background="custom" customBackground="bg-warm-beige" className="-mt-4">
        <Container size="6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-stone-900 leading-tight tracking-wide mb-6">Pre-Owned Equipment</h1>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
              Discover exceptional value on carefully inspected, high-end audio equipment with significant savings.
            </div>
          </div>
        </Container>
      </Section>



      {/* Results Grid */}
      <Section variant="compact" background="custom" customBackground="bg-[#fffcf9]">
        <Container size="6xl">
          {filteredItems.length > 0 ? (
            <>
              {/* Search, Local Filter, and Results Count */}
              <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={showLocalOnly}
                      onChange={(e) => setShowLocalOnly(e.target.checked)}
                      className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm text-gray-700">Local pickup only</span>
                  </label>
                </div>
                <p className="text-gray-600">
                  Showing {filteredItems.length} pre-owned item{filteredItems.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredItems.map((item, index) => (
                  <Link key={item.id} to={`/pre-owned/${item.id}`} className="block h-full group">
                    <PreOwnedCard 
                      item={item} 
                      className="h-full" 
                      index={index}
                      isVisible={cardsVisible[index] || false}
                    />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <H3 className="mb-2">No items found</H3>
              <Body className="text-gray-600">
                Try adjusting your search criteria or check back later for new arrivals.
              </Body>
            </div>
          )}
        </Container>
      </Section>

      {/* Value Proposition - Refined */}
      <Section variant="compact" background="white">
        <Container size="6xl">
          <Flex direction="col" align="center" className="max-w-4xl mx-auto">
            <H2 className="text-center mb-8">
              Why Choose Pre-Owned?
            </H2>
            <Grid cols={3} gap="xl">
              <ValueCard
                value={{
                  icon: "🏷️",
                  title: "Exceptional Value",
                  description: "Significant savings on high-end audio equipment that maintains its performance and quality."
                }}
              />
              <ValueCard
                value={{
                  icon: "📦",
                  title: "Carefully Inspected",
                  description: "Each item is thoroughly tested and inspected to ensure it meets our quality standards."
                }}
              />
              <ValueCard
                value={{
                  icon: "🚚",
                  title: "Warranty Available",
                  description: "Many pre-owned items come with warranty coverage for your peace of mind."
                }}
              />
            </Grid>
          </Flex>
        </Container>
      </Section>
    </motion.div>
  );
};

export { PreOwned }; 