import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductBySlug, deleteProduct } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { ProductForm } from '../components/ProductForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { parseStatamicContent } from '../lib/utils';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Edit/Delete buttons for authenticated users */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <button
                      onClick={() => navigate('/products')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Products
                    </button>
                  </li>
                  {product.categories && (
                    <>
                      <li>
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(`/products/list?category=${product.categories?.id}`)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {product.categories?.name}
                        </button>
                      </li>
                    </>
                  )}
                  <li>
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <span className="text-gray-900 dark:text-white">{product.title}</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
              {product.brief_description && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">{product.brief_description}</p>
              )}
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

        {/* Product Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-6">
              {product.product_hero_image ? (
                <img
                  src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${product.product_hero_image}`}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Product Gallery */}
              {product.product_gallery && product.product_gallery.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Images</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {product.product_gallery.map((imagePath, index) => (
                      <img
                        key={index}
                        src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${imagePath}`}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Product Meta */}
                <div className="flex items-center space-x-4">
                  {product.categories && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {product.categories.name}
                    </span>
                  )}
                  {product.manufacturer && (
                    <Link
                      to={`/manufacturers/${product.manufacturer.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {product.manufacturer.name}
                    </Link>
                  )}
                  {product.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Featured
                    </span>
                  )}
                  {!product.published && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      Unpublished
                    </span>
                  )}
                </div>

                {/* Product Content */}
                {product.content && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{parseStatamicContent(product.content)}</div>
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Product ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{product.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{product.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(product.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(product.updated_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

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