import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Section, Container, Grid, Flex, H3, Body, BodySmall } from './ui';
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
  return (
    <footer>
      <Section variant="compact" background="custom" customBackground="bg-stone-900">
        <Container className="text-white">
          <Grid cols={4} gap="lg">
            {/* Brand / About */}
            <div className="col-span-1 md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <H3 className="text-white mb-4">Fidelis Audio</H3>
                <Body className="text-stone-300 max-w-md">Placeholder content</Body>
                <div className="mt-6 space-y-3">
                  <Flex align="center" gap="sm" className="text-stone-300">
                    <MapPinIcon className="h-5 w-5 text-white/80" />
                    <BodySmall className="text-stone-300">Placeholder content</BodySmall>
                  </Flex>
                  <Flex align="center" gap="sm" className="text-stone-300">
                    <PhoneIcon className="h-5 w-5 text-white/80" />
                    <BodySmall className="text-stone-300">Placeholder content</BodySmall>
                  </Flex>
                  <Flex align="center" gap="sm" className="text-stone-300">
                    <EnvelopeIcon className="h-5 w-5 text-white/80" />
                    <BodySmall className="text-stone-300">Placeholder content</BodySmall>
                  </Flex>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <H3 className="text-white mb-4">Quick Links</H3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/products" className="text-stone-300 hover:text-white transition-colors">Products</Link>
                  </li>
                  <li>
                    <Link to="/manufacturers" className="text-stone-300 hover:text-white transition-colors">Manufacturers</Link>
                  </li>
                  <li>
                    <Link to="/news" className="text-stone-300 hover:text-white transition-colors">News</Link>
                  </li>
                  <li>
                    <Link to="/pre-owned" className="text-stone-300 hover:text-white transition-colors">Pre-Owned</Link>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Support */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <H3 className="text-white mb-4">Support</H3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-stone-300 hover:text-white transition-colors">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-stone-300 hover:text-white transition-colors">Contact</Link>
                  </li>
                  <li>
                    <a href="#" className="text-stone-300 hover:text-white transition-colors">Demo Appointments</a>
                  </li>
                  <li>
                    <a href="#" className="text-stone-300 hover:text-white transition-colors">Service & Support</a>
                  </li>
                </ul>
              </motion.div>
            </div>
          </Grid>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-10 pt-6">
            <Flex justify="between" align="center" className="flex-col md:flex-row gap-4">
              <BodySmall className="text-stone-400">© 2024 Fidelis Audio. All rights reserved.</BodySmall>
              <div className="flex items-center gap-6">
                <a href="#" className="text-stone-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-stone-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                {!user ? (
                  <button
                    onClick={() => setIsSignInOpen(true)}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    <Link to="/admin" className="text-stone-400 hover:text-white transition-colors text-sm">Admin</Link>
                    <button onClick={handleSignOut} className="text-stone-400 hover:text-white transition-colors text-sm">Sign Out</button>
                  </>
                )}
              </div>
            </Flex>
          </div>
        </Container>
      </Section>
      <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </footer>
  );
};

export { Footer };