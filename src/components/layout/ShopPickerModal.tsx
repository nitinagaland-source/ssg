import React, { useState, useMemo } from 'react';
import { Shop } from '../../types';
import { useSelectedShop } from '../../context/SelectedShopContext';
import { MapPin, Search, Phone, MessageSquare, Check, X, Clock, Store } from 'lucide-react';

interface ShopPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopPickerModal: React.FC<ShopPickerModalProps> = ({ isOpen, onClose }) => {
  const { selectedShop, setSelectedShop, availableShops } = useSelectedShop();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return availableShops;
    const q = searchQuery.toLowerCase();
    return availableShops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(q) ||
        shop.city.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q) ||
        shop.pincode.includes(q)
    );
  }, [availableShops, searchQuery]);

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-purple-100 shadow-2xl overflow-hidden my-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <Store className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 tracking-tight">
                Select Your Store
              </h2>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Guwahati branches • Live warehouse stock &amp; local delivery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area (Panbazar, GS Road, Beltola)..."
              className="w-full bg-neutral-50 border border-neutral-200 hover:border-purple-300 focus:border-purple-600 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Clean Shop List Rows */}
          <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
            {filteredShops.length === 0 ? (
              <div className="py-10 text-center space-y-1">
                <p className="text-sm font-semibold text-neutral-700">No store found</p>
                <p className="text-xs text-neutral-400">
                  Try searching for &quot;Panbazar&quot; or &quot;Guwahati&quot;
                </p>
              </div>
            ) : (
              filteredShops.map((shop) => {
                const isSelected = selectedShop?.id === shop.id;

                return (
                  <div
                    key={shop.id}
                    onClick={() => handleSelectShop(shop)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600/30 shadow-xs'
                        : 'border-neutral-200 bg-white hover:border-purple-300 hover:bg-neutral-50/70'
                    }`}
                  >
                    {/* Top Row: Store Name & Selected Badge / Action */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-purple-700 bg-purple-700 text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                          {shop.name}
                        </h3>
                      </div>

                      {isSelected ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md shrink-0">
                          Active Store
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-purple-700 hover:underline shrink-0">
                          Select
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <p className="text-[11px] sm:text-xs text-neutral-600 flex items-start gap-1.5 pl-6">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{shop.address}, {shop.city} — {shop.pincode}</span>
                    </p>

                    {/* Meta Row: Hours & Quick Contact Action */}
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-neutral-500 pt-1.5 border-t border-neutral-100/80 pl-6">
                      <div className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="whitespace-nowrap">{shop.openHours}</span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 ml-auto">
                        <a
                          href={`tel:${shop.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-neutral-600 hover:text-purple-700 font-medium whitespace-nowrap"
                          title="Call branch"
                        >
                          <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="whitespace-nowrap font-sans">{shop.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
                            `Hi, I have a query about ${shop.name}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors shrink-0 whitespace-nowrap"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="whitespace-nowrap">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>{availableShops.length} verified branches in Assam</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
