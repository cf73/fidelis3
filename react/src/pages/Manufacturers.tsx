import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getManufacturers, getImageUrl, type Manufacturer } from '../lib/supabase';
import { parseStatamicContent } from '../lib/utils';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Manufacturers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Placeholder content
          </p>
        </div>
      </section>

      {/* Manufacturers Grid */}
      <section className="container-custom py-12">
        {manufacturers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {manufacturers.map((manufacturer) => (
              <motion.div
                key={manufacturer.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -2, scale: 1.05 }}
                className="group"
              >
                <Link
                  to={`/manufacturers/${manufacturer.slug || manufacturer.id}`}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  {manufacturer.logo ? (
                    <div className="flex items-center justify-center h-24">
                      <img
                        src={getImageUrl(manufacturer.logo)}
                        alt={manufacturer.name}
                        className="max-h-16 max-w-full object-contain group-hover:opacity-80 transition-opacity duration-200"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24">
                      <div className="text-gray-400 dark:text-gray-500 text-sm text-center">
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
            <p className="text-gray-500 dark:text-gray-400">Placeholder content</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export { Manufacturers }; 