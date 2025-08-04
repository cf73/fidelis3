import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our audio experts for personalized assistance
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Interest
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="speakers">Speakers</option>
                  <option value="amplifiers">Amplifiers</option>
                  <option value="dacs">DACs</option>
                  <option value="turntables">Turntables</option>
                  <option value="cables">Cables</option>
                  <option value="demo">Demo Appointment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Tell us about your audio needs..."
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-accent-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-900">Visit Our Showroom</h3>
                  <p className="text-gray-600">
                    123 Audio Lane<br />
                    Cambridge, MA 02139
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-accent-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-900">Call Us</h3>
                  <p className="text-gray-600">(617) 555-0123</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-accent-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-900">Email Us</h3>
                  <p className="text-gray-600">info@fidelisav.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <ClockIcon className="h-6 w-6 text-accent-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-900">Business Hours</h3>
                  <p className="text-gray-600">
                    Tuesday - Saturday: 10:00 AM - 6:00 PM<br />
                    Sunday: 12:00 PM - 5:00 PM<br />
                    Monday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                Our Services
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  <span className="text-gray-700">In-home demonstrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  <span className="text-gray-700">System design consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  <span className="text-gray-700">Professional installation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  <span className="text-gray-700">Ongoing support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 