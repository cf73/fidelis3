import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Section, Grid, Container, Flex, H1, H2, H3, H4, Body, BodyLarge, Button } from '../components/ui';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="custom" customBackground="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <H1 className="mb-6 text-white">
              About Fidelis AV
            </H1>
            <BodyLarge className="text-stone-300 max-w-3xl mx-auto">
              Your trusted partner in high-end audio equipment for over two decades
            </BodyLarge>
          </motion.div>
        </Container>
      </Section>

      {/* Story Section */}
      <Section variant="default" background="white">
        <Container>
          <Grid cols={2} gap="xl" className="items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <H2 className="mb-6 text-stone-900">
                Our Story
              </H2>
              <BodyLarge className="text-stone-700 mb-6 leading-relaxed">
                Founded in 2001, Fidelis AV has been at the forefront of high-end audio 
                equipment distribution. We started with a simple mission: to bring the 
                world's finest audio equipment to discerning listeners who demand nothing 
                but the best.
              </BodyLarge>
              <BodyLarge className="text-stone-700 mb-6 leading-relaxed">
                Over the years, we've built relationships with the most respected 
                manufacturers in the industry, allowing us to offer an unparalleled 
                selection of speakers, amplifiers, DACs, and accessories. Our team of 
                audio experts is passionate about helping you find the perfect system 
                for your listening space and musical preferences.
              </BodyLarge>
              <BodyLarge className="text-stone-700 leading-relaxed">
                We believe that great audio should be accessible to everyone who 
                appreciates it. That's why we offer personalized consultations, 
                in-home demonstrations, and ongoing support to ensure your audio 
                journey is nothing short of extraordinary.
              </BodyLarge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-stone-600 to-stone-700 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <H3 className="mb-4 text-white">20+ Years of Excellence</H3>
                  <BodyLarge className="text-stone-200">
                    Serving audio enthusiasts with the finest equipment and expertise
                  </BodyLarge>
                </div>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Values Section */}
      <Section variant="default" background="stone-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <H2 className="mb-4 text-stone-900">
              Our Values
            </H2>
            <BodyLarge className="text-stone-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </BodyLarge>
          </motion.div>

          <Grid cols={3} gap="lg">
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
                className="p-8 text-center bg-white rounded-xl shadow-sm"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <H3 className="mb-4 text-stone-900">
                  {value.title}
                </H3>
                <Body className="text-stone-600">
                  {value.description}
                </Body>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Contact Info */}
      <Section variant="default" background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <H2 className="mb-4 text-stone-900">
              Visit Us
            </H2>
            <BodyLarge className="text-stone-600 max-w-2xl mx-auto">
              Experience our showroom and discover the difference quality audio makes
            </BodyLarge>
          </motion.div>

          <Grid cols={2} gap="xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <H3 className="mb-6 text-stone-900">
                Showroom Information
              </H3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-6 w-6 text-stone-600 mt-1" />
                  <div>
                    <H4 className="text-stone-900">Address</H4>
                    <Body className="text-stone-600">123 Audio Lane<br />Cambridge, MA 02139</Body>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="h-6 w-6 text-stone-600 mt-1" />
                  <div>
                    <H4 className="text-stone-900">Phone</H4>
                    <Body className="text-stone-600">(617) 555-0123</Body>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="h-6 w-6 text-stone-600 mt-1" />
                  <div>
                    <H4 className="text-stone-900">Email</H4>
                    <Body className="text-stone-600">marc@fidelisav.com</Body>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <ClockIcon className="h-6 w-6 text-stone-600 mt-1" />
                  <div>
                    <H4 className="text-stone-900">Hours</H4>
                    <Body className="text-stone-600">
                      Tuesday - Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 12:00 PM - 5:00 PM<br />
                      Monday: Closed
                    </Body>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H3 className="mb-6 text-stone-900">
                Services
              </H3>
              <div className="space-y-4">
                <div className="bg-stone-50 p-4 rounded-xl">
                  <H4 className="text-stone-900 mb-2">
                    In-Home Demonstrations
                  </H4>
                  <Body className="text-stone-600">
                    We bring the equipment to you for a personalized listening experience.
                  </Body>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl">
                  <H4 className="text-stone-900 mb-2">
                    System Design
                  </H4>
                  <Body className="text-stone-600">
                    Expert consultation to design the perfect audio system for your space.
                  </Body>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl">
                  <H4 className="text-stone-900 mb-2">
                    Installation & Setup
                  </H4>
                  <Body className="text-stone-600">
                    Professional installation and calibration services for optimal performance.
                  </Body>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl">
                  <H4 className="text-stone-900 mb-2">
                    Ongoing Support
                  </H4>
                  <Body className="text-stone-600">
                    Continuous support and maintenance to keep your system performing at its best.
                  </Body>
                </div>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  );
};

export default About; 