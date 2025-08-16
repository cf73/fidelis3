import React, { useState } from 'react';
import { Product, Review } from '../lib/supabase';

// Helper function to detect if content contains HTML tags
const containsHtmlTags = (content: string): boolean => {
  return /<[^>]+>/g.test(content);
};

// Helper function to clean HTML content and convert to readable text
const cleanHtmlContent = (htmlString: string): string => {
  if (!htmlString) return '';
  
  // If it doesn't contain HTML tags, return as-is
  if (!containsHtmlTags(htmlString)) {
    return htmlString;
  }
  
  return htmlString
    // Convert HTML lists to bullet points
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    
    // Convert headings
    .replace(/<h[1-6][^>]*>/gi, '\n## ')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    
    // Convert paragraphs and line breaks
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br[^>]*\/?>/gi, '\n')
    
    // Remove all other HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up whitespace and entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    
    // Clean up excessive whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
    .replace(/^\s+|\s+$/g, '') // Trim start/end
    .replace(/[ \t]+/g, ' '); // Multiple spaces to single
};

// Helper function to extract text from Statamic content structure
const extractTextFromStatamicContent = (content: any): string => {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content.map(item => {
      const text = extractTextFromStatamicContent(item);
      
      // Handle different content types with appropriate formatting
      if (item && item.type) {
        switch (item.type) {
          case 'paragraph':
            return text ? text + '\n\n' : '';
          case 'heading':
            return text ? `## ${text}\n\n` : '';
          case 'bullet_list':
          case 'bulletList':
            return text ? text + '\n\n' : '';
          case 'list_item':
            return text ? `• ${text}\n` : '';
          case 'hardBreak':
          case 'hard_break':
            return '\n';
          default:
            return text;
        }
      }
      return text;
    }).join('').replace(/\n\n$/, ''); // Remove trailing line breaks
  }
  
  if (typeof content === 'object') {
    if (content.type === 'paragraph' && content.content) {
      return extractTextFromStatamicContent(content.content);
    }
    
    if (content.type === 'heading' && content.content) {
      return extractTextFromStatamicContent(content.content);
    }
    
    if ((content.type === 'bullet_list' || content.type === 'bulletList') && content.content) {
      return extractTextFromStatamicContent(content.content);
    }
    
    if (content.type === 'list_item' && content.content) {
      return extractTextFromStatamicContent(content.content);
    }
    
    if (content.type === 'hardBreak' || content.type === 'hard_break') {
      return '\n';
    }
    
    if (content.text) {
      return content.text;
    }
    
    if (content.content) {
      return extractTextFromStatamicContent(content.content);
    }
    
    // Try to find text in any property
    for (const key in content) {
      if (content[key] && typeof content[key] === 'object') {
        const text = extractTextFromStatamicContent(content[key]);
        if (text) return text;
      }
    }
  }
  
  return '';
};

interface ProductTabsProps {
  product: Product;
}

// Helper function to check if product has any tab content
export const hasTabContent = (product: Product): boolean => {
  // Parse description to check if it has actual content
  const parseDescription = (description: any): string => {
    if (!description) return '';
    
    if (typeof description === 'string') {
      try {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed)) {
          return extractTextFromStatamicContent(parsed);
        }
      } catch {
        // Not JSON, might be HTML or clean text - clean only if it has HTML
        return cleanHtmlContent(description);
      }
    }
    
    return extractTextFromStatamicContent(description);
  };

  const cleanDescription = parseDescription((product as any).description);
  
  // Parse specs to check if they have actual content
  const parseSpecsForCheck = (specs: any): string => {
    if (!specs) return '';
    
    if (typeof specs === 'string') {
      try {
        const parsed = JSON.parse(specs);
        if (Array.isArray(parsed)) {
          return extractTextFromStatamicContent(parsed);
        }
      } catch {
        // Not JSON, might be HTML - clean it up
        return cleanHtmlContent(specs);
      }
    }
    
    return extractTextFromStatamicContent(specs);
  };

  const cleanSpecs = parseSpecsForCheck(product.specs);
  
  let reviews: Review[] = [];
  try {
    if (product.reivews_set) {
      const parsed = JSON.parse(product.reivews_set);
      if (Array.isArray(parsed)) {
        reviews = parsed.map(review => ({
          excerpt: extractTextFromStatamicContent(review.excerpt),
          attribution: review.attribution,
          date_of_review: review.date_of_review,
          link: review.link
        })).filter(review => review.excerpt || review.attribution);
      }
    }
  } catch (error) {
    console.warn('Error parsing reviews:', error);
  }
  
  return !!(cleanDescription || cleanSpecs || reviews.length > 0);
};

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  // Parse description from Statamic Bard content
  const parseDescription = (description: any): string => {
    if (!description) return '';
    
    // If it's already a plain string, return it
    if (typeof description === 'string') {
      // Check if it looks like JSON
      try {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed)) {
          return extractTextFromStatamicContent(parsed);
        }
      } catch {
        // Not JSON, might be HTML or clean text - clean only if it has HTML
        return cleanHtmlContent(description);
      }
    }
    
    // If it's already an object or array, extract text
    return extractTextFromStatamicContent(description);
  };

  // Parse specs from Statamic Bard content
  const parseSpecs = (specs: any): string => {
    if (!specs) return '';
    
    if (typeof specs === 'string') {
      // Check if it looks like JSON/Statamic content
      try {
        const parsed = JSON.parse(specs);
        if (Array.isArray(parsed)) {
          return extractTextFromStatamicContent(parsed);
        }
      } catch {
        // Not JSON, might be HTML - clean it up
        return cleanHtmlContent(specs);
      }
    }
    
    // If it's already an object or array, extract text
    return extractTextFromStatamicContent(specs);
  };

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
  const cleanDescription = parseDescription((product as any).description);
  const cleanSpecs = parseSpecs(product.specs);

  const allTabs = [
    { 
      id: 'description', 
      label: 'Description', 
      content: cleanDescription,
      hasContent: !!cleanDescription,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'specs', 
      label: 'Specifications', 
      content: cleanSpecs,
      hasContent: !!cleanSpecs,
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

  // Filter to only show tabs that have content
  const tabs = allTabs.filter(tab => tab.hasContent);

  // Determine initial active tab - use the first available tab
  const getInitialActiveTab = () => {
    if (tabs.length === 0) return 'description'; // fallback if no tabs
    return tabs[0].id;
  };

  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>(getInitialActiveTab());

  // If no tabs have content, don't render the component
  if (tabs.length === 0) {
    return null;
  }

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
              <div className="prose prose-lg prose-stone max-w-none">
                <div className="text-base leading-relaxed text-stone-700 space-y-6">
                  <div className="whitespace-pre-wrap">{cleanDescription}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <div className="prose prose-lg prose-stone max-w-none">
                <div className="text-base leading-relaxed text-stone-700 space-y-4">
                  <div className="whitespace-pre-wrap">{cleanSpecs}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};