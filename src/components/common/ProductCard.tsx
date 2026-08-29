import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { useCart } from '../../context/CartContext';
import { Check, ShieldCheck, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { selectedShop } = useSelectedShop();
  const { addToCart, items } = useCart();

  const shopStock = selectedShop ? (product.stockByShop?.[selectedShop.id] ?? 0) : (Object.values(product.stockByShop || {}).reduce((s, v) => s + (v as number), 0) || 0);
  const isOutOfStock = shopStock <= 0;
  const isInCart = items.some((item) => item.productId === product.id);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1, selectedShop?.id || 'shop-guwahati-panbazar');
  };

  return (
    <article className="group flex flex-col justify-between select-none">
      {/* Product Sub-page Navigation Link wrapper */}
      <Link
        to={`/products/${product.slug}`}
        className="block group/link"
      >
        {/* Full-bleed Portrait Image Frame */}
        <div className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/70 shadow-2xs">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Subtle Badge */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
            {discountPercent > 0 ? (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                <span>{discountPercent}% OFF</span>
              </span>
            ) : product.categoryId === 'textbooks' ? (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF5A1F]" />
                <span>2026 Prescribed</span>
              </span>
            ) : product.categoryId === 'notebooks' || product.categoryId === 'copies' ? (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                <span>75 GSM Bright</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                <span>{product.brand || '2026 Edition'}</span>
              </span>
            )}
          </div>

          {/* Stock Status Tag */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-white text-neutral-900 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Metadata & Title */}
        <div className="mt-2.5 sm:mt-3 space-y-1">
          <h3 className="text-xs sm:text-sm font-semibold text-purple-950/90 leading-snug line-clamp-2 group-hover/link:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-sm sm:text-base font-bold font-display text-purple-950">
              Rs. {product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                Rs. {product.mrp}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Full-width Add to Cart Button (Matching Reference Image) */}
      <div className="mt-2.5 sm:mt-3">
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
            isInCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              : isOutOfStock
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'purple-button-flow shadow-md shadow-purple-600/25'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
