import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedShop } from '../context/SelectedShopContext';
import { Shop } from '../types';
import { Search, MapPin, Clock, Phone, MessageSquare, Check, ArrowRight, Store } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ShopPickerPage: React.FC = () => {
  const { selectedShop, setSelectedShop, availableShops } = useSelectedShop();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return availableShops;
    const q = searchQuery.toLowerCase();
    return availableShops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.pincode.includes(q)
    );
  }, [availableShops, searchQuery]);

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAFA] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>Guwahati Retail Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 tracking-tight">
            Select Your Store
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Choose your nearest SSG branch for local school syllabuses, verified stock, and same-day delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area (Panbazar, GS Road, Beltola, Maligaon)..."
              className="w-full bg-white border border-neutral-200 hover:border-purple-300 focus:border-purple-600 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none shadow-xs transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Shop List */}
        <div className="max-w-xl mx-auto space-y-3">
          {filteredShops.map((shop) => {
            const isSelected = selectedShop?.id === shop.id;

            return (
              <div
                key={shop.id}
                onClick={() => handleSelectShop(shop)}
                className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                  isSelected
                    ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md bg-purple-50/30'
                    : 'border-neutral-200 hover:border-purple-300 hover:shadow-xs'
                }`}
              >
                {/* Title & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-purple-700 bg-purple-700 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                      {shop.name}
                    </h3>
                  </div>

                  {isSelected ? (
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                      Active Store
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-purple-700 hover:underline">
                      Select Shop →
                    </span>
                  )}
                </div>

                {/* Address */}
                <p className="text-xs sm:text-sm text-neutral-600 flex items-start gap-2 pl-7.5">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{shop.address}, {shop.city} — {shop.pincode}</span>
                </p>

                {/* Contact & Hours */}
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100 pl-7.5 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="whitespace-nowrap">{shop.openHours}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    <a
                      href={`tel:${shop.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-purple-700 font-medium whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="whitespace-nowrap font-sans">{shop.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
                        `Hi, I have a query about ${shop.name}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0 whitespace-nowrap"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="whitespace-nowrap">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct continue button */}
        {selectedShop && (
          <div className="text-center pt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-xs text-neutral-600"
            >
              <span>Currently shopping at {selectedShop.name} — Return to Home</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
