import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetShops, adminGetWarehouses } from '../api/client';

export function AdminShopsPage() {
  const { token } = useAdminAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([adminGetShops(token), adminGetWarehouses(token)]).then(([s, w]) => {
      setShops(s.shops || s || []);
      setWarehouses(w.warehouses || w || []);
      setLoading(false);
    });
  }, [token]);

  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);

  if (loading) return <div className="text-center py-20 text-[#6B6B6B]">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-[#0A0A0A]">Shops & Warehouses</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {shops.map(shop => {
          const wh = getWarehouse(shop.warehouseId);
          return (
            <div key={shop.id} className="bg-white rounded-xl border border-[#E0E0E0] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-bold text-[#0A0A0A]">{shop.name}</h2>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{shop.address}</p>
                  <p className="text-xs text-[#6B6B6B]">{shop.city}, {shop.state} - {shop.pincode}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {shop.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6B6B6B]">⏰</span>
                  <span>{shop.openHours}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6B6B6B]">📞</span>
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6B6B6B]">💬</span>
                  <span>+{shop.whatsapp}</span>
                </div>
              </div>
              {wh && (
                <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
                  <div className="text-xs font-semibold text-[#0A0A0A] mb-1.5">Linked Warehouse</div>
                  <div className="bg-[#F5F5F0] rounded-lg px-3 py-2">
                    <div className="text-xs font-medium text-[#0A0A0A]">{wh.name}</div>
                    <div className="text-xs text-[#6B6B6B] mt-0.5">{wh.address}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
