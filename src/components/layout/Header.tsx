import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, GraduationCap, X } from 'lucide-react';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { useCart } from '../../context/CartContext';
import { ShopPickerModal } from './ShopPickerModal';

export const Header: React.FC = () => {
  const { selectedShop } = useSelectedShop();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 transition-all">
        {/* Top subtle notification ribbon with Purple Gradient */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-900 text-purple-100 text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <span>Official 2026 school session booklists available now. Free delivery on orders over Rs. 500.</span>
          <Link to="/schools" className="hidden sm:inline text-amber-300 hover:text-white underline underline-offset-2 font-semibold">
            Find your school
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-baseline gap-1.5 group select-none">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter font-display bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                SSG
              </span>
              <span className="hidden md:inline text-xs font-semibold text-purple-900/60 tracking-tight uppercase border-l border-purple-200 pl-2">
                Saraswati Student Gallery
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md mx-6 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbooks, uniforms, class, school..."
              className="w-full bg-white border border-purple-100 rounded-full py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 transition-all"
            />
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-neutral-400 hover:text-purple-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Nav Links & Controls */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-800">
            <Link to="/schools" className="flex items-center gap-1.5 hover:text-purple-600 transition-colors py-1">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Schools</span>
            </Link>
            <Link to="/categories" className="hover:text-purple-600 transition-colors py-1">
              Categories
            </Link>
            <Link to="/about" className="hover:text-purple-600 transition-colors py-1">
              About
            </Link>

            {/* Shop Selector Pill */}
            <button
              onClick={() => setIsShopModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-300 text-xs font-medium bg-purple-50/60 text-purple-950 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all select-none shadow-xs"
              title="Change your local store"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span className="max-w-[130px] truncate">
                {selectedShop ? selectedShop.name : 'Select Store'}
              </span>
              <span className="text-[10px] opacity-70">▾</span>
            </button>

            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-purple-50 transition-colors select-none text-neutral-800 hover:text-purple-700"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsShopModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-purple-200 text-[11px] font-medium bg-purple-50/60 text-purple-900"
            >
              <MapPin className="w-3 h-3 text-purple-600" />
              <span className="max-w-[85px] truncate">
                {selectedShop ? selectedShop.city : 'Store'}
              </span>
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full text-neutral-800"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 min-w-4 h-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Custom 2-line hamburger button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 w-9 h-9 flex flex-col justify-center items-center gap-1.5 focus:outline-none text-purple-900"
              aria-label="Toggle navigation menu"
            >
              <span
                className={`w-5 h-0.5 bg-purple-950 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-purple-950 transition-transform duration-200 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-0' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100 bg-white px-5 py-6 space-y-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, schools..."
                className="w-full bg-white border border-purple-100 rounded-full py-2.5 pl-10 pr-4 text-sm text-neutral-900 focus:outline-none focus:border-purple-600"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
            </form>

            <div className="flex flex-col gap-3 pt-2 text-base font-medium">
              <Link
                to="/schools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 flex items-center justify-between border-b border-purple-50 text-neutral-900 hover:text-purple-600"
              >
                <span>Find Your School</span>
                <span className="text-xs text-purple-600 font-semibold">CBSE / SEBA / ICSE →</span>
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-purple-50 text-neutral-900 hover:text-purple-600"
              >
                Browse All Categories
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-purple-50 text-neutral-900 hover:text-purple-600"
              >
                All Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-purple-50 text-neutral-900 hover:text-purple-600"
              >
                About SSG
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-neutral-900 hover:text-purple-600"
              >
                Shop Locations & Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Shop Selector Modal */}
      <ShopPickerModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
    </>
  );
};
