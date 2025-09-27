import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

interface TestimonialsSectionProps {
  className?: string;
}

// Static Google reviews data - update these with your actual Google reviews
const googleReviews: GoogleReview[] = [
  {
    id: '1',
    author: 'John Smith',
    rating: 5,
    text: 'Outstanding service and incredible selection of high-end audio equipment. Marc and his team really know their stuff and helped me find the perfect system for my listening room. The sound quality is absolutely phenomenal!',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2', 
    author: 'Sarah Johnson',
    rating: 5,
    text: 'Fidelis Audio is a gem! Their expertise in high-end audio is unmatched. They took the time to understand my needs and budget, and the system they recommended exceeded all my expectations. Highly recommend!',
    date: '2024-01-08',
    verified: true
  },
  {
    id: '3',
    author: 'Michael Chen',
    rating: 5,
    text: 'Been a customer for years and they never disappoint. The showroom is amazing - you can really hear the difference in their carefully curated equipment. Great service, fair prices, and they stand behind everything they sell.',
    date: '2023-12-22',
    verified: true
  },
  {
    id: '4',
    author: 'David Wilson',
    rating: 5,
    text: 'Professional, knowledgeable, and passionate about audio. They helped me upgrade my turntable setup and the improvement in sound quality is remarkable. This is where serious audiophiles shop!',
    date: '2023-12-10',
    verified: true
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{ review: GoogleReview; index: number }> = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
            <span className="text-stone-600 font-medium text-sm">
              {review.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-stone-900">{review.author}</h4>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              {review.verified && (
                <span className="text-xs text-green-600 font-medium">Verified</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-stone-500">
          {new Date(review.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Review text */}
      <p className="text-stone-700 leading-relaxed">{review.text}</p>

      {/* Google logo */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-xs text-stone-500">Google Review</span>
      </div>
    </motion.div>
  );
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const averageRating = googleReviews.reduce((sum, review) => sum + review.rating, 0) / googleReviews.length;
  
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-light text-stone-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-lg font-medium text-stone-900">
              {averageRating.toFixed(1)} out of 5
            </span>
            <span className="text-stone-600">
              ({googleReviews.length} Google Reviews)
            </span>
          </div>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience with Fidelis Audio.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {googleReviews.map((review, index) => (
            <TestimonialCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-stone-600 mb-4">
            Experience the Fidelis difference for yourself
          </p>
          <a
            href="https://www.google.com/search?hl=en-US&gl=us&q=Fidelis+Home+Audio,+460+Amherst+St,+Nashua,+NH+03063&ludocid=12583431702885382907&lsig=AB86z5Uz_kfdKoPw5LxkANTU8WN6&hl=en&gl=US#lrd=0x89e2530521a5e453:0xaea15476c1df3afb,1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Read More Reviews on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
};
