import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductBySlug, deleteProduct, getProductsByIds, getImageUrl } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { ContextualCMS, CMSTrigger } from '../components/ContextualCMS';
import { ImageUpload } from '../components/ImageUpload';
import { RelationshipSelector } from '../components/RelationshipSelector';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { ProductTabs, hasTabContent } from '../components/ProductTabs';
import { ProductEditForm } from '../components/ProductEditForm';


export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [pairsWellWithProducts, setPairsWellWithProducts] = useState<Product[]>([]);
  const [alsoConsiderProducts, setAlsoConsiderProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
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
        
        // Load cross-referenced products
        if (productData) {
          setRelatedLoading(true);
          
          // Load pairs_well_with products
          if (productData.pairs_well_with && productData.pairs_well_with.length > 0) {
            const pairsProducts = await getProductsByIds(productData.pairs_well_with);
            setPairsWellWithProducts(pairsProducts);
          }
          
          // Load also_consider products
          if (productData.also_consider && productData.also_consider.length > 0) {
            const alsoProducts = await getProductsByIds(productData.also_consider);
            setAlsoConsiderProducts(alsoProducts);
          }
          
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
        <div className="space-y-3">
          <button className="w-full bg-slate-100 text-slate-800 py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 font-medium transition-all duration-200">
            HOME DEMO AVAILABLE
          </button>
          <Link
            to={`/contact?product=${encodeURIComponent(product.title)}&manufacturer=${encodeURIComponent(product.manufacturer?.name || '')}&demo=store`}
            className="w-full bg-stone-800 text-white py-3 px-6 rounded-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 font-medium transition-colors duration-200 block text-center"
          >
            BOOK STORE DEMO
          </Link>
        </div>
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
        <button className="w-full bg-stone-600 text-white py-3 px-6 rounded-lg hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 font-medium">
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
      <div className="min-h-screen bg-[#fffcf9] py-12">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fffcf9] py-12">
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
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Premium Hero Section */}
      <div className="relative bg-[#fffcf9] border-b border-stone-200">
        <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3 text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-stone-500 hover:text-stone-700 transition-colors duration-200 font-medium"
                >
                  Products
                </Link>
              </li>
              {product.categories && (
                <>
                  <li>
                    <svg className="flex-shrink-0 h-4 w-4 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <Link
                      to={`/products?category=${product.categories.slug}`}
                      className="text-stone-500 hover:text-stone-700 transition-colors duration-200 font-medium"
                    >
                      {product.categories.name}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <svg className="flex-shrink-0 h-4 w-4 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-stone-900 font-medium">{product.title}</span>
              </li>
            </ol>
          </nav>

          {/* Admin Actions */}
          {user && (
            <div className="absolute top-8 right-8 flex space-x-3">
              <CMSTrigger
                onClick={() => setIsCMSOpen(true)}
                label="Edit Product"
                context="product"
              />
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
              >
                Delete Product
              </button>
            </div>
          )}

          {/* Product Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image - Now sits directly on background */}
              <div className="relative group">
                {product.product_hero_image ? (
                  <div 
                    className="relative cursor-pointer" 
                    onClick={() => openImageModal(product.product_hero_image!)}
                  >
                    <img
                      src={getImageUrl(product.product_hero_image)}
                      alt={product.title}
                      className="w-full h-auto max-h-[600px] object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to enlarge
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[500px] bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-stone-300">
                    <div className="text-center">
                      <svg className="h-16 w-16 text-stone-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-stone-500 font-medium">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.product_gallery && product.product_gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.product_gallery.map((imagePath, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md"
                      onClick={() => openImageModal(imagePath)}
                    >
                      <img
                        src={getImageUrl(imagePath)}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Category and Manufacturer Links */}
              <div className="flex flex-wrap gap-3">
                {product.categories && (
                  <Link
                    to={`/products?category=${product.categories.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors duration-200"
                  >
                    {product.categories.name}
                  </Link>
                )}
                {product.manufacturer && (
                  <Link
                    to={`/manufacturers/${product.manufacturer.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors duration-200"
                  >
                    {product.manufacturer.name}
                  </Link>
                )}
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-light text-stone-900 leading-tight tracking-tight mb-4">
                  {product.title}
                </h1>
                {product.manufacturer && (
                  <p className="text-xl text-stone-600 font-medium">
                    by{' '}
                    <Link
                      to={`/manufacturers/${product.manufacturer.slug}`}
                      className="hover:text-stone-800 transition-colors duration-200 underline decoration-stone-300 hover:decoration-stone-600"
                    >
                      {product.manufacturer.name}
                    </Link>
                  </p>
                )}
              </div>

              {/* Price Display */}
              {product.show_price && product.price && (
                <div className="text-4xl font-light text-stone-900">
                  {formatPrice(product.price)}
                </div>
              )}

              {/* Demo Badge */}
              {product.available_for_demo && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Home Demo Available
                </div>
              )}

              {/* Call to Action */}
              <div className="pt-4">
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
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quote/Testimonial Section - Timeline-style Layout */}
        {product.quote && (
          <div className="mb-32 flex flex-col items-center">
            {/* Top vertical line - above quote */}
            <div className="w-px h-32 bg-stone-300 mb-16"></div>
            
            <div className="max-w-4xl mx-auto px-8 text-center">
              <blockquote>
                {/* Main quote - clean and severe */}
                <div className="text-3xl lg:text-4xl xl:text-5xl font-light text-stone-900 leading-[1.4] tracking-wide mb-12">
                  {product.quote}
                </div>
              </blockquote>
              
              {/* Attribution - minimal and refined */}
              {product.quote_attribution && (
                <div className="mt-16">
                  <div className="text-sm text-stone-500 font-light tracking-[0.3em] uppercase">
                    — {product.quote_attribution}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom vertical line - below quote */}
            <div className="w-px h-32 bg-stone-300 mt-16"></div>
          </div>
        )}

        {/* Tabbed Content - only show if there are tabs with content */}
        {hasTabContent(product) && (
          <div className="mb-32">
            <ProductTabs product={product} />
          </div>
        )}
      </div>

      {/* Pairs Well With Products */}
      {pairsWellWithProducts.length > 0 && (
        <div className="bg-stone-50 py-24">
          <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-stone-900 mb-4">
                Good synergies with {product.manufacturer?.name}'s {product.title}
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                These products work beautifully together to create an exceptional audio experience.
              </p>
            </div>
          
            {relatedLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto mb-4"></div>
                <p className="text-stone-600">Loading related products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pairsWellWithProducts.map((relatedProduct: Product) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.slug}`}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-w-16 aspect-h-12">
                      {relatedProduct.product_hero_image ? (
                        <img
                          src={getImageUrl(relatedProduct.product_hero_image)}
                          alt={relatedProduct.title}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-medium text-stone-900 mb-2 group-hover:text-stone-700 transition-colors duration-200">
                        {relatedProduct.title}
                      </h3>
                      {relatedProduct.manufacturer && (
                        <p className="text-sm text-stone-600 mb-3 font-medium">
                          {relatedProduct.manufacturer.name}
                        </p>
                      )}
                      {relatedProduct.brief_description && (
                        <p className="text-sm text-stone-600 line-clamp-2 mb-3">{relatedProduct.brief_description}</p>
                      )}
                      {relatedProduct.show_price && relatedProduct.price && (
                        <p className="text-lg font-medium text-stone-900">{formatPrice(relatedProduct.price)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Also Consider Products */}
      {alsoConsiderProducts.length > 0 && (
        <div className="bg-stone-50 py-24">
          <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-stone-900 mb-4">Also consider</h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                More exceptional products that might interest you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alsoConsiderProducts.map((relatedProduct: Product) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    {relatedProduct.product_hero_image ? (
                      <img
                        src={getImageUrl(relatedProduct.product_hero_image)}
                        alt={relatedProduct.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-stone-900 mb-2 group-hover:text-stone-700 transition-colors duration-200">
                      {relatedProduct.title}
                    </h3>
                    {relatedProduct.manufacturer && (
                      <p className="text-sm text-stone-600 mb-3 font-medium">
                        {relatedProduct.manufacturer.name}
                      </p>
                    )}
                    {relatedProduct.brief_description && (
                      <p className="text-sm text-stone-600 line-clamp-2 mb-3">{relatedProduct.brief_description}</p>
                    )}
                    {relatedProduct.show_price && relatedProduct.price && (
                      <p className="text-lg font-medium text-stone-900">{formatPrice(relatedProduct.price)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
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

      {/* Contextual CMS */}
      <ContextualCMS
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        title={`Edit ${product?.title || 'Product'}`}
        context="product"
      >
        {product && (
          <ProductEditForm
            product={product}
            onSave={handleEditSuccess}
            onCancel={() => setIsCMSOpen(false)}
          />
        )}
      </ContextualCMS>

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
  );
};