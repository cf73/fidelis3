import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Product, ProductCategory, Manufacturer, createProduct, updateProduct, uploadImage, deleteImage, getProductCategories, getManufacturers } from '../lib/supabase';

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  slug: string;
  content: string;
  brief_description: string;
  featured: boolean;
  published: boolean;
  category_id: string;
  manufacturer_id: string;
  product_hero_image: string;
  product_gallery: string[];
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    content: '',
    brief_description: '',
    featured: false,
    published: true,
    category_id: '',
    manufacturer_id: '',
    product_hero_image: '',
    product_gallery: [],
  });

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  // Load categories and manufacturers
  useEffect(() => {
    const loadData = async () => {
      const [categoriesData, manufacturersData] = await Promise.all([
        getProductCategories(),
        getManufacturers(),
      ]);
      setCategories(categoriesData);
      setManufacturers(manufacturersData);
    };
    loadData();
  }, []);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        slug: product.slug || '',
        content: product.content || '',
        brief_description: product.brief_description || '',
        featured: product.featured || false,
        published: product.published !== false,
        category_id: product.categories?.[0]?.id || '',
        manufacturer_id: product.manufacturer?.id || '',
        product_hero_image: product.product_hero_image || '',
        product_gallery: product.product_gallery || [],
      });
      setUploadedImages(product.product_gallery || []);
    }
  }, [product]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    }
  };

  // Image upload with drag and drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    setError('');

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} is not a supported image type.`);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

        // Upload to Supabase
        const { error } = await uploadImage(file, filename);
        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        return filename;
      });

      const uploadedFilenames = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedFilenames]);
      setFormData(prev => ({
        ...prev,
        product_gallery: [...prev.product_gallery, ...uploadedFilenames],
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = async (imagePath: string) => {
    try {
      // Remove from Supabase storage
      await deleteImage(imagePath);
      
      // Update state
      setUploadedImages(prev => prev.filter(img => img !== imagePath));
      setFormData(prev => ({
        ...prev,
        product_gallery: prev.product_gallery.filter(img => img !== imagePath),
      }));
      
      // If it was the hero image, clear it
      if (formData.product_hero_image === imagePath) {
        setFormData(prev => ({
          ...prev,
          product_hero_image: '',
        }));
      }
    } catch (err) {
      console.error('Error removing image:', err);
    }
  };

  const setHeroImage = (imagePath: string) => {
    setFormData(prev => ({
      ...prev,
      product_hero_image: imagePath,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.category_id) {
      setError('Product category is required');
      setLoading(false);
      return;
    }

    if (!formData.manufacturer_id) {
      setError('Manufacturer is required');
      setLoading(false);
      return;
    }

    if (!formData.product_hero_image) {
      setError('Hero image is required');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        brief_description: formData.brief_description.trim(),
        featured: formData.featured,
        published: formData.published,
        product_hero_image: formData.product_hero_image,
        product_gallery: formData.product_gallery,
      };

      if (product) {
        // Update existing product
        const { error } = await updateProduct(product.id, productData);
        if (error) throw error;
      } else {
        // Create new product
        const { error } = await createProduct(productData);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category and Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="manufacturer_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manufacturer *
              </label>
              <select
                id="manufacturer_id"
                name="manufacturer_id"
                value={formData.manufacturer_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a manufacturer</option>
                {manufacturers.map(manufacturer => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="brief_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brief Description
            </label>
            <textarea
              id="brief_description"
              name="brief_description"
              value={formData.brief_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images
            </label>
            
            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isDragActive
                  ? 'Drop the images here...'
                  : 'Drag and drop images here, or click to select files'
                }
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </div>

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uploaded Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((imagePath, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${imagePath}`}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                          <button
                            type="button"
                            onClick={() => setHeroImage(imagePath)}
                            className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
                          >
                            {formData.product_hero_image === imagePath ? 'Hero' : 'Set Hero'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(imagePath)}
                            className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {formData.product_hero_image === imagePath && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Hero
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Toggles */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Product</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
            </label>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 