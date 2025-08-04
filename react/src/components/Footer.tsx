import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">Fidelis AV</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Your premier destination for high-end audio equipment. We specialize in 
                the finest speakers, amplifiers, and audio components from the world's 
                most respected manufacturers.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-accent-400" />
                  <span className="text-gray-300">123 Audio Lane, Cambridge, MA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-accent-400" />
                  <span className="text-gray-300">(617) 555-0123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-accent-400" />
                  <span className="text-gray-300">info@fidelisav.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/manufacturers" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Manufacturers
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-gray-300 hover:text-white transition-colors duration-200">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/pre-owned" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Pre-Owned
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Demo Appointments
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Service & Support
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Fidelis AV. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 