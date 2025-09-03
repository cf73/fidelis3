import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getManufacturers, getImageUrl, type Manufacturer } from '../lib/supabase';
import { Section, Grid, Container, Flex, H1, H2, Body, BodyLarge } from '../components/ui';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';


const Manufacturers: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const data = await getManufacturers();
        setManufacturers(data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
        setManufacturers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManufacturers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">{getRandomMusicalMessage()}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-warm-white"
    >
      {/* Hero Section */}
      <Section variant="hero" className="!pt-8 !pb-16">
        <Container>
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-4">Manufacturers</H1>
            <BodyLarge className="text-stone-600 max-w-2xl">
              Discover the world's finest audio equipment manufacturers, each bringing their unique expertise and craftsmanship to create exceptional listening experiences.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* Manufacturers Grid */}
      <Section variant="default" background="custom" customBackground="bg-warm-white">
        <Container>
          {manufacturers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {manufacturers.map((manufacturer) => (
                <motion.div
                  key={manufacturer.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to={`/manufacturers/${manufacturer.slug || manufacturer.id}`}
                    className="block p-6 rounded-xl transition-all duration-300 bg-white/50 hover:bg-white/80"
                  >
                    {manufacturer.logo ? (
                      <div className="flex items-center justify-center h-24">
                        <img
                          src={getImageUrl(manufacturer.logo)}
                          alt={manufacturer.name}
                          className="max-h-16 max-w-full object-contain mix-blend-multiply transition-opacity duration-200"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-24">
                        <div className="text-stone-400 text-sm text-center font-medium">
                          {manufacturer.name}
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <H2 className="mb-4">No Manufacturers Found</H2>
              <Body className="text-stone-500">
                We're currently updating our manufacturer listings. Please check back soon.
              </Body>
            </div>
          )}
        </Container>
      </Section>
    </motion.div>
  );
};

export { Manufacturers }; 