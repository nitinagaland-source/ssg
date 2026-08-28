import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SelectedShopProvider } from './context/SelectedShopContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AdminApp } from './admin/AdminApp';

// Layout
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ShopPickerModal } from './components/layout/ShopPickerModal';
import { WhatsAppFloater } from './components/layout/WhatsAppFloater';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { GsapPageRevealProvider } from './components/common/GsapReveal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPickerPage } from './pages/ShopPickerPage';
import { SchoolsPage } from './pages/SchoolsPage';
import { SchoolDetailPage } from './pages/SchoolDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ComponentShowcase } from './pages/ComponentShowcase';

const NotFoundPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
    <div className="text-4xl font-serif-accent text-[#FF5A1F]">*</div>
    <h1 className="text-3xl font-extrabold font-display text-[#0A0A0A]">Page Not Found</h1>
    <p className="text-sm text-[#6B6B6B] max-w-sm mx-auto">The page you were looking for doesn&apos;t exist or was moved.</p>
    <div className="pt-2">
      <Link to="/" className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#FF5A1F] transition-colors">
        Return to Homepage
      </Link>
    </div>
  </div>
);

function StoreFront() {
  return (
    <ToastProvider>
      <SelectedShopProvider>
        <CartProvider>
          <GsapPageRevealProvider>
            <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A] font-body selection:bg-[#FF5A1F]/20 selection:text-[#0A0A0A]">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/select-shop" element={<ShopPickerPage />} />
                  <Route path="/schools" element={<SchoolsPage />} />
                  <Route path="/schools/:schoolSlug" element={<SchoolDetailPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:categorySlug" element={<CategoryDetailPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:productSlug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
                  <Route path="/order/track" element={<OrderTrackingPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/dev/components" element={<ComponentShowcase />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <ShopPickerModal />
              <WhatsAppFloater />
              <MobileBottomNav />
            </div>
          </GsapPageRevealProvider>
        </CartProvider>
      </SelectedShopProvider>
    </ToastProvider>
  );
}

function AppRouter() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }
  return <StoreFront />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}
