import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from './SignIn';
import { Container, Flex, Body, BodySmall } from './ui';
import { motion } from 'framer-motion';
import { getProductCategories } from '../lib/supabase';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  // products dropdown removed for now

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Track if user has scrolled from top
      if (currentScrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownNav = () => {
    // Ensure scroll resets on navigation (including querystring changes)
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/manufacturers', label: 'Manufacturers' },
    { to: '/news', label: 'News' },
    { to: '/pre-owned', label: 'Pre-Owned' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <header 
        className={`
          fixed top-6 z-50
          transition-all duration-500 ease-out
          left-1/2 transform -translate-x-1/2
          w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] lg:w-[calc(100%-7rem)]
          ${hasScrolled ? 'shadow-2xl' : 'shadow-none'}
          ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl 
        `}
      >
        <Container size={"full"}>
          <Flex justify="between" align="center" className="h-16 px-6">
            {/* Desktop Navigation with centered logo */}
            <nav className="hidden lg:flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/news" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">News</Link>
                <Link to="/products" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">Products</Link>
                <Link to="/manufacturers" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">Manufacturers</Link>
              </div>
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-light tracking-wide text-stone-900 hover:text-stone-700 transition-colors duration-300">Fidelis</Link>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/pre-owned" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">Pre-Owned</Link>
                <Link to="/contact" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">Contact</Link>
                <Link to="/about" className="text-stone-800 hover:text-stone-900 px-2 py-2 rounded-xl text-sm font-medium hover:bg-white/40 hover:backdrop-blur-sm">About</Link>
              </div>
            </nav>

            {/* Mobile Logo and Menu */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Mobile Logo */}
              <Link to="/" className="text-2xl font-light tracking-wide text-stone-900 hover:text-stone-700 transition-colors duration-300">
                Fidelis
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-white/40 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500/50 transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-5 w-5`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-5 w-5`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop Auth and Menu (if needed) */}
            <Flex gap="md" align="center" className="hidden lg:flex">
              {/* Auth Button */}
              {/* Sign in temporarily removed per request */}
            </Flex>
          </Flex>

        </Container>
      </header>

      {/* True Full-Screen Mobile Navigation Overlay - Moved outside header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1]
        }}
        className="lg:hidden fixed inset-0 z-[100]"
      >
            {/* Extreme Blur Backdrop - Edge to Edge */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ 
                opacity: isMenuOpen ? 1 : 0,
                backdropFilter: isMenuOpen ? 'blur(40px)' : 'blur(0px)'
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-black/30"
              style={{
                backdropFilter: isMenuOpen ? 'blur(40px) saturate(180%)' : 'blur(0px)',
                WebkitBackdropFilter: isMenuOpen ? 'blur(40px) saturate(180%)' : 'blur(0px)'
              }}
            />
            
            {/* Full-Screen Menu Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isMenuOpen ? 1 : 0,
                scale: isMenuOpen ? 1 : 0.9
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.16, 1, 0.3, 1],
                delay: isMenuOpen ? 0.2 : 0
              }}
              className="relative h-full w-full flex flex-col"
            >
              {/* Close Button - Top Right */}
              <div className="absolute top-8 right-8 z-10">
                <motion.button
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0,
                    rotate: isMenuOpen ? 0 : -90,
                    scale: isMenuOpen ? 1 : 0.8
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: isMenuOpen ? 0.4 : 0
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Centered Menu Content */}
              <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                  {/* Logo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isMenuOpen ? 1 : 0,
                      y: isMenuOpen ? 0 : 20
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: isMenuOpen ? 0.3 : 0
                    }}
                    className="text-center mb-16"
                  >
                    <Link 
                      to="/" 
                      className="text-5xl font-light tracking-wide text-white hover:text-white/80 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Fidelis
                    </Link>
                    <div className="mt-4 w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
                  </motion.div>

                  {/* Navigation Items */}
                  <nav className="space-y-6">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ 
                          opacity: isMenuOpen ? 1 : 0,
                          y: isMenuOpen ? 0 : 30
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                          delay: isMenuOpen ? 0.4 + (index * 0.08) : 0
                        }}
                        className="text-center"
                      >
                        <Link
                          to={item.to}
                          className="group inline-block text-2xl font-light text-white/90 hover:text-white transition-all duration-500 relative"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px] inline-block">
                            {item.label}
                          </span>
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Secondary Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isMenuOpen ? 1 : 0,
                      y: isMenuOpen ? 0 : 20
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: isMenuOpen ? 0.8 : 0
                    }}
                    className="mt-16 text-center"
                  >
                    <Link
                      to="/about"
                      className="inline-block text-lg font-light text-white/70 hover:text-white/90 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isMenuOpen ? 1 : 0,
                  y: isMenuOpen ? 0 : 20
                }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isMenuOpen ? 0.9 : 0
                }}
                className="pb-8 px-8 text-center"
              >
                <p className="text-white/60 text-sm font-light">
                  +1 (555) FIDELIS • hello@fidelisaudio.com
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

      {/* Sign In Modal */}
      <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}; 

// products dropdown removed for now