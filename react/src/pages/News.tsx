import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews, getImageUrl, News as NewsType } from '../lib/supabase';
import { slugify } from '../lib/utils';
import { Section, Container, Flex, H1, BodyLarge } from '../components/ui';
import { NewsCard } from '../components/ui';

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

      {/* News Articles - Horizontal Editorial Layout */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          {news.length > 0 ? (
            <div className="space-y-8">
              {news.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="block"
                >
                  <Link 
                    to={`/news/${article.slug || slugify(article.title)}`}
                    className="block h-full"
                  >
                    <NewsCard 
                      article={article} 
                      variant={index % 2 === 0 ? 'horizontal-left' : 'horizontal-right'}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-3xl font-bold text-stone-900 mb-4">No News Articles</h2>
              <p className="text-stone-600 max-w-md mx-auto">
                Check back soon for the latest news and updates from Fidelis AV.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </motion.div>
  );
};

export { News }; 