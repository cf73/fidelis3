import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews, getImageUrl, News as NewsType } from '../lib/supabase';
import { slugify } from '../lib/utils';
import { Section, Container, Flex, H1, BodyLarge } from '../components/ui';
import { NewsCard } from '../components/ui';
import { getRandomMusicalMessage } from '../utils/musicalLoadingMessages';

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
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <Container size="6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">{getRandomMusicalMessage()}</p>
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
      className="min-h-screen bg-warm-white"
    >
      {/* Hero Section */}
      <Section variant="compact" className="!pt-8 !pb-12">
        <Container size="6xl">
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-4">News & Updates</H1>
            <BodyLarge className="text-stone-600 max-w-2xl">
              Stay up to date with the latest news, product announcements, and industry insights from Fidelis AV.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* News Grid */}
      <Section variant="compact" background="custom" customBackground="bg-warm-white">
        <Container size="6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {news.map((article) => {
              const articleSlug = article.slug || slugify(article.title);
              return (
                <Link key={article.id} to={`/news/${articleSlug}`} className="block h-full">
                  <NewsCard article={article} className="h-full" />
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};

export { News }; 