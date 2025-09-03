import { getProducts, getManufacturers, getNews, getPreOwned } from '../lib/supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://fidelisaudio.com';
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push(
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/products', changefreq: 'daily', priority: 0.9 },
    { loc: '/manufacturers', changefreq: 'weekly', priority: 0.8 },
    { loc: '/news', changefreq: 'daily', priority: 0.7 },
    { loc: '/pre-owned', changefreq: 'daily', priority: 0.8 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.6 }
  );

  try {
    // Dynamic product pages
    const products = await getProducts();
    products.forEach(product => {
      if (product.slug) {
        urls.push({
          loc: `/products/${product.slug}`,
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
          changefreq: 'weekly',
          priority: 0.8
        });
      }
    });

    // Manufacturer pages
    const manufacturers = await getManufacturers();
    manufacturers.forEach(manufacturer => {
      if (manufacturer.slug) {
        urls.push({
          loc: `/manufacturers/${manufacturer.slug}`,
          lastmod: manufacturer.updated_at ? new Date(manufacturer.updated_at).toISOString().split('T')[0] : undefined,
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    });

    // News pages
    const news = await getNews();
    news.forEach(article => {
      if (article.slug) {
        urls.push({
          loc: `/news/${article.slug}`,
          lastmod: article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : undefined,
          changefreq: 'monthly',
          priority: 0.6
        });
      }
    });

    // Pre-owned pages
    const preOwned = await getPreOwned();
    preOwned.forEach(item => {
      urls.push({
        loc: `/pre-owned/${item.id}`,
        lastmod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : undefined,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export async function saveSitemap(): Promise<void> {
  const xml = await generateSitemap();
  
  // In a real application, you'd save this to public/sitemap.xml
  // For now, we'll log it or handle it differently based on the environment
  console.log('Generated sitemap:', xml);
  
  // You could also send this to a build process or save it via API
}
