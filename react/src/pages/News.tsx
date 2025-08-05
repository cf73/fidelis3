import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews, getImageUrl, News as NewsType } from '../lib/supabase';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">News</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Placeholder content
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="container-custom py-12">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <motion.div
                key={article.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -5 }}
                className="card overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {article.featured_image && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={getImageUrl(article.featured_image)}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{article.title}</h3>
                  {article.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {new Date(article.date).toLocaleDateString()}
                    </p>
                  )}
                  {article.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <Link
                    to={`/news/${article.id}`}
                    className="btn-primary w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Placeholder content</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export { News }; 