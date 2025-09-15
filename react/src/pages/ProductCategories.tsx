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
      <Section variant="hero" background="custom" customBackground="bg-warm-beige" className="-mt-4">
        <Container size="6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-stone-900 leading-tight tracking-wide mb-6">Product Categories</h1>
            <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
              <p className="mb-6">
                We organize our inventory by component type to help you find what you need. Each category represents decades of experience in what works and what doesn't.
              </p>
              <p>
                Whether you're starting fresh or upgrading specific components, these categories reflect how we think about building great audio systems.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Categories Grid - refined layout */}
      <Section variant="default" background="custom" customBackground="bg-[#fffcf9]">
        <Container size="6xl">


          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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