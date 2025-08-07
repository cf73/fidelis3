import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews, getImageUrl, News as NewsType } from '../lib/supabase';
import { slugify } from '../lib/utils';
import { Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading news...</p>
          </div>
        </Container>
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
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Container>
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-4">News & Updates</H1>
            <BodyLarge className="text-stone-600 max-w-2xl">
              Stay up to date with the latest news, product announcements, and industry insights from Fidelis AV.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* News Grid */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
        {news.length > 0 ? (
          <Grid cols={3} gap="lg">
            {news.map((article) => (
              <motion.div
                key={article.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image Section */}
                {article.image ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        console.error('Image failed to load:', article.image);
                        // Show fallback instead of hiding
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    {/* Fallback for failed images */}
                    <div className="image-fallback w-full h-64 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <svg className="h-16 w-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  {/* Date */}
                  {article.news_date && (
                    <div className="flex items-center text-sm text-stone-500 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(article.news_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}

                  {/* Title */}
                  <H3 className="mb-3 text-stone-900 line-clamp-2">
                    {article.title}
                  </H3>

                  {/* Description */}
                  {article.brief_description && (
                    <Body className="text-stone-600 mb-4 line-clamp-3">
                      {article.brief_description}
                    </Body>
                  )}

                  {/* Read More Button */}
                  <Link
                    to={`/news/${article.slug || slugify(article.title)}`}
                    className="inline-flex items-center text-stone-600 hover:text-stone-700 font-medium transition-colors duration-200"
                  >
                    Read Full Article
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </Grid>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <H2 className="mb-4 text-stone-900">No News Articles</H2>
            <Body className="text-stone-600 max-w-md mx-auto">
              Check back soon for the latest news and updates from Fidelis AV.
            </Body>
          </div>
        )}
        </Container>
      </Section>
    </motion.div>
  );
};

export { News }; 