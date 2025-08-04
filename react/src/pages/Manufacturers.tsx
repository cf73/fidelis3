import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getManufacturers, getImageUrl, type Manufacturer } from '../lib/supabase';

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
      <div className="min-h-screen flex items-center justify-center">
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
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Manufacturers</h1>
          <p className="text-lg text-gray-600">
            Placeholder content
          </p>
        </div>
      </section>

      {/* Manufacturers Grid */}
      <section className="container-custom py-12">
        {manufacturers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {manufacturers.map((manufacturer) => (
              <motion.div
                key={manufacturer.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -5 }}
                className="card text-center p-6"
              >
                {manufacturer.logo && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(manufacturer.logo)}
                      alt={manufacturer.title}
                      className="h-16 mx-auto object-contain"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{manufacturer.title}</h3>
                {manufacturer.tagline && (
                  <p className="text-gray-600 mb-4">{manufacturer.tagline}</p>
                )}
                {manufacturer.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {manufacturer.description}
                  </p>
                )}
                <Link
                  to={`/manufacturers/${manufacturer.slug || manufacturer.id}`}
                  className="btn-primary w-full"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Placeholder content</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Manufacturers; 