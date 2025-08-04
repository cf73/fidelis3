import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 text-white">
        <div className="container-custom py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Fidelis AV
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in high-end audio equipment for over two decades
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 2001, Fidelis AV has been at the forefront of high-end audio 
                equipment distribution. We started with a simple mission: to bring the 
                world's finest audio equipment to discerning listeners who demand nothing 
                but the best.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Over the years, we've built relationships with the most respected 
                manufacturers in the industry, allowing us to offer an unparalleled 
                selection of speakers, amplifiers, DACs, and accessories. Our team of 
                audio experts is passionate about helping you find the perfect system 
                for your listening space and musical preferences.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that great audio should be accessible to everyone who 
                appreciates it. That's why we offer personalized consultations, 
                in-home demonstrations, and ongoing support to ensure your audio 
                journey is nothing short of extraordinary.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-2xl font-bold mb-4">20+ Years of Excellence</h3>
                  <p className="text-lg">
                    Serving audio enthusiasts with the finest equipment and expertise
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Excellence",
                description: "We never compromise on quality, offering only the finest audio equipment from world-renowned manufacturers."
              },
              {
                icon: "🤝",
                title: "Trust",
                description: "Building lasting relationships with our customers through honest advice and exceptional service."
              },
              {
                icon: "🎵",
                title: "Passion",
                description: "Our love for music drives everything we do, from product selection to customer support."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Visit Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience our showroom and discover the difference quality audio makes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-primary-900 mb-6">
                Showroom Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-6 w-6 text-accent-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary-900">Address</h4>
                    <p className="text-gray-600">123 Audio Lane<br />Cambridge, MA 02139</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="h-6 w-6 text-accent-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary-900">Phone</h4>
                    <p className="text-gray-600">(617) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="h-6 w-6 text-accent-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary-900">Email</h4>
                    <p className="text-gray-600">info@fidelisav.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <ClockIcon className="h-6 w-6 text-accent-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary-900">Hours</h4>
                    <p className="text-gray-600">
                      Tuesday - Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 12:00 PM - 5:00 PM<br />
                      Monday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-primary-900 mb-6">
                Services
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    In-Home Demonstrations
                  </h4>
                  <p className="text-gray-600">
                    We bring the equipment to you for a personalized listening experience.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    System Design
                  </h4>
                  <p className="text-gray-600">
                    Expert consultation to design the perfect audio system for your space.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    Installation & Setup
                  </h4>
                  <p className="text-gray-600">
                    Professional installation and calibration services for optimal performance.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    Ongoing Support
                  </h4>
                  <p className="text-gray-600">
                    Continuous support and maintenance to keep your system performing at its best.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 