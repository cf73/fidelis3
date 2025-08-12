import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProductCategories, getProductsWithCategories, getImageUrl } from '../lib/supabase';
import { ProductCategory, Product } from '../lib/supabase';
import { Section, Container, Flex, H1, BodyLarge, CategoryCard } from '../components/ui';

interface CategoryWithHero extends ProductCategory {
  heroImage?: string;
  productCount?: number;
}

export const ProductCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithHero[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getProductCategories(),
          getProductsWithCategories(),
        ]);

        // Enhance categories with hero images and product counts
        const enhancedCategories = categoriesData.map(category => {
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
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf9] flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading categories...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Container>
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-6">Product Categories</H1>
            <BodyLarge className="text-stone-600 max-w-4xl mx-auto leading-relaxed">
              Explore our comprehensive collection of high-quality audio equipment, organized by category to help you find exactly what you're looking for.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* Categories Grid - refined layout */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          {/* Intro row with short guidance */}
          <div className="max-w-4xl mb-8">
            <BodyLarge className="text-stone-700">
              Explore categories to browse our collections. Each card previews the aesthetic of the products within.
            </BodyLarge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/list?category=${category.id}`}
                className="block h-full"
              >
                <CategoryCard category={category} className="h-full" />
              </Link>
            ))}
          </div>

          {/* View All Products Link */}
          <div className="mt-16 text-center">
            <Link
              to="/products/list"
              className="inline-flex items-center px-8 py-4 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 shadow-sm hover:shadow-md"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              View All Products
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}; 