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

const PreOwned: React.FC = () => {
  const [preOwnedItems, setPreOwnedItems] = useState<PreOwned[]>([]);
  const [filteredItems, setFilteredItems] = useState<PreOwned[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPreOwned();
        setPreOwnedItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error loading pre-owned data:', error);
        setPreOwnedItems([]);
        setFilteredItems([]);
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

    // Price range filter
    filtered = filtered.filter(item =>
      (!item.your_price || (item.your_price >= priceRange[0] && item.your_price <= priceRange[1]))
    );

    // Local only filter
    if (showLocalOnly) {
      filtered = filtered.filter(item => item.local_only);
    }

    setFilteredItems(filtered);
  }, [preOwnedItems, searchTerm, priceRange, showLocalOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
      {/* Header */}
      <Section>
        <Container>
          <Flex direction="col" align="start" className="max-w-4xl">
            <H1>Pre-Owned Equipment</H1>
            <BodyLarge className="mt-4">
              Placeholder content
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* Filters */}
      <Section className="bg-white border-b border-gray-200">
        <Container>
          <Flex direction="col" gap="md" className="md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pre-owned equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Price Range */}
            <Flex gap="sm" align="center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              />
              <span className="text-gray-600">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              />
            </Flex>

            {/* Local Pickup Filter */}
            <Flex gap="sm" align="center">
              <input
                type="checkbox"
                checked={showLocalOnly}
                onChange={(e) => setShowLocalOnly(e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm text-gray-700">Local pickup only</span>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Results */}
      <Section>
        <Container>
          {filteredItems.length > 0 ? (
            <Grid cols={3} gap="lg">
              {filteredItems.map((item) => (
                <Link key={item.id} to={`/pre-owned/${item.id}`}>
                  <PreOwnedCard item={item} />
                </Link>
              ))}
            </Grid>
          ) : (
            <div className="text-center py-12">
              <Body className="text-gray-600">
                Placeholder content
              </Body>
            </div>
          )}
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-gray-50">
        <Container>
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