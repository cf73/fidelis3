/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Design System Demo Page - Showcases our refined visual system
 */

import React, { useState, useEffect } from 'react';
import { getProductsWithCategories } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { 
  ProductCard, 
  Section, 
  Grid, 
  Container, 
  Flex,
  H1, 
  H2, 
  H3, 
  H4, 
  BodyLarge, 
  Body, 
  BodySmall, 
  Caption, 
  Price, 
  PriceLarge 
} from '../components/ui';

export const DesignSystemDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProductsWithCategories();
        setProducts(productsData.slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading Design System demo...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Flex direction="col" align="center" className="text-center">
          <H1>Design System</H1>
          <BodyLarge className="mt-4 max-w-2xl">
            Showcasing our refined midcentury modern visual language with sophisticated typography, 
            elegant layouts, and premium product cards.
          </BodyLarge>
        </Flex>
      </Section>

      {/* Typography Section */}
      <Section variant="default" background="stone-50">
        <H2 className="mb-12 text-center">Typography Scale</H2>
        <Grid cols={2} gap="xl">
          <div>
            <H1 className="mb-4">Heading 1</H1>
            <Body>Large, light typography with wide tracking for dramatic impact.</Body>
          </div>
          <div>
            <H2 className="mb-4">Heading 2</H2>
            <Body>Secondary headings with refined proportions and spacing.</Body>
          </div>
          <div>
            <H3 className="mb-4">Heading 3</H3>
            <Body>Section headings with elegant hierarchy and contrast.</Body>
          </div>
          <div>
            <H4 className="mb-4">Heading 4</H4>
            <Body>Subsection headings for detailed content organization.</Body>
          </div>
        </Grid>
      </Section>

      {/* Body Text Section */}
      <Section variant="default" background="white">
        <H2 className="mb-12 text-center">Body Text Variants</H2>
        <Grid cols={1} gap="lg">
          <div>
            <BodyLarge className="mb-4">
              BodyLarge: This is the largest body text variant, perfect for lead paragraphs 
              and important content that needs to stand out while maintaining readability.
            </BodyLarge>
            <Body className="mb-4">
              Body: This is the standard body text variant, used for most content throughout 
              the site. It provides excellent readability with refined typography.
            </Body>
            <BodySmall className="mb-4">
              BodySmall: This smaller variant is ideal for secondary information, 
              captions, and supporting text that doesn't need to compete for attention.
            </BodySmall>
            <Caption>
              Caption: The smallest text variant, perfect for metadata, timestamps, 
              and other supplementary information.
            </Caption>
          </div>
        </Grid>
      </Section>

      {/* Price Typography Section */}
      <Section variant="default" background="stone-50">
        <H2 className="mb-12 text-center">Price Typography</H2>
        <Grid cols={2} gap="xl">
          <div className="text-center">
            <PriceLarge className="mb-2">$12,500</PriceLarge>
            <Caption>PriceLarge variant for featured products</Caption>
          </div>
          <div className="text-center">
            <Price className="mb-2">$2,800</Price>
            <Caption>Price variant for standard products</Caption>
          </div>
        </Grid>
      </Section>

      {/* Layout Components Section */}
      <Section variant="default" background="white">
        <H2 className="mb-12 text-center">Layout Components</H2>
        
        {/* Grid Demo */}
        <div className="mb-16">
          <H3 className="mb-8">Grid System</H3>
          <Grid cols={3} gap="lg">
            <div className="bg-stone-100 p-6 rounded-lg">
              <H4 className="mb-2">Grid Item 1</H4>
              <BodySmall>Responsive grid with consistent spacing and elegant proportions.</BodySmall>
            </div>
            <div className="bg-stone-100 p-6 rounded-lg">
              <H4 className="mb-2">Grid Item 2</H4>
              <BodySmall>Adaptive columns that maintain visual hierarchy across screen sizes.</BodySmall>
            </div>
            <div className="bg-stone-100 p-6 rounded-lg">
              <H4 className="mb-2">Grid Item 3</H4>
              <BodySmall>Sophisticated spacing that creates breathing room and visual flow.</BodySmall>
            </div>
          </Grid>
        </div>

        {/* Flex Demo */}
        <div className="mb-16">
          <H3 className="mb-8">Flex Layout</H3>
          <Flex justify="between" align="center" className="bg-stone-100 p-6 rounded-lg">
            <div>
              <H4 className="mb-2">Flex Item Left</H4>
              <BodySmall>Flexible layout with precise alignment and spacing control.</BodySmall>
            </div>
            <div className="text-right">
              <H4 className="mb-2">Flex Item Right</H4>
              <BodySmall>Perfect for navigation, headers, and content distribution.</BodySmall>
            </div>
          </Flex>
        </div>
      </Section>

      {/* Product Cards Section */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <H2 className="mb-12 text-center">Product Cards</H2>
        
                 {/* Product Cards */}
         <div className="mb-16">
           <H3 className="mb-8">Product Cards (Midcentury Modern)</H3>
           <Grid cols={3} gap="lg">
             {products.slice(0, 3).map((product) => (
               <ProductCard
                 key={product.id}
                 product={product}
                 size="md"
               />
             ))}
           </Grid>
         </div>
      </Section>

      {/* Color Palette Section */}
      <Section variant="default" background="white">
        <H2 className="mb-12 text-center">Color Palette</H2>
        <Grid cols={4} gap="lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#fffcf9] border border-stone-200 rounded-lg mx-auto mb-4"></div>
            <H4 className="mb-2">Background</H4>
            <Caption>#fffcf9</Caption>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#f4f0ed] border border-stone-200 rounded-lg mx-auto mb-4"></div>
            <H4 className="mb-2">Card</H4>
            <Caption>#f4f0ed</Caption>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-stone-800 rounded-lg mx-auto mb-4"></div>
            <H4 className="mb-2">Text</H4>
            <Caption>stone-800</Caption>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-stone-600 rounded-lg mx-auto mb-4"></div>
            <H4 className="mb-2">Secondary</H4>
            <Caption>stone-600</Caption>
          </div>
        </Grid>
      </Section>

      {/* Footer */}
      <Section variant="compact" background="stone-100">
        <Flex direction="col" align="center" className="text-center">
          <H3 className="mb-4">Design System Complete</H3>
          <Body>
            All components follow our refined midcentury modern aesthetic with 
            sophisticated typography, elegant spacing, and premium visual hierarchy.
          </Body>
        </Flex>
      </Section>
    </div>
  );
};
