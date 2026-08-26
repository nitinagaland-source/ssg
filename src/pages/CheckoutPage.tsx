import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSelectedShop } from '../context/SelectedShopContext';
import { createOrder } from '../api/orders';
import { useToast } from '../context/ToastContext';
import { MapPin, Truck, Store, CreditCard, ShieldCheck, ArrowLeft, CheckCircle2, ShoppingBag, Sparkles, ArrowRight, Check } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart, getItemProduct } = useCart();
  const { selectedShop } = useSelectedShop();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState(selectedShop?.city || 'Guwahati');
  const [pincode, setPincode] = useState(selectedShop?.pincode || '781001');
  const [landmark, setLandmark] = useState('');
  const [state, setState] = useState('Assam');

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI_QR'>('COD');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 shadow-[0_10px_40px_rgba(109,40,217,0.06)] space-y-5 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl purple-badge-flow flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-8 h-8 text-white stroke-[1.8]" />
          </div>
          <h2 className="text-2xl font-bold font-display purple-title-flow">Your bag is empty</h2>
          <p className="text-xs text-neutral-600">Please add items to your cart before proceeding to checkout.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 purple-button-flow px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-purple-600/20"
          >
            ← Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  const effectiveDeliveryFee = deliveryMethod === 'PICKUP' ? 0 : deliveryFee;
  const effectiveTotal = subtotal + effectiveDeliveryFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (deliveryMethod === 'DELIVERY') {
      if (!line1.trim()) errs.line1 = 'Street address is required';
      if (!city.trim()) errs.city = 'City is required';
      if (!pincode.trim() || !/^\d{6}$/.test(pincode)) errs.pincode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted errors before ordering', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const order = await createOrder({
        shopId: selectedShop?.id || 'shop-guwahati-panbazar',
        customer: {
          name: fullName,
          phone,
          email: email.trim() || undefined,
        },
        deliveryAddress: {
          line1: deliveryMethod === 'PICKUP' ? (selectedShop?.address || 'Shop Counter') : line1,
          line2: line2.trim() || undefined,
          city: deliveryMethod === 'PICKUP' ? (selectedShop?.city || 'Guwahati') : city,
          pincode: deliveryMethod === 'PICKUP' ? (selectedShop?.pincode || '781001') : pincode,
          state,
          landmark: landmark.trim() || undefined,
        },
        items: items.map((i) => {
          const p = getItemProduct(i.productId);
          return {
            productId: i.productId,
            name: p?.name || 'School item',
            price: p?.price || 0,
            quantity: i.quantity,
          };
        }),
        deliveryMethod,
        paymentMethod,
        subtotal,
        deliveryFee: effectiveDeliveryFee,
        total: effectiveTotal,
        notes: notes.trim() || undefined,
      });

      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order/success/${order.id}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to place order. Please try again or WhatsApp us.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-6 sm:space-y-8">
      {/* Header & Navigation */}
      <div className="space-y-2 border-b border-purple-100 pb-5">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Shopping Bag</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display purple-title-flow tracking-tight">
              Express Checkout
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
              Dispatched directly from <strong className="text-purple-950 font-semibold">{selectedShop?.name || 'Guwahati Panbazar Main Store'}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-center">
            <ShieldCheck className="w-4 h-4" />
            <span>SSL Encrypted & Verified</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold font-display text-purple-950 uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full purple-badge-flow text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </span>
                <span>Parent / Student Contact</span>
              </h2>
              <span className="text-[11px] text-neutral-500 font-medium">* Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all ${
                    errors.fullName ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-rose-600 font-medium">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all ${
                    errors.phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-600 font-medium">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Email Address (Optional for e-receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full bg-white border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Option */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold font-display text-purple-950 uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full purple-badge-flow text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  2
                </span>
                <span>Fulfillment Method</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setDeliveryMethod('DELIVERY')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  deliveryMethod === 'DELIVERY'
                    ? 'bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white border-purple-700 shadow-md shadow-purple-900/20 ring-2 ring-purple-600/30'
                    : 'border-purple-200/90 bg-purple-50/30 text-purple-950 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${deliveryMethod === 'DELIVERY' ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">Doorstep Delivery</div>
                  <div className={`text-xs mt-0.5 ${deliveryMethod === 'DELIVERY' ? 'text-purple-200' : 'text-neutral-500'}`}>
                    {subtotal >= 500 ? 'Free Delivery' : 'Flat Rs. 50'} (24-48 hrs)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  deliveryMethod === 'PICKUP'
                    ? 'bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white border-purple-700 shadow-md shadow-purple-900/20 ring-2 ring-purple-600/30'
                    : 'border-purple-200/90 bg-purple-50/30 text-purple-950 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${deliveryMethod === 'PICKUP' ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">Store Counter Pickup</div>
                  <div className={`text-xs mt-0.5 ${deliveryMethod === 'PICKUP' ? 'text-purple-200' : 'text-neutral-500'}`}>
                    Free • Ready in 2 hours
                  </div>
                </div>
              </button>
            </div>

            {/* Address fields if Delivery */}
            {deliveryMethod === 'DELIVERY' && (
              <div className="space-y-3.5 pt-4 border-t border-purple-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    House / Colony / Street Address *
                  </label>
                  <input
                    type="text"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="House # 42, G.S. Road, Near Christian Basti"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all ${
                      errors.line1 ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20'
                    }`}
                  />
                  {errors.line1 && <p className="text-xs text-rose-600 font-medium">{errors.line1}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all ${
                        errors.city ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="781001"
                      className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all ${
                        errors.pincode ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20'
                      }`}
                    />
                    {errors.pincode && <p className="text-xs text-rose-600 font-medium">{errors.pincode}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite City Church"
                      className="w-full bg-white border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-950 font-medium shadow-2xs focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      disabled
                      className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-purple-900/70 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Option */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold font-display text-purple-950 uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full purple-badge-flow text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  3
                </span>
                <span>Payment Preference</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white border-purple-700 shadow-md shadow-purple-900/20 ring-2 ring-purple-600/30'
                    : 'border-purple-200/90 bg-purple-50/30 text-purple-950 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'COD' ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">Cash on Delivery / Pickup</div>
                  <div className={`text-xs mt-0.5 ${paymentMethod === 'COD' ? 'text-purple-200' : 'text-neutral-500'}`}>
                    Pay when you receive or inspect items
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI_QR')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  paymentMethod === 'UPI_QR'
                    ? 'bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white border-purple-700 shadow-md shadow-purple-900/20 ring-2 ring-purple-600/30'
                    : 'border-purple-200/90 bg-purple-50/30 text-purple-950 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'UPI_QR' ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">UPI / GPay / PhonePe</div>
                  <div className={`text-xs mt-0.5 ${paymentMethod === 'UPI_QR' ? 'text-purple-200' : 'text-neutral-500'}`}>
                    Scan shop QR code on delivery
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call before delivery, pack in waterproof bag..."
                rows={2}
                className="w-full bg-white border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 rounded-xl p-3 text-xs text-purple-950 font-medium shadow-2xs focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgba(109,40,217,0.06)] space-y-5">
            <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold font-display purple-title-flow">
                Your Order
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Item list mini */}
            <div className="max-h-64 overflow-y-auto divide-y divide-purple-50 pr-1 space-y-2.5">
              {items.map((it) => {
                const prod = getItemProduct(it.productId);
                if (!prod) return null;
                return (
                  <div key={it.productId} className="pt-2.5 flex items-center gap-3 text-xs">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-100 border border-purple-100 shrink-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                      <p className="text-[11px] text-purple-700 font-medium">Qty: {it.quantity} × Rs. {prod.price}</p>
                    </div>
                    <span className="font-extrabold text-purple-950 shrink-0 text-xs sm:text-sm">
                      Rs. {prod.price * it.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="border-t border-purple-100 pt-3.5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Items Subtotal</span>
                <span className="text-purple-950 font-bold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Delivery</span>
                <span>
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE
                    </span>
                  ) : (
                    <span className="text-purple-950 font-bold">Rs. {effectiveDeliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="border-t border-purple-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm sm:text-base font-extrabold text-neutral-900">Total Due</span>
                <span className="text-xl sm:text-2xl font-black font-display text-purple-950 purple-title-flow">
                  Rs. {effectiveTotal}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full purple-button-flow py-4 px-4 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-transform disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order (Rs. {effectiveTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-neutral-500 space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct authorized store receipt & exchange guarantee.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
