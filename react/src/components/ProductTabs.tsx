import React, { useState } from 'react';

import { Product } from '../lib/supabase';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const tabs = [
    { id: 'description', label: 'Description', content: product.content },
    { id: 'specs', label: 'Specs', content: product.specs },
    { id: 'reviews', label: 'Reviews', content: product.reviews_set }
  ].filter(tab => tab.content);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'description' | 'specs' | 'reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && product.content && (
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
                              <div dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          </div>
        )}

        {activeTab === 'specs' && product.specs && (
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
                              <div dangerouslySetInnerHTML={{ __html: product.specs }} />
            </div>
          </div>
        )}

        {activeTab === 'reviews' && product.reviews_set && product.reviews_set.length > 0 && (
          <div className="space-y-6">
            {product.reviews_set.map((review, index) => (
              <div key={index} className="border-l-4 border-accent-200 pl-4">
                {review.excerpt && (
                  <div className="prose prose-gray max-w-none mb-3">
                    <div className="whitespace-pre-wrap text-gray-700 italic">
                      <div dangerouslySetInnerHTML={{ __html: review.excerpt }} />
                    </div>
                  </div>
                )}
                {review.attribution && (
                  <p className="text-sm text-gray-600 font-medium">
                    — {review.attribution}
                  </p>
                )}
                {review.date_of_review && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.date_of_review).toLocaleDateString()}
                  </p>
                )}
                {review.link && (
                  <a
                    href={review.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-600 hover:text-accent-700 mt-2 inline-block"
                  >
                    Read full review →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 