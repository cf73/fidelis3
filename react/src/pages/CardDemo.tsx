import React, { useState, useEffect } from 'react';
import { Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge } from '../components/ui';
import { Card, ProductCard, NewsCard, ManufacturerCard, CategoryCard, ValueCard, CategoryNavigation } from '../components/ui/Card';
import { getProductsWithCategories, getNews, getManufacturers, getProductCategories } from '../lib/supabase';
import { Product, News, Manufacturer, ProductCategory } from '../lib/supabase';

export const CardDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, newsData, manufacturersData, categoriesData] = await Promise.all([
          getProductsWithCategories(),
          getNews(),
          getManufacturers(),
          getProductCategories()
        ]);
        
                 setProducts(productsData.slice(0, 3));
         setNews(newsData.slice(0, 3));
         setManufacturers(manufacturersData.slice(0, 3));
         
                  // Enhance categories with hero images and product counts (like ProductCategories page)
          const enhancedCategories = categoriesData.map((category, index) => {
           const categoryProducts = productsData.filter(product => 
             product.categories?.id === category.id
           );
           
           // Get the first product with a hero image for this category
           const heroProduct = categoryProducts.find(product => 
             product.product_hero_image
           );

           // Get unique manufacturers for this category
           const manufacturers = Array.from(new Set(categoryProducts.map(p => p.manufacturer?.name).filter(Boolean)));

                       // Sample content variations for demo - expanded for all categories
            const contentVariations = [
              {
                description: "Premium amplifiers that deliver pure, uncolored sound with exceptional clarity and power.",
                featuredBrands: ["McIntosh", "Accuphase", "Pass Labs"],
                brandCount: manufacturers.length,
                tags: ["Premium", "High-End"]
              },
              {
                description: "High-end speakers from world-renowned manufacturers, engineered for sonic perfection.",
                featuredBrands: ["Harbeth", "YG Acoustics", "Wilson Audio"],
                brandCount: manufacturers.length,
                tags: ["Reference", "Audiophile"]
              },
              {
                description: "Transform your listening experience with precision-engineered components and cables.",
                featuredBrands: ["Nordost", "AudioQuest", "Shunyata"],
                brandCount: manufacturers.length,
                tags: ["New Arrivals", "Best Sellers"]
              },
              {
                description: "Digital-to-analog converters that preserve the integrity of your music.",
                featuredBrands: ["dCS", "Esoteric", "Aurender"],
                brandCount: manufacturers.length,
                tags: ["Digital", "Precision"]
              },
              {
                description: "Premium cables and interconnects that reveal every detail in your music.",
                featuredBrands: ["Nordost", "AudioQuest", "Shunyata"],
                brandCount: manufacturers.length,
                tags: ["Cables", "Premium"]
              },
              {
                description: "Accessories and components that complete your audio system.",
                featuredBrands: ["IsoTek", "HRS", "Stillpoints"],
                brandCount: manufacturers.length,
                tags: ["Accessories", "System"]
              },
              {
                description: "Pre-owned equipment with exceptional value and performance.",
                featuredBrands: ["Various", "Certified", "Tested"],
                brandCount: manufacturers.length,
                tags: ["Pre-Owned", "Value"]
              }
            ];

           return {
             ...category,
             heroImage: heroProduct?.product_hero_image,
             productCount: categoryProducts.length,
             ...contentVariations[index % contentVariations.length]
           };
         });
        
        setCategories(enhancedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading card demo...</p>
        </div>
      </div>
    );
  }

  const sampleValue = {
    icon: '🎯',
    title: 'Excellence',
    description: 'We never compromise on quality, offering only the finest audio equipment from world-renowned manufacturers.'
  };

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Container>
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-4">Card System Demo</H1>
            <BodyLarge className="text-stone-600 max-w-2xl">
              A comprehensive showcase of our unified card system, demonstrating all card types used across the site.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* Basic Card Test */}
      <Section variant="default" background="white">
        <Container>
          <H2 className="mb-12 text-center">Basic Card Test</H2>
          <Grid cols={3} gap="lg">
            <Card variant="default" size="lg">
              <H3 className="mb-4">Default Card</H3>
              <Body>This is a basic card with default styling. Perfect for general content.</Body>
            </Card>
            
            <Card variant="featured" size="lg">
              <H3 className="mb-4 text-white">Featured Card</H3>
              <Body className="text-stone-200">This card uses the featured variant with a dark gradient background.</Body>
            </Card>
            
            <Card variant="value" size="lg">
              <H3 className="mb-4">Value Card</H3>
              <Body>Centered content card, ideal for highlighting key information.</Body>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Product Cards */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          <H2 className="mb-12 text-center">Product Cards</H2>
          <Grid cols={3} gap="lg">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </Container>
      </Section>

             {/* News Cards */}
       <Section variant="default" background="white">
         <Container>
           <H2 className="mb-12 text-center">News Cards</H2>
           
           {/* Horizontal News Cards - Editorial Layout */}
           <div className="space-y-8">
             {news.map((article, index) => (
               <NewsCard 
                 key={article.id} 
                 article={article} 
                 variant={index % 2 === 0 ? 'horizontal-left' : 'horizontal-right'}
               />
             ))}
           </div>
         </Container>
       </Section>

      {/* Manufacturer Cards */}
      <Section variant="default" background="stone-50">
        <Container>
          <H2 className="mb-12 text-center">Manufacturer Cards</H2>
          <Grid cols={3} gap="lg">
            {manufacturers.map((manufacturer) => (
              <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
            ))}
          </Grid>
        </Container>
      </Section>

                           {/* Category Navigation - Dramatic Split Layout */}
        <Section variant="default" background="custom" customBackground="bg-black" className="p-0">
          <div className="w-full">
            <CategoryNavigation categories={categories} variant="dramatic" />
          </div>
        </Section>

        {/* Category Navigation - Organic Layout */}
        <Section variant="default" background="custom" customBackground="bg-black" className="p-0">
          <div className="w-full">
            <CategoryNavigation categories={categories} variant="organic" />
          </div>
        </Section>

        {/* Category Grid - All Categories */}
        <Section variant="default" background="custom" customBackground="bg-black" className="p-0">
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-4">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onMouseEnter={() => {
                    // This would trigger the CategoryNavigation hover
                    // For demo purposes, we'll just show the category name
                  }}
                  className="w-full p-4 text-left transition-all duration-300 border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  <span className="text-sm font-medium tracking-wide uppercase">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Traditional Category Cards */}
        <Section variant="default" background="white">
          <Container>
            <H2 className="mb-12 text-center">Traditional Category Cards</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  variant={index % 2 === 0 ? 'dark' : 'light'} 
                />
              ))}
            </div>
          </Container>
        </Section>

      {/* Value Cards */}
      <Section variant="default" background="stone-50">
        <Container>
          <H2 className="mb-12 text-center">Value Cards</H2>
          <Grid cols={3} gap="lg">
            <ValueCard value={sampleValue} />
            <ValueCard value={{...sampleValue, icon: '🤝', title: 'Trust', description: 'Building lasting relationships with our customers through honest advice and exceptional service.'}} />
            <ValueCard value={{...sampleValue, icon: '🎵', title: 'Passion', description: 'Our love for music drives everything we do, from product selection to customer support.'}} />
          </Grid>
        </Container>
      </Section>

      {/* Card Sizes */}
      <Section variant="default" background="white">
        <Container>
          <H2 className="mb-12 text-center">Card Sizes</H2>
          <Grid cols={3} gap="lg">
            <Card variant="default" size="sm">
              <H3 className="mb-2">Small</H3>
              <Body className="text-sm">Compact card with minimal padding.</Body>
            </Card>
            
            <Card variant="default" size="md">
              <H3 className="mb-4">Medium</H3>
              <Body>Standard card with balanced padding.</Body>
            </Card>
            
            <Card variant="default" size="lg">
              <H3 className="mb-4">Large</H3>
              <Body>Spacious card with generous padding for content-heavy layouts.</Body>
            </Card>
          </Grid>
        </Container>
      </Section>
    </div>
  );
};
