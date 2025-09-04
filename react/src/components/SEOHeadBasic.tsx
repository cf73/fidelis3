import { useEffect } from 'react';

interface SEOHeadBasicProps {
  title: string;
  description: string;
  canonical: string;
  localBusiness?: boolean;
}

const SEOHeadBasic: React.FC<SEOHeadBasicProps> = ({
  title,
  description,
  canonical,
  localBusiness = false
}) => {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://fidelisaudio.com';
    const siteTitle = 'Fidelis Audio';
    const fullTitle = `${title} | ${siteTitle}`;
    const canonicalUrl = `${siteUrl}${canonical}`;
    
    // Update document title
    document.title = fullTitle;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.includes('property=')) {
          tag.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else {
          tag.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };
    
    // Basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="robots"]', 'index, follow');
    
    // Open Graph tags
    updateMetaTag('meta[property="og:type"]', 'website');
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', canonicalUrl);
    updateMetaTag('meta[property="og:site_name"]', siteTitle);
    updateMetaTag('meta[property="og:image"]', `${siteUrl}/og-image.svg`);
    
    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', description);
    
    // Canonical URL
    updateLinkTag('canonical', canonicalUrl);
    
    // Add structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    
    const structuredData = [];
    
    // Organization schema
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteTitle,
      "url": siteUrl,
      "logo": `${siteUrl}/logo192.png`
    });
    
    // Local business schema if requested
    if (localBusiness) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": siteTitle,
        "url": siteUrl,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "460 Amherst Street",
          "addressLocality": "Nashua",
          "addressRegion": "NH",
          "postalCode": "03063",
          "addressCountry": "US"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "10:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "10:00",
            "closes": "17:00"
          }
        ]
      });
    }
    
    structuredDataScript.textContent = JSON.stringify(structuredData);
    
  }, [title, description, canonical, localBusiness]);
  
  return null; // This component doesn't render anything visually
};

export default SEOHeadBasic;
