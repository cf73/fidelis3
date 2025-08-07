import React, { useState, useEffect } from 'react';
import { Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge } from '../components/ui';
import { Card, ProductCard, NewsCard, ManufacturerCard, CategoryCard, ValueCard } from '../components/ui';
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
        const enhancedCategories = categoriesData.slice(0, 3).map(category => {
          const categoryProducts = productsData.filter(product => 
            product.categories?.id === category.id
          );
          
          // Get the first product with a hero image for this category
          const heroProduct = categoryProducts.find(product => 
            product.product_hero_image
          );

          return {
            ...category,
            heroImage: heroProduct?.product_hero_image,
            productCount: categoryProducts.length
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
          <Grid cols={3} gap="lg">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </Grid>
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

             {/* Category Cards */}
       <Section variant="default" background="white">
         <Container>
           <H2 className="mb-12 text-center">Category Cards</H2>
           <Grid cols={3} gap="lg">
             {categories.map((category, index) => (
               <CategoryCard 
                 key={category.id} 
                 category={category} 
                 variant={index === 1 ? 'dark' : 'light'} 
               />
             ))}
           </Grid>
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
