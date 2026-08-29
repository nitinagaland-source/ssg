import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { useToast } from '../../context/ToastContext';
import { fetchProducts } from '../../api/products';
import { Product } from '../../types';

const MAX_FEATURED = 5;

export const FeaturedProductsCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { selectedShop } = useSelectedShop();
  const { showToast } = useToast();

  const [featuredItems, setFeaturedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch featured products from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { products } = await fetchProducts({
          shopId: selectedShop?.id,
          limit: 50,
          sort: 'featured',
        });
        const featured = products
          .filter((p) => p.isFeatured && p.isActive !== false)
          .slice(0, MAX_FEATURED);
        setFeaturedItems(featured);
        // Start centered if 3+ items
        setActiveIndex(featured.length >= 3 ? Math.floor(featured.length / 2) : 0);
      } catch (err) {
        console.error('Failed to load featured products', err);
        setFeaturedItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedShop?.id]);

  // Mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const total = featuredItems.length;

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const next = !prev[id];
      showToast(next ? `Added ${name} to wishlist` : `Removed from wishlist`);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product.id, 1, selectedShop?.id || '');
    showToast(`${product.name} added to cart`);
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 45) handleNext();
    if (diff < -45) handlePrev();
    setTouchStart(null);
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="w-full bg-white py-8 sm:py-12 overflow-hidden border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="h-3 w-24 bg-purple-100 rounded-full mb-2 animate-pulse" />
            <div className="h-7 w-52 bg-neutral-100 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-4 min-h-[400px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-xl bg-neutral-100 animate-pulse ${
                  i === 1 ? 'w-[260px] h-[405px]' : 'w-[245px] h-[380px] opacity-60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Nothing featured yet — hide section entirely
  if (!loading && featuredItems.length === 0) return null;

  return (
    <section
      id="featured-products-carousel-section"
      className="w-full bg-white py-8 sm:py-12 overflow-hidden select-none border-b border-neutral-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full purple-badge-flow" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 font-display">
              Curated Picks
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold purple-title-flow tracking-tight">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-body mt-0.5">
            Handpicked school essentials, textbooks, backpacks &amp; study equipment
          </p>
        </div>

        {/* Carousel Track */}
        <div
          className="relative flex items-center justify-center min-h-[400px] sm:min-h-[440px] py-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous product"
            className="absolute left-1 sm:left-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 text-purple-950 hover:text-white border border-purple-200 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next product"
            className="absolute right-1 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 text-purple-950 hover:text-white border border-purple-200 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Cards */}
          <div className="relative w-full max-w-5xl h-[400px] sm:h-[430px] flex items-center justify-center">
            {featuredItems.map((product, index) => {
              let offset = index - activeIndex;
              if (offset < -2) offset += total;
              if (offset > 2) offset -= total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;
              const isWishlisted = !!wishlist[product.id];
              const isInCart = items.some((i) => i.productId === product.id);
              const image = product.images?.[0] || 'https://placehold.co/400x300?text=No+Image';

              if (!isVisible) return null;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 1;

              if (offset === 0) {
                transformStyle = 'translateX(0%) scale(1)';
                zIndex = 25;
              } else if (offset === -1) {
                transformStyle = isMobile ? 'translateX(-78%) scale(0.92)' : 'translateX(-62%) scale(0.92)';
                zIndex = 18;
              } else if (offset === 1) {
                transformStyle = isMobile ? 'translateX(78%) scale(0.92)' : 'translateX(62%) scale(0.92)';
                zIndex = 18;
              } else if (offset === -2) {
                transformStyle = isMobile ? 'translateX(-150%) scale(0.8)' : 'translateX(-120%) scale(0.85)';
                zIndex = 10;
                opacity = isMobile ? 0 : 1;
              } else if (offset === 2) {
                transformStyle = isMobile ? 'translateX(150%) scale(0.8)' : 'translateX(120%) scale(0.85)';
                zIndex = 10;
                opacity = isMobile ? 0 : 1;
              }

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                    else navigate(`/products/${product.slug}`);
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    transition: 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`absolute w-[215px] sm:w-[245px] md:w-[260px] rounded-xl p-3.5 bg-white border cursor-pointer select-none flex flex-col justify-between h-[380px] sm:h-[405px] transition-all ${
                    isCenter
                      ? 'border-purple-600 shadow-[0_20px_45px_rgba(124,58,237,0.16)] ring-1 ring-purple-600/30'
                      : 'border-purple-100/90 shadow-md hover:border-purple-300'
                  }`}
                >
                  {/* Badge + Wishlist */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs bg-purple-900 text-purple-100 border border-purple-800">
                      {product.isBestSeller ? 'BEST SELLER' : 'FEATURED'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id, product.name); }}
                      aria-label="Wishlist"
                      className="w-7 h-7 rounded-full bg-white text-neutral-800 border border-purple-100 flex items-center justify-center transition-all shadow-xs active:scale-95 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-purple-600 text-purple-600' : ''}`} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-neutral-50 my-2 relative shadow-inner group flex items-center justify-center p-1.5 border border-purple-100/60">
                    <img
                      src={image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'; }}
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      {product.brand || 'SSG'}
                    </div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-neutral-900 leading-tight line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-normal">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-neutral-800">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span>4.8</span>
                      <span className="text-neutral-400 font-normal text-[10px]">(—)</span>
                    </div>

                    {/* Price + Add to cart */}
                    <div className="mt-2 pt-2 border-t border-purple-100/70 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-bold font-display text-neutral-900">
                          ₹{product.price}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-neutral-400 line-through font-normal">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm ${
                          isInCart
                            ? 'bg-emerald-600 text-white'
                            : 'purple-button-flow shadow-purple-500/25'
                        }`}
                      >
                        {isInCart ? (
                          <><Check className="w-3.5 h-3.5 stroke-[2.5]" /><span>Added</span></>
                        ) : (
                          <><ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" /><span>Add</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-5">
          {featuredItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 h-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm'
                  : 'w-2 h-2 bg-purple-200 hover:bg-purple-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
