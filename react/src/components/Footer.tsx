import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from './SignIn';

const Footer: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 overflow-hidden z-0">
      {/* Sophisticated Background with Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      {/* Warm Cream Pinstripe Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(254,252,250,0.04) 1px, rgba(254,252,250,0.04) 2px, transparent 2px, transparent 4px)'
        }}
      ></div>
      
      {/* Minimalist Footer Content */}
      <div className="relative">
        <div className="py-12 lg:px-[88px] md:py-20 px-6 md:px-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-3xl font-light text-white tracking-[0.2em]">
                    FIDELIS
                  </h2>
                </div>

                <p className="text-stone-400 leading-relaxed max-w-md">
                  America's premiere importer of high-end audio gear. Decades of relationships with the world's finest manufacturers, because we believe in <span className="font-semibold text-stone-300">Music For Life</span>.
                </p>
                
                {/* Store Hours */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium tracking-wide text-sm">Store Hours</h3>
                  <div className="text-sm text-stone-400 space-y-1">
                    <div>Monday - Friday: 10:00 AM - 6:00 PM</div>
                    <div>Saturday: 10:00 AM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <h3 className="text-white font-medium tracking-wide">Visit Us</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-4 w-4 text-stone-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-stone-300">
                      460 Amherst Street<br />
                      Nashua, NH 03063
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-stone-500 flex-shrink-0" />
                    <a 
                      href="tel:+1-555-FIDELIS" 
                      className="text-sm text-stone-300 hover:text-white transition-colors duration-300"
                    >
                      +1 (555) FIDELIS
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-4 w-4 text-stone-500 flex-shrink-0" />
                    <a 
                      href="mailto:hello@fidelisaudio.com" 
                      className="text-sm text-stone-300 hover:text-white transition-colors duration-300"
                    >
                      hello@fidelisaudio.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="space-y-4">
                <h3 className="text-white font-medium tracking-wide">Quick Links</h3>
                <nav className="space-y-3">
                  {[
                    { to: "/products/list", label: "All Products" },
                    { to: "/manufacturers", label: "Manufacturers" },
                    { to: "/pre-owned", label: "Pre-Owned" },
                    { to: "/news", label: "News & Events" },
                    { to: "/contact", label: "Contact & Demo" }
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block text-sm text-stone-400 hover:text-white transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimalist Bottom Bar */}
        <div className="relative border-t border-white/10">
          <div className="lg-px-[88px] md:px-0">
            <div className="py-4 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
              <p className="text-sm text-stone-400">© 2025 Fidelis. All rights reserved.</p>
              
              <div className="flex items-center gap-6 text-sm">
                {!user ? (
                  <button
                    onClick={() => setIsSignInOpen(true)}
                    className="text-stone-400 hover:text-white transition-colors duration-300"
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/admin" 
                      className="text-stone-400 hover:text-white transition-colors duration-300"
                    >
                      Admin
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="text-stone-400 hover:text-white transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </footer>
  );
};

export { Footer };