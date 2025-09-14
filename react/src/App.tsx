import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CategoriesProvider } from './contexts/CategoriesContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Immediate load for critical pages
import { Home } from './pages/Home';

// Lazy load non-critical pages
const ProductCategories = lazy(() => import('./pages/ProductCategories').then(module => ({ default: module.ProductCategories })));
const Products = lazy(() => import('./pages/Products').then(module => ({ default: module.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Manufacturers = lazy(() => import('./pages/Manufacturers').then(module => ({ default: module.Manufacturers })));
const ManufacturerDetail = lazy(() => import('./pages/ManufacturerDetail').then(module => ({ default: module.ManufacturerDetail })));
const News = lazy(() => import('./pages/News').then(module => ({ default: module.News })));
const NewsDetail = lazy(() => import('./pages/NewsDetail').then(module => ({ default: module.NewsDetail })));
const PreOwned = lazy(() => import('./pages/PreOwned').then(module => ({ default: module.PreOwned })));
const PreOwnedDetail = lazy(() => import('./pages/PreOwnedDetail'));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Admin = lazy(() => import('./pages/Admin'));

// Demo pages - lazy load since they're not production
const Moodboard = lazy(() => import('./pages/Moodboard').then(module => ({ default: module.Moodboard })));
const Moodboard2 = lazy(() => import('./pages/Moodboard2').then(module => ({ default: module.Moodboard2 })));
const ProductCardDemo = lazy(() => import('./pages/ProductCardDemo').then(module => ({ default: module.ProductCardDemo })));
const DesignSystemDemo = lazy(() => import('./pages/DesignSystemDemo').then(module => ({ default: module.DesignSystemDemo })));
const ButtonDemo = lazy(() => import('./pages/ButtonDemo').then(module => ({ default: module.ButtonDemo })));
const CardDemo = lazy(() => import('./pages/CardDemo').then(module => ({ default: module.CardDemo })));
const HeaderDesignDemo = lazy(() => import('./pages/HeaderDesignDemo').then(module => ({ default: module.HeaderDesignDemo })));

// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-warm-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mx-auto mb-4"></div>
      <p className="text-stone-600">Loading...</p>
    </div>
  </div>
);

const LayoutWrapper: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-warm-white" style={{ paddingBottom: '30rem' }}>
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-24'} relative z-10`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/list" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/products" element={<ProductCategories />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/manufacturers/:slug" element={<ManufacturerDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/pre-owned" element={<PreOwned />} />
            <Route path="/pre-owned/:id" element={<PreOwnedDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/moodboard" element={<Moodboard />} />
            <Route path="/moodboard2" element={<Moodboard2 />} />
            <Route path="/productcard-demo" element={<ProductCardDemo />} />
            <Route path="/design-system" element={<DesignSystemDemo />} />
            <Route path="/button-demo" element={<ButtonDemo />} />
            <Route path="/card-demo" element={<CardDemo />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Header Demo Route - No header/footer to showcase demo headers */}
          <Route path="/header-demo" element={<HeaderDesignDemo />} />
          
          {/* All other routes with normal layout */}
          <Route path="*" element={<LayoutWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const AppWithProviders: React.FC = () => {
  return (
    <CategoriesProvider>
      <App />
    </CategoriesProvider>
  );
}

export default AppWithProviders;
