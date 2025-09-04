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
        <div className="py-16" style={{ paddingLeft: '88px', paddingRight: '88px' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Brand Section - Minimalist */}
            <motion.div variants={itemVariants}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-light text-white tracking-wide">
                    Fidelis Audio
                  </h2>
                </div>

                <p className="text-stone-400 leading-relaxed max-w-sm">
                  Connecting you to the soul of music through carefully curated listening experiences.
                </p>
              </div>
            </motion.div>

            {/* Contact Information - Streamlined */}
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-stone-300">
                    460 Amherst Street<br />
                    Nashua, NH 03063
                  </p>
                  
                  <p className="text-sm text-stone-300">
                    <a href="tel:+1-555-FIDELIS" className="hover:text-white transition-colors duration-300">
                      +1 (555) FIDELIS
                    </a>
                  </p>
                  
                  <p className="text-sm text-stone-300">
                    <a href="mailto:hello@fidelisaudio.com" className="hover:text-white transition-colors duration-300">
                      hello@fidelisaudio.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation - Condensed */}
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <nav className="space-y-2">
                  {[
                    { to: "/products", label: "Products" },
                    { to: "/manufacturers", label: "Manufacturers" },
                    { to: "/pre-owned", label: "Pre-Owned" },
                    { to: "/news", label: "News" },
                    { to: "/contact", label: "Contact" }
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
          <div style={{ paddingLeft: '88px', paddingRight: '88px' }}>
            <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-stone-400">© 2024 Fidelis Audio. All rights reserved.</p>
              
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