import React from 'react';
import { motion } from 'framer-motion';

const ManufacturerDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white shadow-sm">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
              Manufacturer Details
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed information about our manufacturer partners
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-6xl mb-4">🏭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Detailed manufacturer pages are currently under development. 
              Check back soon for comprehensive information about our partners.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ManufacturerDetail; 