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
      <Section variant="hero" background="custom" customBackground="bg-warm-beige" className="-mt-4">
        <Container size="6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-stone-900 leading-tight tracking-wide mb-6">News & Updates</h1>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
              <p>
                New gear arrivals, listening events, and insights from decades in high-end audio. We share what we think matters—no fluff, just what's worth your time.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Two Column Layout: News Grid + Newsletter */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container size="6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main News Grid - Takes up 2/3 of the space */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.map((article) => {
                  const articleSlug = article.slug || slugify(article.title);
                  return (
                    <Link key={article.id} to={`/news/${articleSlug}`} className="block h-full">
                      <NewsCard article={article} className="h-full" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Signup Sidebar - Takes up 1/3 of the space */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-warm-white rounded-xl p-6 border border-amber-200/30">
                  <div className="flex items-center mb-4">
                    <div className="bg-warm-white pr-4">
                      <span className="text-sm font-medium text-stone-700 tracking-wider uppercase">Stay Updated</span>
                    </div>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    Get updates when we receive new shipments, host listening sessions, or have insights worth sharing.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300"
                    />
                    <button className="w-full px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-all duration-300">
                      Keep Me Posted
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 mt-3">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};

export { News }; 