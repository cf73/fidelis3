import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from './SignIn';
import { Container, Flex, Body, BodySmall } from './ui';
import { motion } from 'framer-motion';
import { getProductCategories } from '../lib/supabase';
import { Megamenu } from './Megamenu';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate when hero bottom reaches nav bottom
      // Hero height: 62vh or min-h-[500px], whichever is larger
      // Nav position: top-6 (1.5rem = 24px) + nav height (h-16 = 4rem = 64px)
      // So nav bottom is at: 24px + 64px = 88px from top
      const viewportHeight = window.innerHeight;
      const heroHeight = Math.max(viewportHeight * 0.62, 500); // 62vh or 500px minimum
      const navTop = 24; // top-6 in pixels
      const navHeight = 64; // h-16 in pixels  
      const navBottom = navTop + navHeight; // 88px
      const threshold = heroHeight - navBottom;
      
      setHasScrolled(currentScrollY > threshold);
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true }); // Recalculate on resize
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHomePage]);



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

  // Close megamenu when navigating
  useEffect(() => {
    setIsMegamenuOpen(false);
  }, [location]);

  return (
    <>
      {isHomePage ? (
        <div className={`fixed z-50 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Glass background appears in place with gentle animation */}
          <div 
            className={`
              fixed top-0 left-0 right-0 h-[88px]
              ${hasScrolled || isMegamenuOpen
                ? `${isMegamenuOpen ? 'bg-white/50 backdrop-blur-xl border-b border-white/60 shadow-white/20 shadow-lg' : 'bg-white/8 backdrop-blur-xl border-b border-stone-200/50 shadow-md'} opacity-100` 
                : 'opacity-0'
              }
              transition-all duration-700 ease-out
            `}
          />
          
          {/* Content positioned exactly as before */}
          <header className="fixed top-6 left-6 right-6">
            <Container size={"full"}>
              <Flex justify="between" align="center" className="h-16 px-8">
              {/* Desktop Navigation with logo on left, links on right */}
              <nav className="hidden lg:flex w-full items-center justify-between">
                {/* FIDELIS Logo - Left Side */}
                <div className="flex-shrink-0">
                  <Link to="/" className={`text-2xl font-light tracking-[0.2em] ${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-900 hover:text-stone-700') : 'text-white hover:text-white/80'} transition-all duration-300`}>
                    FIDELIS
                  </Link>
                </div>
                
                {/* Navigation Links - Right Side */}
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => setIsMegamenuOpen(!isMegamenuOpen)}
                    className={`${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-800 hover:text-stone-900') : 'text-white/90 hover:text-white'} text-sm font-normal tracking-wide transition-colors duration-300 flex items-center gap-1`}
                  >
                    Products
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isMegamenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`w-px h-4 ${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'bg-stone-400/60' : 'bg-stone-300/50') : 'bg-white/20'}`}></div>
                  <Link to="/manufacturers" className={`${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-800 hover:text-stone-900') : 'text-white/90 hover:text-white'} text-sm font-normal tracking-wide transition-colors duration-300`}>Manufacturers</Link>
                  <div className={`w-px h-4 ${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'bg-stone-400/60' : 'bg-stone-300/50') : 'bg-white/20'}`}></div>
                  <Link to="/news" className={`${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-800 hover:text-stone-900') : 'text-white/90 hover:text-white'} text-sm font-normal tracking-wide transition-colors duration-300`}>News</Link>
                  <div className={`w-px h-4 ${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'bg-stone-400/60' : 'bg-stone-300/50') : 'bg-white/20'}`}></div>
                  <Link to="/pre-owned" className={`${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-800 hover:text-stone-900') : 'text-white/90 hover:text-white'} text-sm font-normal tracking-wide transition-colors duration-300`}>Pre-Owned</Link>
                  <div className={`w-px h-4 ${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'bg-stone-400/60' : 'bg-stone-300/50') : 'bg-white/20'}`}></div>
                  <Link to="/contact" className={`${hasScrolled || isMegamenuOpen ? (isMegamenuOpen ? 'text-stone-900 hover:text-stone-700' : 'text-stone-800 hover:text-stone-900') : 'text-white/90 hover:text-white'} text-sm font-normal tracking-wide transition-colors duration-300`}>Contact</Link>
                </div>
              </nav>

              {/* Mobile Logo and Menu */}
              <div className="lg:hidden flex items-center justify-between w-full">
                {/* Mobile Logo */}
                <Link to="/" className={`${hasScrolled ? 'text-stone-900 hover:text-stone-700' : 'text-white hover:text-white/80'} text-2xl font-light tracking-[0.2em] transition-all duration-300`}>
                  FIDELIS
                </Link>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`inline-flex items-center justify-center p-2 ${hasScrolled ? 'text-stone-700 hover:text-stone-900' : 'text-white/80 hover:text-white'} focus:outline-none transition-all duration-300`}
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
        </div>
      ) : (
        <div className={`fixed z-50 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Background always present on non-homepage - using homepage "floating" state */}
          <div 
            className={`
              fixed top-0 left-0 right-0 h-[88px]
              ${isMegamenuOpen 
                ? 'bg-white/50 backdrop-blur-xl border-b border-white/60 shadow-white/20 shadow-lg' 
                : 'bg-white/8 backdrop-blur-xl border-b border-stone-200/50 shadow-md'
              }
              transition-all duration-500 ease-out
            `}
          />
          
          {/* Content positioned exactly as homepage */}
          <header className="fixed top-6 left-6 right-6">
            <Container size={"full"}>
              <Flex justify="between" align="center" className="h-16 px-8">
                {/* Desktop Navigation with logo on left, links on right */}
                <nav className="hidden lg:flex w-full items-center justify-between">
                  {/* FIDELIS Logo - Left Side */}
                  <div className="flex-shrink-0">
                    <Link to="/" className="text-2xl font-light tracking-[0.2em] text-stone-900 hover:text-stone-700 transition-all duration-300">
                      FIDELIS
                    </Link>
                  </div>
                  
                  {/* Navigation Links - Right Side */}
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setIsMegamenuOpen(!isMegamenuOpen)}
                      className="text-stone-800 hover:text-stone-900 text-sm font-normal tracking-wide transition-colors duration-300 flex items-center gap-1"
                    >
                      Products
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isMegamenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="w-px h-4 bg-stone-300/50"></div>
                    <Link to="/manufacturers" className="text-stone-800 hover:text-stone-900 text-sm font-normal tracking-wide transition-colors duration-300">Manufacturers</Link>
                    <div className="w-px h-4 bg-stone-300/50"></div>
                    <Link to="/news" className="text-stone-800 hover:text-stone-900 text-sm font-normal tracking-wide transition-colors duration-300">News</Link>
                    <div className="w-px h-4 bg-stone-300/50"></div>
                    <Link to="/pre-owned" className="text-stone-800 hover:text-stone-900 text-sm font-normal tracking-wide transition-colors duration-300">Pre-Owned</Link>
                    <div className="w-px h-4 bg-stone-300/50"></div>
                    <Link to="/contact" className="text-stone-800 hover:text-stone-900 text-sm font-normal tracking-wide transition-colors duration-300">Contact</Link>
                  </div>
                </nav>

                {/* Mobile Logo and Menu */}
                <div className="lg:hidden flex items-center justify-between w-full">
                  {/* Mobile Logo */}
                  <Link to="/" className="text-stone-900 hover:text-stone-700 text-2xl font-light tracking-[0.2em] transition-all duration-300">
                    FIDELIS
                  </Link>
                  
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 text-stone-700 hover:text-stone-900 focus:outline-none transition-all duration-300"
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
        </div>
      )}

      {/* True Full-Screen Mobile Navigation Overlay - Unified smooth transition */}
      <motion.div
        initial={{ 
          opacity: 0,
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)'
        }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          backdropFilter: isMenuOpen ? 'blur(40px)' : 'blur(0px)',
          WebkitBackdropFilter: isMenuOpen ? 'blur(40px)' : 'blur(0px)',
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1]
        }}
        className="lg:hidden fixed inset-0 z-[100] bg-black/30"
        style={{
          backdropFilter: isMenuOpen ? 'blur(40px) saturate(180%)' : 'blur(0px)',
          WebkitBackdropFilter: isMenuOpen ? 'blur(40px) saturate(180%)' : 'blur(0px)'
        }}
      >
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
      
      {/* Megamenu */}
      <Megamenu 
        isOpen={isMegamenuOpen} 
        onClose={() => setIsMegamenuOpen(false)} 
        hasScrolled={hasScrolled || !isHomePage} 
      />
    </>
  );
}; 

// products dropdown removed for now