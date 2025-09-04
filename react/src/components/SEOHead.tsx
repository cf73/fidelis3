import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  productData?: {
    price?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    category?: string;
  };
  localBusiness?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  productData,
  localBusiness = false
}) => {
  const siteTitle = 'Fidelis Audio';
  const defaultDescription = 'High-end audio equipment dealer in New Hampshire. Specializing in premium speakers, amplifiers, turntables, and audio components from top manufacturers.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://fidelisaudio.com';
  
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;

  // Generate structured data for local business
  const localBusinessSchema = localBusiness ? {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Fidelis Audio",
    "image": `${siteUrl}/fidelis-store.jpg`,
    "description": "Premier high-end audio equipment dealer specializing in speakers, amplifiers, turntables, and audio components.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Street",
      "addressLocality": "New Hampshire", 
      "addressRegion": "NH",
      "postalCode": "03000",
      "addressCountry": "US"
    },
    "telephone": "+1-555-FIDELIS",
    "url": siteUrl,
    "openingHours": [
      "Mo-Fr 10:00-18:00",
      "Sa 10:00-17:00"
    ],
    "priceRange": "$$$",
    "servesCuisine": null,
    "acceptsReservations": false
  } : null;

  // Generate product structured data
  const productSchema = productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": metaDescription,
    "image": ogImage,
    "brand": {
      "@type": "Brand", 
      "name": productData.brand || "Various"
    },
    "category": productData.category,
    "offers": {
      "@type": "Offer",
      "price": productData.price,
      "priceCurrency": "USD",
      "availability": `https://schema.org/${productData.availability || 'InStock'}`,
      "seller": {
        "@type": "Organization",
        "name": "Fidelis Audio"
      }
    }
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Fidelis Audio" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1c1917" />
      
      {/* Structured Data */}
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
