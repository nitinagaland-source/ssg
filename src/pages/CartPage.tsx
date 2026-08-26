import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSelectedShop } from '../context/SelectedShopContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Sparkles, ArrowLeft, Truck, Check } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total, getItemProduct } = useCart();
  const { selectedShop } = useSelectedShop();
  const { getCartWhatsAppUrl } = useWhatsApp();
  const navigate = useNavigate();

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 shadow-[0_10px_40px_rgba(109,40,217,0.06)] space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-2xl purple-badge-flow flex items-center justify-center mx-auto shadow-lg shadow-purple-600/25">
            <ShoppingBag className="w-9 h-9 text-white stroke-[1.8]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display purple-title-flow tracking-tight">
              Your bag is empty
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Explore syllabus booklists, tailored school uniforms, practical notebooks, and stationery in stock at {selectedShop?.name || 'SSG Main Store'}.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asAnchor href="/products" variant="primary" showArrow className="w-full sm:w-auto text-xs py-3">
              Browse All Books & Uniforms
            </Button>
            <Button asAnchor href="/schools" variant="secondary" className="w-full sm:w-auto text-xs py-3 border-purple-200 text-purple-950 hover:bg-purple-50">
              Find by School
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Build formatted text for WhatsApp order
  const whatsAppItemsList = items
    .map((item) => {
      const prod = getItemProduct(item.productId);
      return `• ${prod ? prod.name : 'Item'} (Qty: ${item.quantity}) - Rs. ${prod ? prod.price * item.quantity : 0}`;
    })
    .join('\n');

  const formattedWhatsAppUrl = getCartWhatsAppUrl(
    `*Order Request from SSG Website*\n\n${whatsAppItemsList}\n\n*Total:* Rs. ${total}\n*Pickup/Delivery Shop:* ${selectedShop?.name || 'Guwahati Panbazar'}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-6 sm:space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1 font-medium">
            <Link to="/products" className="hover:text-purple-700 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Continue shopping
            </Link>
            <span>/</span>
            <span className="text-purple-900 font-semibold">Shopping Bag</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display purple-title-flow tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Fulfilling directly from: <strong className="text-purple-950 font-semibold">{selectedShop?.name || 'Guwahati Panbazar Main Branch'}</strong>
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-bold text-purple-900 shadow-2xs">
          <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
          <span>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Line items */}
        <div className="lg:col-span-8 space-y-5">
          {/* Free Shipping Progress Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 border border-purple-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              {subtotal >= freeShippingThreshold ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>You have unlocked <strong>FREE Local Store Delivery</strong>!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span>
                    Add <strong className="text-purple-800">Rs. {freeShippingThreshold - subtotal}</strong> more to get <strong>Free Local Delivery</strong>
                  </span>
                </div>
              )}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                {subtotal >= freeShippingThreshold ? 'FREE DELIVERY' : 'FLAT Rs. 50'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-purple-100/80 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-600 to-indigo-600"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Line items list */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-purple-100 divide-y divide-purple-50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            {items.map((item) => {
              const product = getItemProduct(item.productId);
              if (!product) return null;

              return (
                <div key={item.productId} className="p-4 sm:p-5 flex gap-3.5 sm:gap-5 items-center hover:bg-purple-50/20 transition-colors">
                  {/* Thumbnail with full cover image */}
                  <Link
                    to={`/products/${product.slug}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 border border-purple-100 shrink-0 shadow-2xs group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-purple-700 uppercase tracking-wider">
                      {product.classes && product.classes.length > 0 && (
                        <span>{product.classes[0]}</span>
                      )}
                      {product.brand && (
                        <>
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-500 font-normal">{product.brand}</span>
                        </>
                      )}
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-purple-700 transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-extrabold text-purple-950">
                        Rs. {product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          Rs. {product.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stepper + Total + Remove */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <div className="inline-flex items-center bg-white border border-purple-200 rounded-full p-0.5 sm:p-1 text-xs font-bold text-purple-950 shadow-2xs select-none">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-full hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 sm:w-7 text-center font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-black text-purple-950 font-display">
                        Rs. {product.price * item.quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1 mt-1 justify-end cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick continue browsing */}
          <div className="pt-1">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue shopping for school items</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
          <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgba(109,40,217,0.06)] space-y-5">
            <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold font-display purple-title-flow">
                Order Summary
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Items Subtotal</span>
                <span className="text-purple-950 font-bold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Local Store Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE
                    </span>
                  ) : (
                    <span className="text-purple-950 font-bold">Rs. {deliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="border-t border-purple-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm sm:text-base font-extrabold text-neutral-900">Total Amount</span>
                <span className="text-xl sm:text-2xl font-black font-display text-purple-950 purple-title-flow">
                  Rs. {total}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full purple-button-flow py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={formattedWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20bd5a] shadow-sm shadow-emerald-500/20 transition-all select-none cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Send Bag to WhatsApp</span>
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="pt-3 border-t border-purple-100 space-y-2 text-[11px] text-neutral-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Store counter pickup available at checkout.</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cash on Delivery or UPI available at doorstep.</span>
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>100% Genuine authorized school curriculum books.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
