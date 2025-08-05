import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import { Contact } from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
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
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
