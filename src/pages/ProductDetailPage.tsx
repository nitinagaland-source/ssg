import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductBySlug, fetchProducts } from '../api/products';
import { Product } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { useCart } from '../context/CartContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/common/ProductCard';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  MapPin,
  Sparkles,
  RotateCcw,
  Zap,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const ProductDetailPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { selectedShop } = useSelectedShop();
  const { addToCart, items } = useCart();
  const { getProductWhatsAppUrl } = useWhatsApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productSlug) return;
      try {
        setLoading(true);
        const prod = await fetchProductBySlug(productSlug);
        setProduct(prod);
        setActiveImageIndex(0);
        setQuantity(1);

        const relRes = await fetchProducts({
          shopId: selectedShop?.id || 'shop-guwahati-panbazar',
          categoryId: prod.categoryId,
          limit: 6,
        });
        setRelatedProducts(relRes.products.filter((p) => p.id !== prod.id));
      } catch (err) {
        console.error('Error fetching product details', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productSlug, selectedShop]);

  if (!product && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-neutral-900">Product not found</h2>
        <p className="text-neutral-600 text-sm mt-2">The item you are looking for might be out of stock or relocated.</p>
        <Link to="/products" className="text-purple-700 font-semibold text-sm mt-6 inline-flex items-center gap-1.5 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to all products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const currentStock = selectedShop ? (product.stockByShop[selectedShop.id] ?? 0) : 10;
  const isOutOfStock = currentStock <= 0;
  const isInCart = items.some((i) => i.productId === product.id);
  const discountPercent = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const savings = product.mrp > product.price ? product.mrp - product.price : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, selectedShop?.id || 'shop-guwahati-panbazar');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10 sm:space-y-14">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 font-medium overflow-x-auto whitespace-nowrap py-1">
        <Link to="/" className="hover:text-purple-700 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <Link to="/products" className="hover:text-purple-700 transition-colors">Catalog</Link>
        {product.classes && product.classes.length > 0 && (
          <>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="text-neutral-600">{product.classes[0]}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-start">
        {/* Left Column: Premium Image Gallery */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          {/* Main Showcase Frame */}
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-purple-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {discountPercent > 0 && (
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {isOutOfStock ? (
                <span className="bg-neutral-900 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  Sold Out
                </span>
              ) : currentStock <= 5 ? (
                <span className="bg-amber-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  Only {currentStock} left
                </span>
              ) : null}
            </div>

            {product.brand && (
              <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-purple-100 text-purple-900 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                {product.brand}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-purple-600 shadow-md shadow-purple-600/20 ring-2 ring-purple-600/30'
                      : 'border-neutral-200 hover:border-purple-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Clean & Elegant Product Details */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {product.classes && product.classes.length > 0 && (
              <span className="bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md border border-purple-200 uppercase tracking-wider">
                {product.classes.join(', ')}
              </span>
            )}
            {product.sku && (
              <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-neutral-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-xs sm:text-sm text-purple-900/80 font-medium mt-1">
                Official Publisher / Brand: <span className="font-bold text-purple-950">{product.brand}</span>
              </p>
            )}
          </div>

          {/* Price Box */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-50/40 border border-purple-100/90 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-purple-950">
                  Rs. {product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through font-medium">
                    Rs. {product.mrp}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">Inclusive of all local educational taxes</p>
            </div>

            {savings > 0 && (
              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Save Rs. {savings}
                </span>
              </div>
            )}
          </div>

          {/* Location & Stock Availability Pill */}
          <div className="p-3 rounded-xl bg-white border border-purple-100 flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-emerald-500 ring-2 ring-emerald-200'
                }`}
              />
              <span className="font-semibold text-neutral-900">
                {isOutOfStock
                  ? `Sold out at ${selectedShop?.name || 'this shop'}`
                  : `In stock at ${selectedShop?.name || 'SSG Guwahati Panbazar'}`}
              </span>
            </div>
            <span className="text-neutral-500 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              {selectedShop?.city || 'Guwahati'}
            </span>
          </div>

          {/* Quantity Stepper & CTA Action Buttons */}
          <div className="space-y-3 pt-1">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Quantity
                </span>
                <div className="inline-flex items-center bg-white border border-purple-200 rounded-full p-0.5 text-xs sm:text-sm font-semibold select-none shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-purple-50 text-purple-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-neutral-900 font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-purple-50 text-purple-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                fullWidth
                className="py-3 sm:py-3.5 text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25"
              >
                {isInCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 stroke-[2.5]" /> Added to Bag ({quantity})
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </span>
                )}
              </Button>

              <a
                href={getProductWhatsAppUrl(product.name, product.price)}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold hover:bg-[#20bd5a] shadow-md shadow-emerald-500/20 transition-all select-none border border-white/20"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Buy on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-100 text-center">
            <div className="p-2 rounded-xl bg-purple-50/30 border border-purple-100/60">
              <ShieldCheck className="w-4 h-4 text-purple-700 mx-auto mb-1" />
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800 block">100% Genuine</span>
              <span className="text-[9px] text-neutral-500 block">Direct Publisher</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/30 border border-purple-100/60">
              <Zap className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800 block">Fast Dispatch</span>
              <span className="text-[9px] text-neutral-500 block">Guwahati Stores</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/30 border border-purple-100/60">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800 block">Easy Exchange</span>
              <span className="text-[9px] text-neutral-500 block">At Any Counter</span>
            </div>
          </div>

          {/* Clean Segmented Tabs */}
          <div className="pt-4 border-t border-purple-100 space-y-3">
            <div className="flex items-center gap-1.5 p-1 bg-purple-50/60 rounded-xl border border-purple-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'desc'
                    ? 'bg-white text-purple-950 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-purple-900'
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-white text-purple-950 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-purple-900'
                }`}
              >
                Specifications
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'delivery'
                    ? 'bg-white text-purple-950 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-purple-900'
                }`}
              >
                Delivery &amp; Exchange
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed p-3 sm:p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
              {activeTab === 'desc' && (
                <div className="space-y-2">
                  <p className="text-neutral-600">{product.description}</p>
                  <div className="pt-2 flex items-center gap-2 text-purple-800 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Verified syllabus edition for the 2026 academic session.
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2 divide-y divide-purple-100">
                  {product.brand && (
                    <div className="flex justify-between py-1.5 text-xs">
                      <span className="text-neutral-500">Publisher / Brand</span>
                      <span className="font-semibold text-neutral-900">{product.brand}</span>
                    </div>
                  )}
                  {product.specifications?.map((spec, i) => (
                    <div key={i} className="flex justify-between py-1.5 text-xs">
                      <span className="text-neutral-500">{spec.label}</span>
                      <span className="font-semibold text-neutral-900">{spec.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 text-xs">
                    <span className="text-neutral-500">Applicable Classes</span>
                    <span className="font-semibold text-neutral-900">
                      {product.classes.length > 0 ? product.classes.join(', ') : 'All Standard Grades'}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-2.5 text-xs text-neutral-600">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-neutral-900">Local Guwahati Dispatch:</strong> Orders placed before 3:00 PM are dispatched same-day or available for 2-hour express counter pickup.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-neutral-900">7-Day Free Exchange:</strong> Unopened kits and unwashed uniform sizes can be swapped at any SSG counter with your order confirmation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently bought together / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 sm:pt-12 border-t border-purple-100 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-700">Recommended</span>
              <h3 className="text-lg sm:text-2xl font-extrabold font-display text-neutral-900">
                Frequently Bought Together
              </h3>
            </div>
            <span className="text-xs font-medium text-purple-700 hidden sm:inline">
              Swipe to explore →
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.slice(0, 6).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

