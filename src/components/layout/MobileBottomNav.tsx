import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const MobileBottomNav: React.FC = () => {
  const { cartCount } = useCart();
  const { getGeneralQueryUrl } = useWhatsApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E0] px-3 py-2 flex items-center justify-around select-none">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors py-1 ${
            isActive ? 'text-[#7C3AED]' : 'text-[#6B6B6B]'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors py-1 ${
            isActive ? 'text-[#7C3AED]' : 'text-[#6B6B6B]'
          }`
        }
      >
        <Grid className="w-4 h-4" />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors py-1 ${
            isActive ? 'text-[#7C3AED]' : 'text-[#6B6B6B]'
          }`
        }
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors py-1 ${
            isActive ? 'text-[#7C3AED]' : 'text-[#6B6B6B]'
          }`
        }
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-3.5 h-3.5 bg-[#7C3AED] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
        <span>Bag</span>
      </NavLink>

      <a
        href={getGeneralQueryUrl()}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#25D366] py-1"
      >
        <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
};
