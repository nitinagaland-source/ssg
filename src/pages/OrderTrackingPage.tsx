import React, { useState } from 'react';
import { fetchOrderById } from '../api/orders';
import { Order } from '../types';
import { Search, Package, CheckCircle2, Clock, Truck, Store, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useWhatsApp } from '../hooks/useWhatsApp';

export const OrderTrackingPage: React.FC = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getOrderTrackingWhatsAppUrl } = useWhatsApp();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const data = await fetchOrderById(orderIdInput.trim());
      setOrder(data);
    } catch (e) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { title: 'Order Received', desc: 'Syllabus and items matched' },
    { title: 'Packed at Local Shop', desc: 'Securely packaged at branch' },
    { title: 'Dispatched / Ready', desc: 'Out with courier or at counter' },
    { title: 'Delivered / Handed over', desc: 'Order completed' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="max-w-xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5A1F]">
          Real-Time Dispatch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#0A0A0A] tracking-tight">
          Track Your School Order
        </h1>
        <p className="text-sm sm:text-base font-serif-accent text-[#6B6B6B]">
          Enter your SSG Order ID to check packing and dispatch progress at your branch.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl border border-[#E5E5E0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. SSG-2026-9812"
              className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-full py-3.5 pl-11 pr-4 text-sm font-mono text-[#0A0A0A] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#0A0A0A]"
            />
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-4 top-4" />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="py-3.5 text-sm shrink-0"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </Button>
        </div>
      </form>

      {/* Result Timeline */}
      {searched && (
        <div>
          {order ? (
            <div className="bg-white rounded-3xl border border-[#E5E5E0] p-6 sm:p-10 space-y-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
                <div>
                  <span className="text-xs font-mono text-[#6B6B6B]">ORDER #{order.id}</span>
                  <h2 className="text-xl font-bold font-display text-[#0A0A0A] mt-1">
                    {order.customer.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A] px-3 py-1 rounded-full uppercase tracking-wider">
                    {order.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0A0A0A]">
                    Rs. {order.total}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {stages.map((stage, i) => (
                  <div key={i} className="space-y-2 relative">
                    <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-[#6B6B6B]">{stage.desc}</p>
                  </div>
                ))}
              </div>

              {/* WhatsApp Support CTA */}
              <div className="pt-4 border-t border-[#E5E5E0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#6B6B6B]">
                  Have a question about this order? Contact our dispatch coordinator directly.
                </p>
                <a
                  href={getOrderTrackingWhatsAppUrl(order.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#25D366] text-white px-5 py-2.5 rounded-full hover:bg-[#1ebd5d] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Dispatch Desk</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E5E5E0] p-10 text-center space-y-3">
              <Package className="w-10 h-10 text-[#6B6B6B] mx-auto" />
              <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
                No order found with that ID
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
                Please verify your order number format (e.g. SSG-2026-XXXX) or chat with us on WhatsApp.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
