import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { getProductBySlug, getRelatedProducts, getImageUrl, type Product } from '../lib/supabase';

const ProductDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug;
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<{
    pairsWellWith: Product[];
    alsoConsider: Product[];
  }>({ pairsWellWith: [], alsoConsider: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        
        // Fetch related products if they exist
        if (data) {
          const pairsWellWith = data.pairs_well_with ? await getRelatedProducts(data.pairs_well_with) : [];
          const alsoConsider = data.also_consider ? await getRelatedProducts(data.also_consider) : [];
          
          setRelatedProducts({
            pairsWellWith,
            alsoConsider
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            {product.product_hero_image ? (
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(product.product_hero_image)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-xl text-gray-600 mb-4">
                {product.manufacturer || 'Unknown Manufacturer'}
              </p>
              
              {product.price && (
                <p className="text-3xl font-bold text-accent-600 mb-4">
                  ${product.price.toLocaleString()}
                </p>
              )}

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="prose max-w-none">
                    {typeof product.description === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    ) : (
                      <p className="text-gray-700">
                        {Array.isArray(product.description) 
                          ? product.description.map(item => 
                              item.content?.map((content: any) => content.text).join(' ')
                            ).join(' ')
                          : 'Description not available'
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.product_specifications && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Specifications</h2>
            <div className="bg-white rounded-lg p-8">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.product_specifications }} />
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {(relatedProducts.pairsWellWith.length > 0 || relatedProducts.alsoConsider.length > 0) && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            
            {relatedProducts.pairsWellWith.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Pairs Well With</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.pairsWellWith.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/products/${relatedProduct.slug}`}
                      className="card overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {relatedProduct.product_hero_image && (
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                          <img
                            src={getImageUrl(relatedProduct.product_hero_image)}
                            alt={relatedProduct.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{relatedProduct.title}</h4>
                        <p className="text-sm text-gray-600">
                          {relatedProduct.manufacturer}
                        </p>
                        {relatedProduct.price && (
                          <p className="text-lg font-bold text-accent-600 mt-2">
                            ${relatedProduct.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedProducts.alsoConsider.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Also Consider</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.alsoConsider.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/products/${relatedProduct.slug}`}
                      className="card overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {relatedProduct.product_hero_image && (
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                          <img
                            src={getImageUrl(relatedProduct.product_hero_image)}
                            alt={relatedProduct.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{relatedProduct.title}</h4>
                        <p className="text-sm text-gray-600">
                          {relatedProduct.manufacturer}
                        </p>
                        {relatedProduct.price && (
                          <p className="text-lg font-bold text-accent-600 mt-2">
                            ${relatedProduct.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </section>
    </motion.div>
  );
};

export default ProductDetail; 