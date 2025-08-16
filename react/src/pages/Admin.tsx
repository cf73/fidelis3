import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  adminListHomeHeroImages,
  createHomeHeroImage,
  updateHomeHeroImage,
  deleteHomeHeroImage,
  uploadImage,
  getImageUrl,
  type HomeHeroImage,
  adminGetAllProducts,
  type Product,
} from '../lib/supabase';
import { Section, Container, H1, Body, Grid, Button } from '../components/ui';
import { ProductForm } from '../components/ProductForm';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [heroItems, setHeroItems] = useState<HomeHeroImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [credit, setCredit] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'products'>('hero');

  const refreshHeroImages = async () => {
    const data = await adminListHomeHeroImages();
    setHeroItems(data);
  };

  const refreshProducts = async () => {
    const data = await adminGetAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    refreshHeroImages();
    refreshProducts();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const { error: upErr } = await uploadImage(file, filename);
      if (upErr) throw upErr;
      const { error: insErr } = await createHomeHeroImage({
        image: filename,
        alt_text: alt || null as any,
        credit: credit || null as any,
        published: true,
      } as any);
      if (insErr) throw insErr;
      setFile(null); setAlt(''); setCredit('');
      await refreshHeroImages();
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (item: HomeHeroImage) => {
    await updateHomeHeroImage(item.id, { published: !item.published } as any);
    await refreshHeroImages();
  };

  const remove = async (id: string) => {
    await deleteHomeHeroImage(id);
    await refreshHeroImages();
  };

  const handleProductSave = () => {
    setEditingProduct(null);
    refreshProducts();
  };

  const handleProductCancel = () => {
    setEditingProduct(null);
  };

  if (!user) {
    return (
      <Section variant="default" background="white">
        <Container>
          <H1 className="mb-4">Admin</H1>
          <Body>Please sign in to access the admin tools.</Body>
        </Container>
      </Section>
    );
  }

  if (editingProduct) {
    return (
      <Section variant="default" background="white">
        <Container>
          <div className="mb-6">
            <button
              onClick={handleProductCancel}
              className="inline-flex items-center space-x-2 text-stone-600 hover:text-stone-800 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Admin</span>
            </button>
            <H1>Edit Product: {editingProduct.title}</H1>
          </div>
          <ProductForm
            product={editingProduct}
            onSave={handleProductSave}
            onCancel={handleProductCancel}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section variant="default" background="white">
      <Container>
        <H1 className="mb-6">Admin</H1>
        
        {/* Tab Navigation */}
        <div className="border-b border-stone-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('hero')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'hero'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              Hero Images
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'products'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              Products
            </button>
          </nav>
        </div>

        {activeTab === 'hero' && (
          <>
            <div className="mb-10 p-6 border rounded-xl">
              <h2 className="text-xl font-medium mb-4">Upload Hero Image</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm text-stone-600 mb-2">File</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Alt text</label>
                  <input className="w-full border rounded-md px-3 py-2" value={alt} onChange={(e) => setAlt(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Credit</label>
                  <input className="w-full border rounded-md px-3 py-2" value={credit} onChange={(e) => setCredit(e.target.value)} />
                </div>
                <div>
                  <button onClick={handleUpload} disabled={loading || !file} className="btn-primary disabled:opacity-50">{loading ? 'Uploading…' : 'Upload'}</button>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-medium mb-4">Home Hero Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroItems.map((it) => (
                <div key={it.id} className="border rounded-xl overflow-hidden">
                  <div className="aspect-[16/9] bg-stone-100">
                    {it.image && (
                      <img src={getImageUrl(it.image)} alt={it.alt_text || ''} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-sm text-stone-700 line-clamp-1">{it.alt_text}</div>
                    <div className="text-xs text-stone-500 line-clamp-1">{it.credit}</div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => togglePublish(it)} className="btn-secondary">
                        {it.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => remove(it.id)} className="btn-secondary">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <h2 className="text-xl font-medium mb-4">Product Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="aspect-[16/9] bg-stone-100">
                    {product.product_hero_image && (
                      <img 
                        src={`https://myrdvcihcqphixvunvkv.supabase.co/storage/v1/object/public/images/${product.product_hero_image}`} 
                        alt={product.title} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-stone-900 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-stone-500">
                        {product.manufacturer?.name} • {product.categories?.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.published ? 'Published' : 'Draft'}
                      </span>
                      {product.show_price && product.price && (
                        <span className="text-stone-700 font-medium">
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 btn-primary text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
};

export default Admin;


