import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetOrders, adminGetProducts, adminGetShops } from '../api/client';

export function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [ordersData, productsData, shopsData] = await Promise.all([
          adminGetOrders(token!),
          adminGetProducts(token!),
          adminGetShops(token!),
        ]);
        const orders = ordersData.orders || ordersData || [];
        const products = productsData.products || productsData || [];
        const shopList = shopsData.shops || shopsData || [];
        setShops(shopList);

        const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const lowStock = products.filter((p: any) => {
          const stock = Object.values(p.stockByShop || {}).reduce((s: number, v) => s + (v as number), 0);
          return (stock as number) < 10;
        });

        setStats({ orders: orders.length, revenue, products: products.length, lowStock: lowStock.length });
        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(lowStock.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) return <div className="text-center py-20 text-[#6B6B6B]">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[#0A0A0A]">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.orders, icon: '📋', color: 'bg-blue-50 text-blue-600' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-600' },
          { label: 'Products', value: stats.products, icon: '📦', color: 'bg-purple-50 text-purple-600' },
          { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: 'bg-orange-50 text-orange-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E0E0E0]">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-[#0A0A0A]">{s.value}</div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E0E0E0] flex items-center justify-between">
            <h2 className="font-bold text-[#0A0A0A] text-sm">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-[#FF5A1F] font-medium">View all →</a>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {recentOrders.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[#6B6B6B]">No orders yet</div>
            ) : recentOrders.map((order: any) => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#0A0A0A]">{order.id}</div>
                  <div className="text-xs text-[#6B6B6B]">{order.customer?.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0A0A0A]">₹{order.total}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E0E0E0] flex items-center justify-between">
            <h2 className="font-bold text-[#0A0A0A] text-sm">Low Stock Alert</h2>
            <a href="/admin/products" className="text-xs text-[#FF5A1F] font-medium">Manage →</a>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {lowStockProducts.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[#6B6B6B]">All products have good stock ✅</div>
            ) : lowStockProducts.map((p: any) => {
              const totalStock = Object.values(p.stockByShop || {}).reduce((s: number, v) => s + (v as number), 0);
              return (
                <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#0A0A0A] line-clamp-1">{p.name}</div>
                    <div className="text-xs text-[#6B6B6B]">SKU: {p.sku}</div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                    {totalStock as number} left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shops */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E0E0E0]">
          <h2 className="font-bold text-[#0A0A0A] text-sm">Shops</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F0F0F0]">
          {shops.map((shop: any) => (
            <div key={shop.id} className="px-4 py-4">
              <div className="text-xs font-bold text-[#0A0A0A]">{shop.name}</div>
              <div className="text-xs text-[#6B6B6B] mt-1">{shop.address}</div>
              <div className="text-xs text-[#6B6B6B]">{shop.openHours}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
