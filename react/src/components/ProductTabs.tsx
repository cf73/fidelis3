import React, { useState } from 'react';
import { Product, Review } from '../lib/supabase';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  // Parse reviews from Statamic structure
  const parseReviews = (reviews: any): Review[] => {
    if (!reviews) return [];
    
    if (typeof reviews === 'string') {
      try {
        const parsed = JSON.parse(reviews);
        return parseReviews(parsed);
      } catch {
        return [];
      }
    }
    
    if (Array.isArray(reviews)) {
      return reviews.map(review => {
        // Extract the actual content from nested Statamic structure
        let excerptText = '';
        if (review.excerpt && Array.isArray(review.excerpt)) {
          // Look for paragraph content in the excerpt array
          review.excerpt.forEach((item: any) => {
            if (item.type === 'paragraph' && item.content && Array.isArray(item.content)) {
              item.content.forEach((textItem: any) => {
                if (textItem.type === 'text' && textItem.text) {
                  excerptText += textItem.text + ' ';
                }
              });
            }
          });
        }
        
        return {
          ...review,
          excerpt: excerptText.trim() || review.excerpt || ''
        };
      });
    }
    
    return [];
  };

  const reviews = parseReviews(product.reivews_set);

  const tabs = [
    { 
      id: 'description', 
      label: 'Description', 
      content: product.content,
      hasContent: !!product.content,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'specs', 
      label: 'Specifications', 
      content: product.specs,
      hasContent: !!product.specs,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      id: 'reviews', 
      label: 'Reviews', 
      content: reviews,
      hasContent: reviews.length > 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  // Determine initial active tab - prefer description if it has content, otherwise first tab with content
  const getInitialActiveTab = () => {
    if (product.content) return 'description';
    if (product.specs) return 'specs';
    if (reviews.length > 0) return 'reviews';
    return 'description'; // fallback
  };

  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>(getInitialActiveTab());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex min-h-[400px]">
        {/* Clean Vertical Tab Navigation */}
        <div className="w-48 flex flex-col mr-16">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'description' | 'specs' | 'reviews')}
                className={`py-6 text-left transition-all duration-300 relative group cursor-pointer ${
                  isActive 
                    ? 'text-stone-900' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                {/* Just Icon and Label */}
                <div className="flex items-center space-x-3">
                  <div className={`transition-all duration-300 transform ${
                    isActive 
                      ? 'text-stone-700' 
                      : 'text-stone-400 group-hover:text-stone-600 group-hover:scale-110'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className={`text-base font-medium tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'text-stone-900' 
                      : 'text-stone-600 group-hover:text-stone-800 group-hover:tracking-wider'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                
                {/* Active State Underline */}
                {isActive && (
                  <div className="absolute bottom-2 left-0 right-0 h-px bg-stone-400 transition-all duration-300" />
                )}
                
                {/* Hover State Underline Preview */}
                {!isActive && (
                  <div className="absolute bottom-2 left-0 right-0 h-px bg-stone-300 transition-all duration-300 transform scale-x-0 group-hover:scale-x-75 origin-left" />
                )}
              </button>
            );
          })}
        </div>

        {/* Clean Vertical Divider */}
        <div className="relative mr-16">
          <div className="absolute inset-y-0 left-0 w-px bg-stone-300"></div>
        </div>

        {/* Content Area - Flat on page */}
        <div className="flex-1">
          {activeTab === 'description' && (
            <div>
              {product.content ? (
                <div className="prose prose-lg prose-stone max-w-none">
                  <div className="text-base leading-relaxed text-stone-700 space-y-6">
                    <div dangerouslySetInnerHTML={{ __html: product.content }} />
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-stone-500 italic">Product description will be available soon.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              {product.specs ? (
                <div className="text-base leading-relaxed text-stone-700">
                  <div dangerouslySetInnerHTML={{ __html: product.specs }} />
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-stone-500 italic">Technical specifications will be available soon.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-12">
                  {reviews.map((review: Review, index: number) => (
                    <div key={index} className="relative">
                      {review.excerpt && (
                        <blockquote className="text-lg font-light italic text-stone-800 mb-6 leading-relaxed">
                          "{review.excerpt}"
                        </blockquote>
                      )}
                      <div className="flex items-center space-x-6 text-stone-600">
                        {review.attribution && (
                          <cite className="text-base font-medium not-italic text-stone-700">
                            {review.attribution}
                          </cite>
                        )}
                        {review.date_of_review && (
                          <>
                            <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
                            <span className="text-stone-500 text-sm">
                              {new Date(review.date_of_review).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </>
                        )}
                        {review.link && (
                          <a
                            href={review.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors duration-200 text-sm font-light"
                          >
                            <span>Read Full Review</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-stone-500 italic">Professional reviews will be available soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};