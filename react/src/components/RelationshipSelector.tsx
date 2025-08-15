import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Product, getProductsWithCategories } from '../lib/supabase';

interface RelationshipSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  excludeProductId?: string; // Exclude current product from suggestions
  placeholder?: string;
  className?: string;
}

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  selectedIds,
  onSelectionChange,
  excludeProductId,
  placeholder = 'Select products...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load products for selection
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productsData = await getProductsWithCategories();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search and exclusions
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.manufacturer && typeof product.manufacturer === 'object' && 
                          product.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const notExcluded = !excludeProductId || product.id !== excludeProductId;
    const notAlreadySelected = !selectedIds.includes(product.id);
    
    return matchesSearch && notExcluded && notAlreadySelected;
  });

  const selectedProducts = products.filter(product => selectedIds.includes(product.id));

  const addProduct = (productId: string) => {
    if (!selectedIds.includes(productId)) {
      onSelectionChange([...selectedIds, productId]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const removeProduct = (productId: string) => {
    onSelectionChange(selectedIds.filter(id => id !== productId));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Products Display */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-stone-700">Selected Products</label>
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center space-x-3">
                  {product.product_hero_image && (
                    <img
                      src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${product.product_hero_image}`}
                      alt={product.title}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-stone-900">{product.title}</p>
                    <p className="text-xs text-stone-600">
                      {product.manufacturer && typeof product.manufacturer === 'object' 
                        ? product.manufacturer.name 
                        : product.manufacturer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-1 hover:bg-stone-200 rounded transition-colors duration-200"
                >
                  <XMarkIcon className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Selection */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-10 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-stone-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-600 mx-auto"></div>
                <p className="mt-2">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-stone-600">
                {searchTerm ? 'No products found' : 'Start typing to search products'}
              </div>
            ) : (
              <div className="py-2">
                {filteredProducts.slice(0, 10).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product.id)}
                    className="w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors duration-200 flex items-center space-x-3"
                  >
                    {product.product_hero_image && (
                      <img
                        src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${product.product_hero_image}`}
                        alt={product.title}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-stone-900">{product.title}</p>
                      <p className="text-xs text-stone-600">
                        {product.manufacturer && typeof product.manufacturer === 'object' 
                          ? product.manufacturer.name 
                          : product.manufacturer}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

