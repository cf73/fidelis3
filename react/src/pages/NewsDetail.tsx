import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNewsBySlug, getAdjacentNews, getImageUrl, processArticleMentions } from '../lib/supabase';
import { News } from '../lib/supabase';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';
import { Section, Container } from '../components/ui';

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<News | null>(null);
  const [adjacentArticles, setAdjacentArticles] = useState<{ previous: News | null; next: News | null }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [mentions, setMentions] = useState<{
    manufacturers: Array<{ name: string; slug: string; count: number }>;
    products: Array<{ title: string; slug: string; count: number }>;
  }>({ manufacturers: [], products: [] });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        const data = await getNewsBySlug(slug);
        setArticle(data);
        
        // Fetch adjacent articles for navigation
        if (data) {
          const adjacent = await getAdjacentNews(data.id);
          setAdjacentArticles(adjacent);
          
          // Process content for mentions
          const contentToProcess = data.main_content || data.content || '';
          if (contentToProcess) {
            const { processedContent, mentions } = await processArticleMentions(contentToProcess);
            setProcessedContent(processedContent);
            setMentions(mentions);
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const openImageModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">{getRandomMusicalMessage()}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-light text-stone-900 mb-6 tracking-wide">Article Not Found</h1>
          <p className="text-stone-600 mb-8 leading-relaxed">The news article you're looking for doesn't exist.</p>
          <Link to="/news" className="inline-flex items-center text-stone-600 hover:text-stone-800 font-medium transition-colors duration-300 tracking-wide">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#fffcf9]"
    >
      {/* Hero Section - Editorial Style */}
      <Section variant="hero" background="custom" customBackground="bg-warm-beige" className="-mt-4">
        <Container size="6xl">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Date with accent bar */}
              {article.news_date && (
                <div className="relative pl-4 mb-6">
                  <div className="text-xs text-stone-500 font-medium tracking-[0.15em] uppercase">
                    {new Date(article.news_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-stone-900 leading-tight tracking-wide mb-6">
                {article.title}
              </h1>

              {/* Summary */}
              {(article.summary || article.brief_description) && (
                <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
                  <p className="text-xl leading-relaxed font-light">
                    {article.summary || article.brief_description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Article Image - Overlapping Design */}
      {article.image && (
        <div className="relative -mt-16 mb-4">
          <Container size="6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto relative z-10"
            >
              <div className="bg-warm-beige rounded-xl overflow-hidden shadow-lg">
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-auto object-cover mix-blend-multiply"
                />
              </div>
            </motion.div>
          </Container>
        </div>
      )}

      {/* Article Content - Optimal Reading Width */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]" className="!pt-4">
        <Container size="6xl">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="prose prose-lg prose-stone max-w-none prose-p:mb-6 prose-p:leading-relaxed prose-headings:font-light prose-headings:tracking-wide prose-h2:text-2xl prose-h3:text-xl prose-strong:font-medium prose-a:text-stone-700 prose-a:underline-offset-4"
              style={{
                '--tw-prose-body': 'rgb(68 64 60)',
                '--tw-prose-headings': 'rgb(41 37 36)',
                '--tw-prose-lead': 'rgb(87 83 78)',
                '--tw-prose-links': 'rgb(68 64 60)',
                '--tw-prose-bold': 'rgb(41 37 36)',
                '--tw-prose-counters': 'rgb(120 113 108)',
                '--tw-prose-bullets': 'rgb(214 211 209)',
                '--tw-prose-hr': 'rgb(231 229 228)',
                '--tw-prose-quotes': 'rgb(41 37 36)',
                '--tw-prose-quote-borders': 'rgb(231 229 228)',
                '--tw-prose-captions': 'rgb(120 113 108)',
                '--tw-prose-code': 'rgb(41 37 36)',
                '--tw-prose-pre-code': 'rgb(231 229 228)',
                '--tw-prose-pre-bg': 'rgb(41 37 36)',
                '--tw-prose-th-borders': 'rgb(214 211 209)',
                '--tw-prose-td-borders': 'rgb(231 229 228)',
              } as React.CSSProperties}
            >
              {/* Main Content */}
              {processedContent && (
                <div 
                  dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') }} 
                />
              )}

              {/* Fallback to content if main_content is not available */}
              {!processedContent && article.content && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: article.content.includes('<p>') 
                      ? article.content 
                      : `<p>${article.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
                  }} 
                />
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Mentions Section */}
      {(mentions.manufacturers.length > 0 || mentions.products.length > 0) && (
        <section className="py-8 bg-warm-beige border-t border-amber-200/30">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Content</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Manufacturers */}
                  {mentions.manufacturers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Manufacturers Mentioned
                      </h3>
                      <div className="space-y-2">
                        {mentions.manufacturers.map((manufacturer, index) => (
                          <Link
                            key={index}
                            to={`/manufacturers/${manufacturer.slug}`}
                            className="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-stone-200 hover:border-stone-300"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-stone-900">{manufacturer.name}</span>
                              <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                {manufacturer.count} mention{manufacturer.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {mentions.products.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Products Mentioned
                      </h3>
                      <div className="space-y-2">
                        {mentions.products.map((product, index) => (
                          <Link
                            key={index}
                            to={`/products/${product.slug}`}
                            className="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-stone-200 hover:border-stone-300"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-stone-900">{product.title}</span>
                              <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                {product.count} mention{product.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Article Navigation */}
      <section className="py-12 bg-warm-beige border-t border-amber-200/30">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Previous Article */}
              {adjacentArticles.previous && (
                <Link
                  to={`/news/${adjacentArticles.previous.slug || adjacentArticles.previous.id}`}
                  className="group block bg-warm-white rounded-xl transition-all duration-300 overflow-hidden hover:bg-stone-50"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image */}
                    <div className="md:w-1/3 relative overflow-hidden">
                      {adjacentArticles.previous.image ? (
                        <img
                          src={getImageUrl(adjacentArticles.previous.image)}
                          alt={adjacentArticles.previous.title}
                          className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center text-xs text-stone-500 font-medium tracking-wider uppercase">
                          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous Article
                        </div>
                        
                        {adjacentArticles.previous.news_date && (
                          <div className="relative pl-4">
                            <div className="text-xs text-stone-500 font-medium tracking-[0.15em] uppercase">
                              {new Date(adjacentArticles.previous.news_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-light text-stone-900 line-clamp-2 group-hover:text-stone-700 transition-colors tracking-wide leading-tight">
                          {adjacentArticles.previous.title}
                        </h3>
                        
                        {(adjacentArticles.previous.summary || adjacentArticles.previous.brief_description) && (
                          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed font-light">
                            {adjacentArticles.previous.summary || adjacentArticles.previous.brief_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Next Article */}
              {adjacentArticles.next && (
                <Link
                  to={`/news/${adjacentArticles.next.slug || adjacentArticles.next.id}`}
                  className="group block bg-warm-white rounded-xl transition-all duration-300 overflow-hidden hover:bg-stone-50"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image */}
                    <div className="md:w-1/3 relative overflow-hidden">
                      {adjacentArticles.next.image ? (
                        <img
                          src={getImageUrl(adjacentArticles.next.image)}
                          alt={adjacentArticles.next.title}
                          className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center text-xs text-stone-500 font-medium tracking-wider uppercase">
                          Next Article
                          <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        
                        {adjacentArticles.next.news_date && (
                          <div className="relative pl-4">
                            <div className="text-xs text-stone-500 font-medium tracking-[0.15em] uppercase">
                              {new Date(adjacentArticles.next.news_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-light text-stone-900 line-clamp-2 group-hover:text-stone-700 transition-colors tracking-wide leading-tight">
                          {adjacentArticles.next.title}
                        </h3>
                        
                        {(adjacentArticles.next.summary || adjacentArticles.next.brief_description) && (
                          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed font-light">
                            {adjacentArticles.next.summary || adjacentArticles.next.brief_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>

            {/* Back to News Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 text-center"
            >
              <Link
                to="/news"
                className="inline-flex items-center text-stone-600 hover:text-stone-800 font-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="relative max-w-6xl max-h-full p-4">
            <img
              src={getImageUrl(selectedImage)}
              alt={article.title}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export { NewsDetail }; 