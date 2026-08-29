import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { fetchOrderById } from '../api/orders';
import { Order } from '../types';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { useToast } from '../context/ToastContext';
import { Check, Copy, ArrowRight, MapPin, Truck, Store, Sparkles, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderTrackingWhatsAppUrl } = useWhatsApp();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    // Fire festive confetti
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#4F46E5', '#9333EA', '#25D366', '#E9D5FF'],
    });

    async function load() {
      if (!orderId) return;
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    showToast('Order ID copied to clipboard', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 sm:space-y-10">
      {/* Editorial Success Message */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
            Order Confirmed & Logged
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display purple-title-flow tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            We&apos;ve sent your order confirmation. Your curriculum books and supplies are being prepared at the counter.
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="pt-2 inline-flex items-center gap-3 bg-white border border-purple-200/90 rounded-full px-5 py-2.5 text-xs sm:text-sm font-mono shadow-2xs">
          <span className="text-neutral-500">Order ID:</span>
          <span className="font-bold text-purple-950">{orderId || 'SSG-2026-PENDING'}</span>
          <button
            type="button"
            onClick={copyOrderId}
            className="p-1 hover:text-purple-700 text-neutral-400 transition-colors cursor-pointer"
            title="Copy Order ID"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-purple-100 p-5 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(109,40,217,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Fulfillment Mode
              </span>
              <p className="text-sm sm:text-base font-bold font-display text-purple-950 flex items-center gap-2 mt-0.5">
                {order.deliveryMethod === 'PICKUP' ? (
                  <>
                    <Store className="w-4 h-4 text-purple-600" />
                    <span>Store Counter Pickup</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-purple-600" />
                    <span>Doorstep Express Delivery</span>
                  </>
                )}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Payment Status
              </span>
              <p className="text-xs sm:text-sm font-bold text-purple-950 mt-0.5">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI QR Payment'} (Total: <span className="text-purple-700 font-extrabold">Rs. {order.total}</span>)
              </p>
            </div>
          </div>

          {/* Itemized summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold font-display text-purple-950 uppercase tracking-wider">
              Items Summary
            </h3>
            <div className="divide-y divide-purple-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <p className="font-bold text-neutral-900">{item.name}</p>
                    <p className="text-neutral-500 text-xs">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-purple-950">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div className="border-t border-purple-100 pt-5 space-y-1 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-neutral-500 block text-xs">
              {order.deliveryMethod === 'PICKUP' ? 'Pickup Location' : 'Delivery Address'}
            </span>
            <p className="text-purple-950 font-bold">
              {order.customer.name} ({order.customer.phone})
            </p>
            <p className="text-neutral-600">
              {order.deliveryAddress.line1}, {order.deliveryAddress.city} — {order.deliveryAddress.pincode}, {order.deliveryAddress.state}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <a
          href={getOrderTrackingWhatsAppUrl(orderId || 'SSG-ORDER')}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20bd5a] shadow-md shadow-emerald-500/25 transition-all select-none cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 fill-white" />
          <span>Track Order on WhatsApp</span>
        </a>

        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 purple-button-flow px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 transition-all cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
