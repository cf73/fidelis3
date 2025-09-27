import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from './SignIn';
import { Container, Flex, Body, BodySmall } from './ui';
import { motion } from 'framer-motion';
import { getProductCategories } from '../lib/supabase';
import { Megamenu } from './Megamenu';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector('[data-home-hero="main"]') as HTMLElement | null;
    if (!hero) {
      setHasScrolled(false);
      return;
    }

    // Set initial state based on current scroll position
    const rect = hero.getBoundingClientRect();
    const initialScrolled = rect.bottom <= 88;
    setHasScrolled(initialScrolled);

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top+=88',
      onEnter: () => setHasScrolled(true),
      onLeaveBack: () => setHasScrolled(false),
      invalidateOnRefresh: true
    });

    return () => {
      trigger.kill();
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
        <div className={`fixed ${isMenuOpen ? 'z-[110]' : 'z-50'} transition-all duration-500 ease-out`}>
          {/* Glass background appears in place with gentle animation */}
          <div 
            className={`
              fixed top-0 left-0 right-0 h-[88px]
              ${hasScrolled || isMegamenuOpen
                ? `${isMegamenuOpen 
                    ? (hasScrolled 
                        ? 'bg-white/50 backdrop-blur-xl shadow-white/20 shadow-lg' 
                        : 'bg-stone-900/40 backdrop-blur-xl shadow-black/10 shadow-lg'
                      )
                    : 'bg-white/8 backdrop-blur-xl shadow-md'
                  } opacity-100` 
                : 'opacity-0'
              }
              transition-all duration-700 ease-out
            `}
            style={{
              backgroundImage: (hasScrolled || isMegamenuOpen) && !isMenuOpen
                ? (isMegamenuOpen && !hasScrolled
                    ? 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 4px)'
                    : 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
                  )
                : 'none'
            }}
          />
          
          {/* Content positioned exactly as before */}
          <header className="fixed top-6 left-6 right-6">
            <Container size={"full"}>
              <Flex justify="between" align="center" className="h-16 px-8">
              {/* Desktop Navigation with logo on left, links on right */}
              <nav className="hidden lg:flex w-full items-center justify-between">
                {/* FIDELIS Logo - Left Side */}
                <div className="flex-shrink-0">
                  <Link to="/" className={`text-2xl font-light tracking-[0.2em] ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-900 hover:text-stone-700' 
                              : 'text-white hover:text-white/80'
                            )
                          : 'text-stone-900 hover:text-stone-700'
                        )
                      : 'text-white hover:text-white/80'
                  } transition-all duration-300`}>
                    FIDELIS
                  </Link>
                </div>
                
                {/* Navigation Links - Right Side */}
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => setIsMegamenuOpen(!isMegamenuOpen)}
                    className={`${
                      hasScrolled || isMegamenuOpen 
                        ? (isMegamenuOpen 
                            ? (hasScrolled 
                                ? 'text-stone-900 hover:text-stone-700' 
                                : 'text-white/90 hover:text-white'
                              )
                            : 'text-stone-800 hover:text-stone-900'
                          )
                        : 'text-white/90 hover:text-white'
                    } text-sm font-normal tracking-wide transition-colors duration-300 flex items-center gap-1`}
                  >
                    Products
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isMegamenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`w-px h-4 ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled ? 'bg-stone-400/60' : 'bg-white/20')
                          : 'bg-stone-300/50'
                        )
                      : 'bg-white/20'
                  }`}></div>
                  <Link to="/manufacturers" className={`${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-900 hover:text-stone-700' 
                              : 'text-white/90 hover:text-white'
                            )
                          : 'text-stone-800 hover:text-stone-900'
                        )
                      : 'text-white/90 hover:text-white'
                  } text-sm font-normal tracking-wide transition-colors duration-300`}>Manufacturers</Link>
                  <div className={`w-px h-4 ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled ? 'bg-stone-400/60' : 'bg-white/20')
                          : 'bg-stone-300/50'
                        )
                      : 'bg-white/20'
                  }`}></div>
                  <Link to="/news" className={`${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-900 hover:text-stone-700' 
                              : 'text-white/90 hover:text-white'
                            )
                          : 'text-stone-800 hover:text-stone-900'
                        )
                      : 'text-white/90 hover:text-white'
                  } text-sm font-normal tracking-wide transition-colors duration-300`}>News</Link>
                  <div className={`w-px h-4 ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled ? 'bg-stone-400/60' : 'bg-white/20')
                          : 'bg-stone-300/50'
                        )
                      : 'bg-white/20'
                  }`}></div>
                  <Link to="/pre-owned" className={`${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-900 hover:text-stone-700' 
                              : 'text-white/90 hover:text-white'
                            )
                          : 'text-stone-800 hover:text-stone-900'
                        )
                      : 'text-white/90 hover:text-white'
                  } text-sm font-normal tracking-wide transition-colors duration-300`}>Pre-Owned</Link>
                  <div className={`w-px h-4 ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled ? 'bg-stone-400/60' : 'bg-white/20')
                          : 'bg-stone-300/50'
                        )
                      : 'bg-white/20'
                  }`}></div>
                  <Link to="/contact" className={`${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-900 hover:text-stone-700' 
                              : 'text-white/90 hover:text-white'
                            )
                          : 'text-stone-800 hover:text-stone-900'
                        )
                      : 'text-white/90 hover:text-white'
                  } text-sm font-normal tracking-wide transition-colors duration-300`}>Contact</Link>
                </div>
              </nav>

              {/* Mobile Logo and Menu */}
              <div className="lg:hidden flex items-center justify-between w-full">
                {/* Mobile Logo */}
                <Link to="/" className={`${
                  hasScrolled || isMegamenuOpen 
                    ? (isMegamenuOpen 
                        ? (hasScrolled 
                            ? 'text-stone-900 hover:text-stone-700' 
                            : 'text-white hover:text-white/80'
                          )
                        : 'text-stone-900 hover:text-stone-700'
                      )
                    : 'text-white hover:text-white/80'
                } text-2xl font-light tracking-[0.2em] transition-all duration-300`}>
                  FIDELIS
                </Link>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`inline-flex items-center justify-center p-2 ${
                    hasScrolled || isMegamenuOpen 
                      ? (isMegamenuOpen 
                          ? (hasScrolled 
                              ? 'text-stone-700 hover:text-stone-900' 
                              : 'text-white/80 hover:text-white'
                            )
                          : 'text-stone-700 hover:text-stone-900'
                        )
                      : 'text-white/80 hover:text-white'
                  } focus:outline-none transition-all duration-300`}
                >
                  <span className="sr-only">Open main menu</span>
                  <motion.svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      scale: isMenuOpen ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Plus icon that rotates to become X */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </motion.svg>
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
        <div className={`fixed ${isMenuOpen ? 'z-[110]' : 'z-50'} transition-all duration-500 ease-out`}>
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
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
            }}
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
                    <motion.svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{
                        rotate: isMenuOpen ? 45 : 0,
                        scale: isMenuOpen ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                        animate={{
                          d: isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </motion.svg>
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

      {/* Mobile Menu Fade-In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className={`lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[100] ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        } bg-white/50 backdrop-blur-xl`}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(173,196,220,0.08) 1px, rgba(173,196,220,0.08) 2px, transparent 2px, transparent 4px)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0,
            scale: isMenuOpen ? 1 : 0.95
          }}
          transition={{ 
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="relative w-full h-full flex flex-col px-8 pt-32 pb-12"
        >
          {/* Navigation Items */}
          <nav className="flex-1 flex flex-col justify-center">
            {navigationItems.map((item, index) => (
              <React.Fragment key={item.to}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0,
                    y: isMenuOpen ? 0 : 30
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: isMenuOpen ? 0.1 + (index * 0.1) : 0
                  }}
                  className="text-center py-4"
                >
                  <Link
                    to={item.to}
                    className="group inline-block text-3xl font-light tracking-wide text-stone-900 hover:text-stone-700 transition-all duration-500 relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px] inline-block">
                      {item.label}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-900/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                  </Link>
                </motion.div>
                
                {/* Horizontal Divider */}
                {index < navigationItems.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: isMenuOpen ? 1 : 0,
                      scaleX: isMenuOpen ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: isMenuOpen ? 0.2 + (index * 0.1) : 0
                    }}
                    className="w-16 h-px bg-stone-300/50 mx-auto"
                  />
                )}
              </React.Fragment>
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
              delay: isMenuOpen ? 0.7 : 0
            }}
            className="text-center mb-8"
          >
            <Link
              to="/about"
              className="inline-block text-lg font-light tracking-wide text-stone-700 hover:text-stone-900 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </motion.div>

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
              delay: isMenuOpen ? 0.8 : 0
            }}
            className="text-center"
          >
            <p className="text-stone-600 text-sm font-light tracking-wide">
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