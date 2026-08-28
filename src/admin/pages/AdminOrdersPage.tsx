import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetOrders, adminUpdateOrderStatus, adminGetShops } from '../api/client';

const STATUS_OPTIONS = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];
const STATUS_COLORS: any = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [shopId, setShopId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [o, s] = await Promise.all([adminGetOrders(token, shopId || undefined), adminGetShops(token)]);
      setOrders(o.orders || o || []);
      setShops(s.shops || s || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token, shopId]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await adminUpdateOrderStatus(token, id, status);
      await load();
      if (selected?.id === id) setSelected({...selected, status});
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Orders</h1>
        <select value={shopId} onChange={e => setShopId(e.target.value)}
          className="border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
          <option value="">All Shops</option>
          {shops.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E0E0] bg-[#F5F5F0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-[#F9F9F7]">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0A0A0A]">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0A0A0A] text-xs">{o.customer?.name}</div>
                      <div className="text-xs text-[#6B6B6B]">{o.customer?.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-xs">₹{o.total}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[o.status]}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B6B6B]">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(o)} className="text-xs text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="text-center py-12 text-xs text-[#6B6B6B]">No orders found</div>}
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">Order {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-[#6B6B6B] hover:text-[#0A0A0A]">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-[#6B6B6B] mb-1">Customer</div>
                  <div className="font-semibold">{selected.customer?.name}</div>
                  <div className="text-xs">{selected.customer?.phone}</div>
                  <div className="text-xs">{selected.customer?.email}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6B6B6B] mb-1">Delivery</div>
                  <div className="text-xs">{selected.deliveryAddress?.line1}</div>
                  <div className="text-xs">{selected.deliveryAddress?.city}, {selected.deliveryAddress?.pincode}</div>
                  <div className="text-xs mt-1 font-medium">{selected.deliveryMethod} · {selected.paymentMethod}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B6B6B] mb-2">Items</div>
                <div className="space-y-2">
                  {selected.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#0A0A0A]">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E0E0E0] mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{selected.total}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B6B6B] mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${selected.status === s ? STATUS_COLORS[s] : 'bg-[#F5F5F0] text-[#6B6B6B] hover:bg-[#E0E0E0]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
