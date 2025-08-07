import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductBySlug, deleteProduct, getRelatedProducts, getImageUrl } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { ProductForm } from '../components/ProductForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { ProductTabs } from '../components/ProductTabs';


export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        
        // Load related products
        if (productData) {
          setRelatedLoading(true);
          const related = await getRelatedProducts(
            productData.id,
            productData.manufacturer?.id,
            productData.categories?.id
          );
          setRelatedProducts(related);
          setRelatedLoading(false);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleEditSuccess = async () => {
    // Reload product after successful update
    if (slug) {
      const productData = await getProductBySlug(slug);
      setProduct(productData);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await deleteProduct(product.id);
      if (error) {
        console.error('Error deleting product:', error);
        return;
      }
      
      // Redirect to products page after successful deletion
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const openImageModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCallToActionButton = () => {
    if (product?.available_for_demo) {
      return (
        <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium">
          HOME DEMO AVAILABLE
        </button>
      );
    }
    
    if (product?.available_to_buy_online) {
      return (
        <div className="space-y-3">
          <button className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 font-medium">
            BUY NOW
          </button>
          {/* Payment Method Icons */}
          <div className="flex justify-center space-x-2">
            <span className="text-xs text-gray-500">We accept:</span>
            <div className="flex space-x-1">
              <span className="text-xs text-gray-400">Visa</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">Mastercard</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">PayPal</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (product?.local_only) {
      return (
        <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium">
          VIEW IN SHOWROOM
        </button>
      );
    }
    
    return (
      <button className="w-full bg-accent-600 text-white py-3 px-6 rounded-lg hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 font-medium">
        CONTACT FOR PRICING
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header with Edit/Delete buttons for authenticated users */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link
                      to="/products"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      PRODUCTS
                    </Link>
                  </li>
                  {product.categories && (
                    <>
                      <li>
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </li>
                      <li>
                        <Link
                          to={`/products?category=${product.categories.slug}`}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {product.categories.name.toUpperCase()}
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <span className="text-gray-900">{product.title.toUpperCase()}</span>
                  </li>
                </ol>
              </nav>
            </div>
            
            {user && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditFormOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Product Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-6">
              {/* Main Image */}
              <div className="mb-6">
                {product.product_hero_image ? (
                  <div className="relative group cursor-pointer" onClick={() => openImageModal(product.product_hero_image!)}>
                    <img
                      src={getImageUrl(product.product_hero_image)}
                      alt={product.title}
                      className="w-full h-96 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.product_gallery && product.product_gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.product_gallery.map((imagePath, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => openImageModal(imagePath)}
                    >
                      <img
                        src={getImageUrl(imagePath)}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                {product.categories && (
                  <p className="text-lg text-gray-600 mb-4">{product.categories.name.toUpperCase()}</p>
                )}
              </div>

              {/* Demo Button */}
              {product.available_for_demo && (
                <div>
                  <button className="bg-gray-100 text-gray-800 py-2 px-4 rounded border border-gray-300 hover:bg-gray-200 font-medium">
                    HOME DEMO AVAILABLE
                  </button>
                </div>
              )}

              {/* Price Display */}
              {product.show_price && product.price && (
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              )}

              {/* Call to Action Button */}
              <div>
                {getCallToActionButton()}
              </div>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2">
                {product.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
                {!product.published && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Unpublished
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote/Testimonial Section */}
        {product.quote && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-8 text-center">
              <blockquote className="text-xl text-gray-700 italic mb-4">
                "{product.quote}"
              </blockquote>
              {product.quote_attribution && (
                <cite className="text-sm text-gray-600 font-medium">
                  — {product.quote_attribution}
                </cite>
              )}
            </div>
          </div>
        )}

        {/* Tabbed Content */}
        <div className="mb-8">
          <ProductTabs product={product} />
        </div>

        {/* Related Products - "Good synergies" */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Good synergies with {product.manufacturer?.name}'s {product.title}
            </h2>
            {relatedLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading related products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.slice(0, 3).map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      {relatedProduct.product_hero_image ? (
                        <img
                          src={getImageUrl(relatedProduct.product_hero_image)}
                          alt={relatedProduct.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                      {relatedProduct.manufacturer && (
                        <p className="text-sm text-gray-600 mb-2">{relatedProduct.manufacturer.name}</p>
                      )}
                      {relatedProduct.brief_description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{relatedProduct.brief_description}</p>
                      )}
                      {relatedProduct.show_price && relatedProduct.price && (
                        <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(relatedProduct.price)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Additional Related Products - "Or check out..." */}
        {relatedProducts.length > 3 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Or check out...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(3, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    {relatedProduct.product_hero_image ? (
                      <img
                        src={getImageUrl(relatedProduct.product_hero_image)}
                        alt={relatedProduct.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                    {relatedProduct.manufacturer && (
                      <p className="text-sm text-gray-600 mb-2">{relatedProduct.manufacturer.name}</p>
                    )}
                    {relatedProduct.brief_description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedProduct.brief_description}</p>
                    )}
                    {relatedProduct.show_price && relatedProduct.price && (
                      <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(relatedProduct.price)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {isImageModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={getImageUrl(selectedImage)}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        <ProductForm
          product={product}
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={handleEditSuccess}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}; 