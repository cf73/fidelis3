import React from 'react';
import { motion } from 'framer-motion';

export const DesignExploration: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-12 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light text-stone-900 tracking-wide">
              Fidelis AV
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12">
        {/* Hero Section */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-9xl font-light text-stone-900 leading-none mb-12 tracking-tight">
              Records "R" Us
              <br />
              <span className="text-stone-400">New Arrivals</span>
            </h2>
            <p className="text-2xl text-stone-600 max-w-3xl leading-relaxed mb-16 font-light">
              We just acquired a large batch of records - great titles in premium condition - come check them out before they are gone!
            </p>
            <motion.button 
              className="px-12 py-6 bg-stone-900 text-stone-100 font-light text-xl border border-stone-900 hover:bg-stone-800 transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Shop Records →
            </motion.button>
          </motion.div>
        </section>

        {/* Brand Showcase */}
        <section className="py-24 border-t border-stone-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center items-center space-x-16 opacity-60">
              <span className="text-stone-400 text-lg font-light tracking-wide">McIntosh</span>
              <span className="text-stone-400 text-lg font-light tracking-wide">Accuphase</span>
              <span className="text-stone-400 text-lg font-light tracking-wide">Harbeth</span>
              <span className="text-stone-400 text-lg font-light tracking-wide">Acora Acoustics</span>
              <span className="text-stone-400 text-lg font-light tracking-wide">MSB Technology</span>
            </div>
          </motion.div>
        </section>

        {/* Featured Systems */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-6xl font-light text-stone-900 tracking-tight">
                Featured
                <br />
                <span className="text-stone-400">systems</span>
              </h3>
              <motion.button 
                className="px-8 py-4 bg-transparent text-stone-600 font-light text-lg border border-stone-300 hover:bg-stone-100 transition-all duration-300 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View all →
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* System Card 1 */}
              <motion.div 
                className="bg-stone-100 p-12 border border-stone-200 rounded-xl cursor-pointer"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h4 className="text-3xl font-light text-stone-900 mb-4 tracking-wide">
                    Harbeth P3ESR
                  </h4>
                  <p className="text-stone-600 text-lg font-light">
                    Category: Monitor Speakers
                  </p>
                </div>
                <div className="h-64 mb-8 flex items-center justify-center rounded-lg overflow-hidden">
                  <img 
                    src="/assets/harbeth-p3esr-xd-olive-ash-2-1608359733.jpeg" 
                    alt="Harbeth P3ESR XD Monitor Speakers"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-600 text-sm font-light">
                    The legendary British monitor speaker, tuned to perfection
                  </p>
                  <motion.div 
                    className="w-8 h-8 border border-stone-300 flex items-center justify-center rounded-md"
                    whileHover={{ scale: 1.1, backgroundColor: "rgb(245 245 244)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-stone-400 text-sm">→</span>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* System Card 2 */}
              <motion.div 
                className="bg-stone-100 p-12 border border-stone-200 rounded-xl cursor-pointer"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h4 className="text-3xl font-light text-stone-900 mb-4 tracking-wide">
                    Accuphase E-4000
                  </h4>
                  <p className="text-stone-600 text-lg font-light">
                    Category: Integrated Amplifiers
                  </p>
                </div>
                <div className="h-64 mb-8 flex items-center justify-center rounded-lg overflow-hidden">
                  <img 
                    src="/assets/e-4000-1703776507.jpg" 
                    alt="Accuphase E-4000 Integrated Amplifier"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-600 text-sm font-light">
                    Enrich life through technology
                  </p>
                  <motion.div 
                    className="w-8 h-8 border border-stone-300 flex items-center justify-center rounded-md"
                    whileHover={{ scale: 1.1, backgroundColor: "rgb(245 245 244)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-stone-400 text-sm">→</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Design Philosophy */}
        <section className="py-24 border-t border-stone-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-6xl font-light text-stone-900 mb-16 text-center tracking-tight">
              Our philosophy is driven by
              <br />
              <span className="text-stone-400 italic">quality, craftsmanship, and passion</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-24">
              <motion.div 
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-stone-200 mx-auto mb-8 flex items-center justify-center rounded-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "rgb(230 230 230)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-stone-600 text-2xl">♪</span>
                </motion.div>
                <h4 className="text-2xl font-light text-stone-900 mb-4 tracking-wide">
                  Quality
                </h4>
                <p className="text-stone-600 text-lg leading-relaxed font-light">
                  Every component is hand-picked and screened for quality, first through meticulous measurement, and then by thousands of hours of extensive listening.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-stone-200 mx-auto mb-8 flex items-center justify-center rounded-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "rgb(230 230 230)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-stone-600 text-2xl">⚡</span>
                </motion.div>
                <h4 className="text-2xl font-light text-stone-900 mb-4 tracking-wide">
                  Craftsmanship
                </h4>
                <p className="text-stone-600 text-lg leading-relaxed font-light">
                  Products designed and handcrafted by dedicated employees who share a passion for music and heritage.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-stone-200 mx-auto mb-8 flex items-center justify-center rounded-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "rgb(230 230 230)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-stone-600 text-2xl">❤</span>
                </motion.div>
                <h4 className="text-2xl font-light text-stone-900 mb-4 tracking-wide">
                  Passion
                </h4>
                <p className="text-stone-600 text-lg leading-relaxed font-light">
                  We're music lovers too. We know that when it comes to audio performance, nothing short of perfection will do.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-6xl font-light text-stone-900 mb-16 tracking-tight">
              News from
              <br />
              <span className="text-stone-400">Fidelis</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                className="h-96 flex items-center justify-center rounded-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="/assets/Accuphase-E-5000-Stereo-Integrated-Amplifier-image-10.webp" 
                  alt="Accuphase E-5000 Stereo Integrated Amplifier"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div>
                <div className="mb-8">
                  <h4 className="text-2xl font-light text-stone-900 mb-2 tracking-wide">
                    News Flash
                  </h4>
                  <p className="text-stone-600 text-lg font-light">
                    Pre-Holiday Season Clearance Sale Underway!
                  </p>
                </div>
                
                <blockquote className="text-xl text-stone-700 leading-relaxed mb-8 font-light">
                  "We have just received the largest assortment of consignment pre-owned gear in the 23 year history of Fidelis, including a variety of high-end speakers, amps, preamps, phono cartridges, and a recently procured record collection in excess of 2000 titles."
                </blockquote>
                
                <p className="text-stone-600 text-lg font-light">
                  Substantial savings on demo equipment with full warranty.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="py-24 border-t border-stone-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-stone-900 p-16 text-center rounded-xl"
          >
            <motion.div 
              className="w-20 h-20 bg-stone-100 mx-auto mb-8 flex items-center justify-center rounded-lg"
              whileHover={{ scale: 1.1, backgroundColor: "rgb(230 230 230)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-stone-900 text-3xl">♪</span>
            </motion.div>
            
            <h3 className="text-5xl font-light text-stone-100 mb-6 tracking-tight">
              Experience the
              <br />
              <span className="text-stone-300 italic">legendary performance</span>
            </h3>
            
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto font-light">
              Visit our showroom to audition the finest high-end audio systems and discover what's possible in your space.
            </p>
            
            <motion.button 
              className="px-12 py-6 bg-stone-100 text-stone-900 font-light text-xl border border-stone-100 hover:bg-stone-200 transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Schedule Demo →
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}; 