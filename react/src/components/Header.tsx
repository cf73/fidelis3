import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from './SignIn';
import { Container, Flex, Body, BodySmall } from './ui';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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
          ${hasScrolled 
            ? 'left-1/2 transform -translate-x-1/2 w-[calc(100%-4rem)] max-w-6xl shadow-2xl' 
            : 'left-0 right-0 w-full'
          }
          bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl 
        `}
      >
        <Container size={hasScrolled ? "lg" : "full"}>
          <Flex justify="between" align="center" className="h-16 px-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-light tracking-wide text-stone-900 hover:text-stone-700 transition-colors duration-300 drop-shadow-sm"
              >
                Fidelis
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex">
              <Flex gap="lg" align="center">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-stone-800 hover:text-stone-900 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-sm drop-shadow-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </Flex>
            </nav>

            {/* Auth and Mobile Menu */}
            <Flex gap="md" align="center">
              {/* Auth Button */}
              {user ? (
                <Flex gap="md" align="center">
                  <BodySmall className="text-stone-800 drop-shadow-sm">
                    Welcome, {user.email}
                  </BodySmall>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </Flex>
              ) : (
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="bg-stone-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800/90 focus:outline-none focus:ring-2 focus:ring-stone-500/50 focus:ring-offset-2 transition-all duration-300"
                >
                  Sign In
                </button>
              )}

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
                  className="text-stone-800 hover:text-stone-900 block px-4 py-2.5 rounded-xl text-base font-medium hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-300 drop-shadow-sm"
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