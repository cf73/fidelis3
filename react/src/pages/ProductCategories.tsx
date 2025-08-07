import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { getProductCategories, getProductsWithCategories } from '../lib/supabase';
import { ProductCategory, Product } from '../lib/supabase';
import { Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge, Button } from '../components/ui';

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

      {/* Categories Grid */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container>
          <Grid cols={2} gap="xl">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/list?category=${category.id}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative">
                  {/* Hero Image */}
                  {category.heroImage ? (
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <img
                        src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${category.heroImage}`}
                        alt={category.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-stone-500 to-stone-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {/* Category Title and Count */}
                    <div className="flex items-center justify-between mb-4">
                      <H3 className="text-stone-900 group-hover:text-stone-600 transition-colors duration-300">
                        {category.name}
                      </H3>
                      {category.productCount !== undefined && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-800">
                          {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                        </span>
                      )}
                    </div>

                    {/* Category Description */}
                    {category.description && (
                      <BodyLarge className="text-stone-600 mb-6 leading-relaxed">
                        {category.description}
                      </BodyLarge>
                    )}

                    {/* Explore Button */}
                    <div className="flex items-center text-stone-600 font-semibold text-lg group-hover:text-stone-700 transition-colors duration-300">
                      <span>Explore {category.name}</span>
                      <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Grid>

          {/* View All Products Link */}
          <div className="mt-20 text-center">
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