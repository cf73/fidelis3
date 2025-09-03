import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CategoriesProvider } from './contexts/CategoriesContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ProductCategories } from './pages/ProductCategories';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Manufacturers } from './pages/Manufacturers';
import { ManufacturerDetail } from './pages/ManufacturerDetail';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { PreOwned } from './pages/PreOwned';
import PreOwnedDetail from './pages/PreOwnedDetail';
import { Contact } from './pages/Contact';
import { Moodboard } from './pages/Moodboard';
import { Moodboard2 } from './pages/Moodboard2';
import { ProductCardDemo } from './pages/ProductCardDemo';
import { DesignSystemDemo } from './pages/DesignSystemDemo';
import { ButtonDemo } from './pages/ButtonDemo';
import { CardDemo } from './pages/CardDemo';
import { HeaderDesignDemo } from './pages/HeaderDesignDemo';
import Admin from './pages/Admin';

const LayoutWrapper: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-24'}`}>
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
