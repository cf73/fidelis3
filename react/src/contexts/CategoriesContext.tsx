import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProductCategories, getProductsWithCategories } from '../lib/supabase';
import { ProductCategory, Product } from '../lib/supabase';

interface CategoryWithHero extends ProductCategory {
  heroImage?: string;
  productCount?: number;
}

interface CategoriesContextType {
  categories: CategoryWithHero[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryWithHero[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
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

  const refreshCategories = async () => {
    await loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const value = {
    categories,
    loading,
    refreshCategories
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};


