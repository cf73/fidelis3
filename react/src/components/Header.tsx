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

            {/* Auth and Mobile Menu */}
            <Flex gap="md" align="center">
              {/* Auth Button */}
              {/* Sign in temporarily removed per request */}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-white/40 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500/50 transition-all duration-300"
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
            </Flex>
          </Flex>

          {/* Mobile Navigation */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden border-t border-white/30 mx-6`}>
            <div className="py-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-stone-800 hover:text-stone-900 block px-4 py-2.5 rounded-xl text-base font-medium hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </header>

      {/* Sign In Modal */}
      <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}; 

// products dropdown removed for now