import React, { useState, useEffect } from 'react';
import { Product, Review, updateProduct, getProductCategories, getManufacturers, ProductCategory, Manufacturer } from '../lib/supabase';
import { ImageUpload } from './ImageUpload';
import { RelationshipSelector } from './RelationshipSelector';

interface ProductEditFormProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    content: product.content || '',
    specs: product.specs || '',
    price: product.price || 0,
    show_price: product.show_price ?? true,
    available_for_demo: product.available_for_demo ?? true,
    available_to_buy_online: product.available_to_buy_online ?? true,
    published: product.published ?? true,
    pairs_well_with: product.pairs_well_with || [],
    also_consider: product.also_consider || [],
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'specs' | 'reviews' | 'relationships'>('basic');

  // Parse existing reviews
  useEffect(() => {
    if (product.reivews_set) {
      if (Array.isArray(product.reivews_set)) {
        setReviews(product.reivews_set);
      } else if (typeof product.reivews_set === 'string') {
        try {
          const parsed = JSON.parse(product.reivews_set);
          setReviews(Array.isArray(parsed) ? parsed : []);
        } catch {
          setReviews([]);
        }
      }
    }
  }, [product.reivews_set]);

  // Load categories and manufacturers
  useEffect(() => {
    const loadData = async () => {
      const [categoriesData, manufacturersData] = await Promise.all([
        getProductCategories(),
        getManufacturers()
      ]);
      setCategories(categoriesData);
      setManufacturers(manufacturersData);
    };
    loadData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReview = () => {
    const newReview: Review = {
      excerpt: '',
      attribution: '',
      link: '',
      date_of_review: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
  };

  const updateReview = (index: number, field: keyof Review, value: string) => {
    setReviews(prev => prev.map((review, i) => 
      i === index ? { ...review, [field]: value } : review
    ));
  };

  const removeReview = (index: number) => {
    setReviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        reivews_set: reviews,
        pairs_well_with: formData.pairs_well_with,
        also_consider: formData.also_consider,
      };
      await updateProduct(product.id, updateData);
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'description', label: 'Description', icon: '📝' },
    { id: 'specs', label: 'Specifications', icon: '⚙️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'relationships', label: 'Relationships', icon: '🔗' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-stone-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Product Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Product Image</label>
            <ImageUpload
              onUpload={(imageUrl) => handleInputChange('product_hero_image', imageUrl)}
              currentImage={product.product_hero_image}
              folder="products"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
              <div className="text-sm text-stone-600 py-3">
                {product.categories?.name || 'No category assigned'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.show_price}
                onChange={(e) => handleInputChange('show_price', e.target.checked)}
                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <span className="text-sm font-medium text-stone-700">Show Price</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.available_for_demo}
                onChange={(e) => handleInputChange('available_for_demo', e.target.checked)}
                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <span className="text-sm font-medium text-stone-700">Available for Demo</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.available_to_buy_online}
                onChange={(e) => handleInputChange('available_to_buy_online', e.target.checked)}
                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <span className="text-sm font-medium text-stone-700">Available Online</span>
            </label>
          </div>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => handleInputChange('published', e.target.checked)}
              className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
            />
            <span className="text-sm font-medium text-stone-700">Published</span>
          </label>
        </div>
      )}

      {activeTab === 'description' && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Product Description</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={12}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            placeholder="Enter the product description. You can use HTML tags for formatting."
          />
          <p className="text-sm text-stone-500 mt-2">
            You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt; for formatting.
          </p>
        </div>
      )}

      {activeTab === 'specs' && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Technical Specifications</label>
          <textarea
            value={formData.specs}
            onChange={(e) => handleInputChange('specs', e.target.value)}
            rows={12}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            placeholder="Enter the technical specifications. You can use HTML tags for formatting."
          />
          <p className="text-sm text-stone-500 mt-2">
            You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt; for formatting.
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-stone-900">Product Reviews</h3>
            <button
              onClick={addReview}
              className="inline-flex items-center px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors duration-200 text-sm font-medium"
            >
              <span>Add Review</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-medium text-stone-900 mb-2">No Reviews Yet</h3>
              <p className="text-stone-600">Add the first review for this product.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border border-stone-200 rounded-xl p-6 bg-stone-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-stone-900">Review {index + 1}</h4>
                    <button
                      onClick={() => removeReview(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Attribution</label>
                      <input
                        type="text"
                        value={review.attribution || ''}
                        onChange={(e) => updateReview(index, 'attribution', e.target.value)}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                        placeholder="Reviewer name or publication"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={review.date_of_review || ''}
                        onChange={(e) => updateReview(index, 'date_of_review', e.target.value)}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Review Link (Optional)</label>
                    <input
                      type="url"
                      value={review.link || ''}
                      onChange={(e) => updateReview(index, 'link', e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Review Excerpt</label>
                    <textarea
                      value={review.excerpt || ''}
                      onChange={(e) => updateReview(index, 'excerpt', e.target.value)}
                      rows={6}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      placeholder="Enter the review excerpt. You can use HTML tags for formatting."
                    />
                    <p className="text-sm text-stone-500 mt-2">
                      You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt; for formatting.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-stone-900 mb-2">Product Relationships</h3>
            <p className="text-stone-600">Manage which products this item pairs well with and alternatives to consider.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pairs Well With */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h4 className="text-lg font-medium text-stone-900 mb-4">Pairs Well With</h4>
              <p className="text-sm text-stone-600 mb-4">
                Choose products from other categories that work well with this item.
              </p>
              <RelationshipSelector
                selectedIds={formData.pairs_well_with}
                onSelectionChange={(ids) => handleInputChange('pairs_well_with', ids)}
                excludeProductId={product.id}
                placeholder="Search for products to pair with..."
              />
            </div>

            {/* Also Consider */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h4 className="text-lg font-medium text-stone-900 mb-4">Also Consider</h4>
              <p className="text-sm text-stone-600 mb-4">
                Choose alternative products in the same category and price range.
              </p>
              <RelationshipSelector
                selectedIds={formData.also_consider}
                onSelectionChange={(ids) => handleInputChange('also_consider', ids)}
                excludeProductId={product.id}
                placeholder="Search for alternative products..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-stone-200">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors duration-200 font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

