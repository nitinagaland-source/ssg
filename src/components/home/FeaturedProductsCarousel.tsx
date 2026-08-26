import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { useToast } from '../../context/ToastContext';

interface CarouselItem {
  id: string;
  slug: string;
  badge: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  reviewsCount: number;
  price: number;
  mrp: number;
  image: string;
  badgeColor: string;
  imageBoxBg: string;
  categoryColor: string;
}

const FEATURED_ITEMS: CarouselItem[] = [
  {
    id: 'p-feat-1',
    slug: 'ergonomic-orthopedic-school-backpack',
    badge: '2026 EDITION',
    title: 'Ergonomic Spine-Guard School Backpack',
    category: 'School Bags',
    description: 'Padded multi-compartment waterproof backpack with reflective safety strips.',
    rating: 4.8,
    reviewsCount: 89,
    price: 1299,
    mrp: 1599,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=85',
    badgeColor: 'bg-purple-900 text-purple-100 border border-purple-800',
    imageBoxBg: 'bg-neutral-50',
    categoryColor: 'text-purple-700',
  },
  {
    id: 'p-feat-2',
    slug: 'bata-school-shoes-formal-black',
    badge: 'BOARD APPROVED',
    title: 'Bata Sturdy Formal School Shoes',
    category: 'Footwear',
    description: 'Genuine scuff-resistant leather with anti-slip cushioned memory foam sole.',
    rating: 4.7,
    reviewsCount: 98,
    price: 899,
    mrp: 999,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=700&auto=format&fit=crop&q=85',
    badgeColor: 'bg-indigo-900 text-indigo-100 border border-indigo-800',
    imageBoxBg: 'bg-neutral-50',
    categoryColor: 'text-indigo-700',
  },
  {
    id: 'p-feat-3',
    slug: 'student-study-anc-headphones',
    badge: 'STUDENT CHOICE',
    title: 'SSG Study Pro Wireless ANC Headset',
    category: 'Study Tech',
    description: 'High quality sound with safe volume limiter and ultra-plush comfort earcups.',
    rating: 4.9,
    reviewsCount: 142,
    price: 1899,
    mrp: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=85',
    badgeColor: 'bg-purple-950 text-white border border-purple-800',
    imageBoxBg: 'bg-neutral-50',
    categoryColor: 'text-purple-900',
  },
  {
    id: 'p-feat-4',
    slug: 'casio-scientific-calculator-fx991cw',
    badge: 'CLASS 9-12',
    title: 'Casio ClassWiz Scientific Calculator',
    category: 'Stationery & Tech',
    description: '540+ functions with high-resolution 4-gradation natural textbook display.',
    rating: 4.9,
    reviewsCount: 60,
    price: 1420,
    mrp: 1595,
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=700&auto=format&fit=crop&q=85',
    badgeColor: 'bg-purple-900 text-purple-100 border border-purple-800',
    imageBoxBg: 'bg-neutral-50',
    categoryColor: 'text-purple-700',
  },
  {
    id: 'p-feat-5',
    slug: 'camlin-kokuyo-premium-art-kit',
    badge: 'TOP RATED',
    title: 'Camlin Kokuyo Artist Studio Art Chest',
    category: 'Art & Craft',
    description: 'Comprehensive 42-piece studio set with acrylics, watercolor tubes & brushes.',
    rating: 4.6,
    reviewsCount: 75,
    price: 749,
    mrp: 850,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=85',
    badgeColor: 'bg-purple-900 text-purple-100 border border-purple-800',
    imageBoxBg: 'bg-neutral-50',
    categoryColor: 'text-purple-700',
  },
];

export const FeaturedProductsCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { selectedShop } = useSelectedShop();
  const { showToast } = useToast();

  const [activeIndex, setActiveIndex] = useState(2); // Center on "Best Seller"
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const total = FEATURED_ITEMS.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const next = !prev[id];
      showToast(next ? `Added ${name} to wishlist` : `Removed from wishlist`);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (e: React.MouseEvent, item: CarouselItem) => {
    e.stopPropagation();
    addToCart(item.id, 1, selectedShop?.id || 'shop-guwahati-panbazar');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) handleNext();
    if (diff < -45) handlePrev();
    setTouchStart(null);
  };

  return (
    <section
      id="featured-products-carousel-section"
      className="w-full bg-white py-8 sm:py-12 overflow-hidden select-none border-b border-neutral-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
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
          {/* Left Arrow on Stage */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous product"
            className="absolute left-1 sm:left-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 text-purple-950 hover:text-white border border-purple-200 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow on Stage */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next product"
            className="absolute right-1 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 text-purple-950 hover:text-white border border-purple-200 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Premium Cards Track */}
          <div className="relative w-full max-w-5xl h-[400px] sm:h-[430px] flex items-center justify-center">
            {FEATURED_ITEMS.map((item, index) => {
              let offset = index - activeIndex;
              if (offset < -2) offset += total;
              if (offset > 2) offset -= total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;
              const isWishlisted = !!wishlist[item.id];
              const isInCart = items.some((i) => i.productId === item.id);

              if (!isVisible) return null;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 1; // 100% Solid Opacity - No decreased transparency

              if (offset === 0) {
                transformStyle = 'translateX(0%) scale(1)';
                zIndex = 25;
                opacity = 1;
              } else if (offset === -1) {
                transformStyle = isMobile
                  ? 'translateX(-78%) scale(0.92)'
                  : 'translateX(-62%) scale(0.92)';
                zIndex = 18;
                opacity = 1; // Solid
              } else if (offset === 1) {
                transformStyle = isMobile
                  ? 'translateX(78%) scale(0.92)'
                  : 'translateX(62%) scale(0.92)';
                zIndex = 18;
                opacity = 1; // Solid
              } else if (offset === -2) {
                transformStyle = isMobile
                  ? 'translateX(-150%) scale(0.8)'
                  : 'translateX(-120%) scale(0.85)';
                zIndex = 10;
                opacity = isMobile ? 0 : 1; // Solid on desktop
              } else if (offset === 2) {
                transformStyle = isMobile
                  ? 'translateX(150%) scale(0.8)'
                  : 'translateX(120%) scale(0.85)';
                zIndex = 10;
                opacity = isMobile ? 0 : 1; // Solid on desktop
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                    else navigate(`/products/${item.slug}`);
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
                  {/* Top Bar: Badge & Heart */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id, item.title);
                      }}
                      aria-label="Wishlist"
                      className="w-7 h-7 rounded-full bg-white text-neutral-800 border border-purple-100 flex items-center justify-center transition-all shadow-xs active:scale-95 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? 'fill-purple-600 text-purple-600' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image Container with rounded corners & refined subtle border */}
                  <div className={`w-full h-36 sm:h-40 rounded-xl overflow-hidden ${item.imageBoxBg} my-2 relative shadow-inner group flex items-center justify-center p-1.5 border border-purple-100/60`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${item.categoryColor}`}>
                      {item.category}
                    </div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-neutral-900 leading-tight line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-normal">
                      {item.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-neutral-800">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span>{item.rating}</span>
                      <span className="text-neutral-400 font-normal text-[10px]">
                        ({item.reviewsCount})
                      </span>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="mt-2 pt-2 border-t border-purple-100/70 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-bold font-display text-neutral-900">
                          ₹{item.price}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-[10px] text-neutral-400 line-through font-normal">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, item)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm ${
                          isInCart
                            ? 'bg-emerald-600 text-white'
                            : 'purple-button-flow shadow-purple-500/25'
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-5">
          {FEATURED_ITEMS.map((_, idx) => (
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
