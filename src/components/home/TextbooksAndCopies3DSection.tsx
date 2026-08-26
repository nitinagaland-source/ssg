import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { useCart } from '../../context/CartContext';
import {
  BookOpen,
  FileText,
  Check,
  Plus,
  Layers,
  ChevronRight,
  ShieldCheck,
  Boxes,
  Truck,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

interface TextbooksAndCopies3DSectionProps {
  products: Product[];
  activeShopName: string;
}

type TabType = 'all' | 'textbooks' | 'notebooks' | 'bundles';

export const TextbooksAndCopies3DSection: React.FC<TextbooksAndCopies3DSectionProps> = ({
  products,
  activeShopName,
}) => {
  const navigate = useNavigate();
  const { selectedShop } = useSelectedShop();
  const { addToCart, items } = useCart();

  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter textbooks and notebooks
  const bookAndNotebookProducts = products.filter(
    (p) => p.categoryId === 'textbooks' || p.categoryId === 'notebooks'
  );

  const filteredProducts = bookAndNotebookProducts.filter((p) => {
    if (activeTab === 'textbooks') return p.categoryId === 'textbooks' && !p.name.includes('Bundle');
    if (activeTab === 'notebooks') return p.categoryId === 'notebooks';
    if (activeTab === 'bundles') return p.name.includes('Bundle') || p.name.includes('Set');
    return true;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const stock = selectedShop ? (product.stockByShop[selectedShop.id] ?? 0) : 10;
    if (stock <= 0) return;
    addToCart(product.id, 1, selectedShop?.id || 'shop-guwahati-panbazar');
  };

  return (
    <section id="featured-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* ========================================================================= */}
      {/* 1. SECTION HEADER: Editorial title with "View more >" link               */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-purple-100/80 pb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold purple-title-flow tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-body">
              Teacher-prescribed NCERT, SEBA &amp; CBSE textbooks with heavy 70–80 GSM registers
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold font-body text-purple-900 hover:text-purple-600 transition-colors whitespace-nowrap"
          >
            <span>View more</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-body whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'purple-button-flow shadow-sm'
                : 'bg-purple-50/70 text-purple-950 hover:bg-purple-100/80 border border-purple-200/50'
            }`}
          >
            All Items ({bookAndNotebookProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('textbooks')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-body whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'textbooks'
                ? 'purple-button-flow shadow-sm'
                : 'bg-purple-50/70 text-purple-950 hover:bg-purple-100/80 border border-purple-200/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Prescribed Textbooks</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notebooks')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-body whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notebooks'
                ? 'purple-button-flow shadow-sm'
                : 'bg-purple-50/70 text-purple-950 hover:bg-purple-100/80 border border-purple-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notebooks &amp; Copies</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bundles')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-body whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bundles'
                ? 'purple-button-flow shadow-sm'
                : 'bg-purple-50/70 text-purple-950 hover:bg-purple-100/80 border border-purple-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Class Bundles</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRODUCT GRID: Reference image style — 2 in a row on mobile             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {filteredProducts.map((product) => {
          const stock = selectedShop ? (product.stockByShop[selectedShop.id] ?? 0) : 10;
          const isOutOfStock = stock <= 0;
          const isInCart = items.some((item) => item.productId === product.id);

          return (
            <article
              key={product.id}
              className="group flex flex-col justify-between select-none"
            >
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
                    {product.categoryId === 'textbooks' ? (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                        <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF5A1F]" />
                        <span>2026 Prescribed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200">
                        <span>75 GSM Bright</span>
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
                  onClick={(e) => handleQuickAdd(e, product)}
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
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. EDITORIAL "SHOP BY CATEGORIES" (Dark Luxury Obsidian & Gold Theme)      */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-7 sm:p-12 lg:p-14 bg-gradient-to-br from-[#0B0616] via-[#140A28] to-[#07020E] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border border-purple-500/25">
        {/* Subtle Ambient Radial Lighting Flares */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,60,250,0.12),rgba(255,255,255,0))] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
          
          {/* Left Column: Category Narrative & Premium Feature Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-white/[0.04] border border-purple-400/30 text-purple-200 backdrop-blur-md shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Academic Catalog</span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
                Shop by <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">Categories</span>
              </h3>
              
              {/* Feature Highlights: Frosted Obsidian Glass Cards */}
              <div className="space-y-3 pt-1">
                
                {/* 1. Teacher-Prescribed */}
                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-400/40 transition-all duration-300 backdrop-blur-md shadow-xl group">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-display font-bold text-white tracking-wide">
                      100% Teacher-Prescribed
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed mt-0.5">
                      Official syllabus mapped for DPS Guwahati, Don Bosco, Maria&apos;s &amp; SEBA.
                    </p>
                  </div>
                </div>

                {/* 2. Complete Session Bundles */}
                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-400/40 transition-all duration-300 backdrop-blur-md shadow-xl group">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30 shadow-inner group-hover:scale-105 transition-transform">
                    <Boxes className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-display font-bold text-white tracking-wide">
                      Complete Session Bundles
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed mt-0.5">
                      All textbooks, class registers, and school copy wraps packaged together.
                    </p>
                  </div>
                </div>

                {/* 3. Fast Guwahati Delivery */}
                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-400/40 transition-all duration-300 backdrop-blur-md shadow-xl group">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30 shadow-inner group-hover:scale-105 transition-transform">
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-display font-bold text-white tracking-wide">
                      Fast Guwahati Delivery
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed mt-0.5">
                      Dispatched instantly from Panbazar &amp; Zoo Road SSG Book Galleries.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Category Banners */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            
            {/* Banner 1: Textbooks */}
            <Link
              to="/categories/textbooks"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-[#0A0512] shadow-xl block border border-white/10 hover:border-purple-400/60 transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
                alt="NCERT & CBSE Prescribed Textbooks"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-3.5 sm:p-4 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-300 font-body">
                  Curriculum
                </span>
                <h4 className="text-xs sm:text-sm md:text-base font-display font-bold text-white leading-tight mt-0.5 group-hover:text-amber-100 transition-colors">
                  Textbooks
                </h4>
                <span className="text-[10px] sm:text-xs text-purple-200/90 mt-1.5 flex items-center gap-1 group-hover:translate-x-1 group-hover:text-white transition-all font-body font-medium">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 text-purple-300" />
                </span>
              </div>
            </Link>

            {/* Banner 2: Uniforms */}
            <Link
              to="/categories/uniforms"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-[#0A0512] shadow-xl block border border-white/10 hover:border-purple-400/60 transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80"
                alt="School Uniforms & Sports Wear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-3.5 sm:p-4 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-300 font-body">
                  Apparel
                </span>
                <h4 className="text-xs sm:text-sm md:text-base font-display font-bold text-white leading-tight mt-0.5 group-hover:text-amber-100 transition-colors">
                  Uniforms
                </h4>
                <span className="text-[10px] sm:text-xs text-purple-200/90 mt-1.5 flex items-center gap-1 group-hover:translate-x-1 group-hover:text-white transition-all font-body font-medium">
                  <span>View sizes</span>
                  <ChevronRight className="w-3 h-3 text-purple-300" />
                </span>
              </div>
            </Link>

            {/* Banner 3: School Copies & Stationery */}
            <Link
              to="/categories/notebooks"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-[#0A0512] shadow-xl block border border-white/10 hover:border-purple-400/60 transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80"
                alt="Class Registers & Copy Packs"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-3.5 sm:p-4 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-300 font-body">
                  Stationery
                </span>
                <h4 className="text-xs sm:text-sm md:text-base font-display font-bold text-white leading-tight mt-0.5 group-hover:text-amber-100 transition-colors">
                  Copies &amp; Registers
                </h4>
                <span className="text-[10px] sm:text-xs text-purple-200/90 mt-1.5 flex items-center gap-1 group-hover:translate-x-1 group-hover:text-white transition-all font-body font-medium">
                  <span>Browse</span>
                  <ChevronRight className="w-3 h-3 text-purple-300" />
                </span>
              </div>
            </Link>

            {/* Banner 4: School Bags & Kits */}
            <Link
              to="/categories/stationery"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-[#0A0512] shadow-xl block border border-white/10 hover:border-purple-400/60 transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
                alt="School Bags & Supply Kits"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-3.5 sm:p-4 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-300 font-body">
                  Essentials
                </span>
                <h4 className="text-xs sm:text-sm md:text-base font-display font-bold text-white leading-tight mt-0.5 group-hover:text-amber-100 transition-colors">
                  Bags &amp; Kits
                </h4>
                <span className="text-[10px] sm:text-xs text-purple-200/90 mt-1.5 flex items-center gap-1 group-hover:translate-x-1 group-hover:text-white transition-all font-body font-medium">
                  <span>Shop now</span>
                  <ChevronRight className="w-3 h-3 text-purple-300" />
                </span>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};
