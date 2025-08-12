import React, { useState } from 'react';
import { Product, Review } from '../lib/supabase';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  // Parse reviews if they come as a JSON string
  const parseReviews = (reviews: any): Review[] => {
    if (!reviews) return [];
    if (Array.isArray(reviews)) return reviews;
    if (typeof reviews === 'string') {
      try {
        const parsed = JSON.parse(reviews);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Premium Tab Navigation */}
      <div className="border-b border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100">
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'description' | 'specs' | 'reviews')}
              className={`flex-1 flex items-center justify-center space-x-2 py-6 px-4 font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-stone-900 bg-white border-b-2 border-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Premium Tab Content */}
      <div className="p-8 lg:p-12">
        {activeTab === 'description' && (
          <div className="prose prose-stone max-w-none">
            {product.content ? (
              <div className="text-lg leading-relaxed text-stone-700 space-y-6">
                <div dangerouslySetInnerHTML={{ __html: product.content }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">No Description Available</h3>
                <p className="text-stone-600">Product description will be added soon.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="prose prose-stone max-w-none">
            {product.specs ? (
              <div className="text-lg leading-relaxed text-stone-700 space-y-6">
                <div dangerouslySetInnerHTML={{ __html: product.specs }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">No Specifications Available</h3>
                <p className="text-stone-600">Technical specifications will be added soon.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {reviews.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-light text-stone-900 mb-2">What the critics say</h3>
                  <p className="text-stone-600">Expert reviews and professional opinions</p>
                </div>
                
                {reviews.map((review: Review, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-8 border border-stone-200">
                    {review.excerpt && (
                      <div className="mb-6">
                        <div className="text-xl text-stone-700 italic leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: review.excerpt }} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {review.attribution && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-stone-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="font-medium text-stone-900">{review.attribution}</span>
                          </div>
                        )}
                        
                        {review.date_of_review && (
                          <span className="text-sm text-stone-500">
                            {new Date(review.date_of_review).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                      
                      {review.link && (
                        <a
                          href={review.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors duration-200 text-sm font-medium"
                        >
                          <span>Read full review</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">No Reviews Available</h3>
                <p className="text-stone-600">Professional reviews will be added as they become available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 