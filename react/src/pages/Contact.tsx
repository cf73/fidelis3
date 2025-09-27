import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';
import { TestimonialsSection } from '../components/TestimonialsSection';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const product = searchParams.get('product');
    const manufacturer = searchParams.get('manufacturer');
    const demo = searchParams.get('demo');
    const urlSubject = searchParams.get('subject');
    const urlMessage = searchParams.get('message');
    
    if (product && demo === 'store') {
      const productWithManufacturer = manufacturer ? `${manufacturer} ${product}` : product;
      setFormData({
        name: '',
        email: '',
        subject: `Store Demo Request: ${productWithManufacturer}`,
        message: `I would like to schedule a store demo for the ${productWithManufacturer}. Please let me know what times are available.`
      });
    } else if (urlSubject || urlMessage) {
      // Handle general subject/message URL parameters
      setFormData(prev => ({
        ...prev,
        subject: urlSubject || prev.subject,
        message: urlMessage || prev.message
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="custom" customBackground="bg-warm-beige" className="-mt-4">
        <Container size="6xl">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-stone-900 leading-tight tracking-wide mb-6">Contact Us</h1>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
              Get in touch with us for any questions about our products or services. We're here to help you find the perfect audio solution.
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Content */}
      <Section variant="default" background="white">
        <Container size="6xl">
          <div className="max-w-4xl mx-auto">
            <Grid cols={2} gap="xl">
              {/* Contact Information */}
              <div>
                <H2 className="mb-6">Get in Touch</H2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-stone-900">Address</p>
                      <p className="text-sm text-stone-600">460 Amherst Street<br />Nashua, NH 03063</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-stone-900">Phone</p>
                      <p className="text-sm text-stone-600">603-880-4434</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-stone-900">Email</p>
                      <p className="text-sm text-stone-600">marc@fidelisav.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-stone-900">Hours</p>
                      <p className="text-sm text-stone-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <H2 className="mb-6">Send us a Message</H2>
                
                 <form className="space-y-4" action="https://formsubmit.co/conrad.fulbrook@gmail.com" method="POST">
                  <input type="hidden" name="_subject" value="Website Contact Form" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                   <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 px-6 font-medium tracking-wide hover:bg-stone-800 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection className="bg-stone-50" />

      {/* About Fidelis Section */}
      <Section variant="default" background="white">
        <Container size="6xl">
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">About Fidelis</H2>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
              <p className="mb-6">
                As America's premiere importer of high-end audio gear, we source and import the world's finest equipment directly from manufacturers. What you'll find here comes from decades of relationships with the most respected names in audio, sold through our New Hampshire store and distributed nationwide through our dealer network.
              </p>
              <p className="mb-6">
                In a world of warehouses and return policies that don't support manufacturers, we believe in curation, guidance, and real service. Every recommendation comes from hands-on experience with the gear, not algorithms or sales targets. We're here to help you navigate choices that matter, backed by expertise you can trust.
              </p>
              <p>
                We host listening events, maintain one of New England's finest record collections, and believe the best audio discoveries happen through conversation. Come by the store, bring your favorite music, and experience the difference that genuine expertise and passion make.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Showroom Section */}
      <Section variant="default" background="stone-50">
        <Container size="6xl">
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-6">Visit Our Showroom</H2>
            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
              <iframe
                title="Fidelis Location"
                src="https://www.google.com/maps?q=460+Amherst+Street,+Nashua,+NH+03063&output=embed"
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Body className="mt-4 text-stone-600">
              We welcome visitors to our showroom where you can experience our products firsthand. 
              Please call ahead to schedule an appointment for a personalized demonstration.
            </Body>
          </div>
        </Container>
      </Section>
    </div>
  );
}; 