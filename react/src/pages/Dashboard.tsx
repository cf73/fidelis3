import React from 'react';
import { motion } from 'framer-motion';
import { H1, BodyLarge } from '../components/ui/Typography';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <H1 className="text-stone-100 mb-4">Dashboard</H1>
        <BodyLarge className="text-stone-400">Dashboard functionality coming soon...</BodyLarge>
      </motion.div>
    </div>
  );
};

