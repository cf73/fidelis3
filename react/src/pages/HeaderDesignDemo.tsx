import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Flex, H1, H2, Body } from '../components/ui';

export const HeaderDesignDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/manufacturers', label: 'Manufacturers' },
    { to: '/pre-owned', label: 'Pre-Owned' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'About' }
  ];

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Demo Message */}
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
        <Body className="text-white text-sm">
          Option 1 has been implemented in the main Header component.<br/>
          <Link to="/" className="text-amber-300 hover:text-amber-200 underline">← Return to main site</Link>
        </Body>
      </div>

      {/* Hero Background */}
      <div className="relative h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
          }}
        />
        
        {/* Option 1: Subtle Glass Bar */}
        {(activeDemo === 1 || activeDemo === null) && (
          <header 
            className="fixed top-6 z-40"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 3rem)',
              maxWidth: '1200px'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              className="px-8 py-4"
            >
              <Flex justify="between" align="center">
                <nav className="hidden lg:flex items-center gap-8">
                  <Link to="/news" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">News</Link>
                  <div className="w-px h-4 bg-white/20"></div>
                  <Link to="/products" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">Products</Link>
                  <div className="w-px h-4 bg-white/20"></div>
                  <Link to="/manufacturers" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">Manufacturers</Link>
                </nav>
                
                <Link to="/" className="text-2xl font-light tracking-[0.2em] text-white">FIDELIS</Link>
                
                <nav className="hidden lg:flex items-center gap-8">
                  <Link to="/pre-owned" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">Pre-Owned</Link>
                  <div className="w-px h-4 bg-white/20"></div>
                  <Link to="/contact" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">Contact</Link>
                  <div className="w-px h-4 bg-white/20"></div>
                  <Link to="/about" className="text-white/90 hover:text-white text-sm font-normal tracking-wide transition-colors">About</Link>
                </nav>
                
                <button className="lg:hidden text-white">☰</button>
              </Flex>
            </div>
            {activeDemo === null && (
              <div className="absolute -bottom-8 left-4 bg-amber-500 text-amber-900 px-3 py-1 rounded text-xs font-medium">
                Option 1: Subtle Glass Bar
              </div>
            )}
          </header>
        )}

        {/* Option 2: Minimal Borderless */}
        {(activeDemo === 2 || activeDemo === null) && (
          <header 
            className="fixed z-40"
            style={{
              top: activeDemo === null ? '120px' : '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 3rem)',
              maxWidth: '1200px'
            }}
          >
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
              }}
              className="px-8 py-5"
            >
              <Flex justify="between" align="center">
                <nav className="hidden lg:flex items-center gap-12">
                  <Link to="/news" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">News</Link>
                  <Link to="/products" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">Products</Link>
                  <Link to="/manufacturers" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">Manufacturers</Link>
                </nav>
                
                <Link to="/" className="text-2xl font-extralight tracking-[0.3em] text-white/95">Fidelis</Link>
                
                <nav className="hidden lg:flex items-center gap-12">
                  <Link to="/pre-owned" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">Pre-Owned</Link>
                  <Link to="/contact" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">Contact</Link>
                  <Link to="/about" className="text-white/80 hover:text-white text-sm font-light tracking-[0.05em] transition-all duration-300">About</Link>
                </nav>
                
                <button className="lg:hidden text-white/80">☰</button>
              </Flex>
            </div>
            {activeDemo === null && (
              <div className="absolute -bottom-8 left-4 bg-amber-500 text-amber-900 px-3 py-1 rounded text-xs font-medium">
                Option 2: Minimal Borderless
              </div>
            )}
          </header>
        )}

        {/* Option 3: Refined Edge-to-Edge */}
        {(activeDemo === 3 || activeDemo === null) && (
          <header 
            className="fixed z-40 left-0 right-0"
            style={{
              top: activeDemo === null ? '210px' : '0px'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(41, 37, 36, 0.95), rgba(68, 64, 60, 0.92))',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
                boxShadow: '0 1px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Container>
                <div className="px-8 py-6">
                  <Flex justify="between" align="center">
                    <nav className="hidden lg:flex items-center gap-10">
                      <Link to="/news" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        News
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/products" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        Products
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/manufacturers" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        Manufacturers
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </nav>
                    
                    <Link to="/" className="text-3xl font-light tracking-[0.15em] text-amber-100 hover:text-amber-200 transition-colors">
                      Fidelis Audio
                    </Link>
                    
                    <nav className="hidden lg:flex items-center gap-10">
                      <Link to="/pre-owned" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        Pre-Owned
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/contact" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/about" className="text-stone-200 hover:text-amber-300 text-sm font-medium tracking-wide transition-all duration-300 relative group">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </nav>
                    
                    <button className="lg:hidden text-stone-200">☰</button>
                  </Flex>
                </div>
              </Container>
            </div>
            {activeDemo === null && (
              <div className="absolute top-full left-4 bg-amber-500 text-amber-900 px-3 py-1 rounded text-xs font-medium mt-2">
                Option 3: Refined Edge-to-Edge
              </div>
            )}
          </header>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-8">
            <H1 className="text-6xl font-light tracking-wide mb-6 text-white">
              Header Design Options
            </H1>
            <Body className="text-xl text-white/80 font-light leading-relaxed">
              Three approaches to refining the floating header design for better alignment with the Fidelis Audio aesthetic.
              Use the controls in the top-right to toggle between individual options or view all simultaneously.
            </Body>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <H2 className="mb-6">Option 1: Subtle Glass Bar</H2>
              <Body className="text-stone-600 leading-relaxed">
                A refined floating bar with minimal rounded corners and elegant dividers between navigation sections. 
                Uses subtle glass morphism with backdrop blur for a sophisticated, architectural feel. 
                The typography is clean and spaced for premium audio aesthetic.
              </Body>
            </div>
            
            <div>
              <H2 className="mb-6">Option 2: Minimal Borderless</H2>
              <Body className="text-stone-600 leading-relaxed">
                Clean, borderless design that relies purely on backdrop blur and typography hierarchy. 
                Inspired by high-end audio equipment interfaces with maximum focus on content and minimal chrome. 
                Extra light typography with careful spacing creates a premium, uncluttered experience.
              </Body>
            </div>
            
            <div>
              <H2 className="mb-6">Option 3: Refined Edge-to-Edge</H2>
              <Body className="text-stone-600 leading-relaxed">
                Full-width header with sophisticated color palette aligned with your stone/amber theme. 
                Features subtle gradient backgrounds, amber accent colors, and elegant hover animations. 
                More substantial presence while maintaining the premium audio equipment aesthetic.
              </Body>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
