import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface ContextualCMSProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  context?: string; // e.g., 'product', 'manufacturer', 'news', 'preowned'
}

export const ContextualCMS: React.FC<ContextualCMSProps> = ({
  isOpen,
  onClose,
  title,
  children,
  context = 'default'
}) => {
  // Prevent body scroll when CMS is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Main CMS Container - Slides the site over */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-gradient-to-r from-stone-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
                  <p className="text-sm text-stone-600 capitalize">{context} management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Trigger Button Component
interface CMSTriggerProps {
  onClick: () => void;
  label?: string;
  context?: string;
  className?: string;
}

export const CMSTrigger: React.FC<CMSTriggerProps> = ({
  onClick,
  label = 'Edit',
  context = 'default',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 
        bg-stone-800 text-white rounded-xl 
        hover:bg-stone-900 transition-all duration-200 
        shadow-sm hover:shadow-md
        text-sm font-medium
        ${className}
      `}
    >
      <Cog6ToothIcon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

// Add Button Component
interface CMSAddTriggerProps {
  onClick: () => void;
  label?: string;
  context?: string;
  className?: string;
}

export const CMSAddTrigger: React.FC<CMSAddTriggerProps> = ({
  onClick,
  label = 'Add New',
  context = 'default',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 
        bg-stone-600 text-white rounded-xl 
        hover:bg-stone-700 transition-all duration-200 
        shadow-sm hover:shadow-md
        text-sm font-medium
        ${className}
      `}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

