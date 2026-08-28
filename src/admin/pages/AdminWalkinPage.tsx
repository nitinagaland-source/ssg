import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetShops, adminGetProducts, adminCreateWalkinSale } from '../api/client';

export function AdminWalkinPage() {
  const { token } = useAdminAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [shopId, setShopId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [items, setItems] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    Promise.all([adminGetShops(token), adminGetProducts(token)]).then(([s, p]) => {
      const shopList = s.shops || s || [];
      setShops(shopList);
      setProducts(p.products || p || []);
      if (shopList.length > 0) setShopId(shopList[0].id);
      setLoading(false);
    });
  }, [token]);

  const filteredProducts = products.filter(p =>
    shopId && (p.stockByShop?.[shopId] || 0) > 0 &&
    (p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const addItem = (product: any) => {
    const existing = items.find(i => i.productId === product.id);
    if (existing) {
      setItems(items.map(i => i.productId === product.id ? {...i, quantity: i.quantity + 1} : i));
    } else {
      setItems([...items, { productId: product.id, name: product.name, price: product.price, quantity: 1, sku: product.sku }]);
    }
    setProductSearch('');
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) setItems(items.filter(i => i.productId !== productId));
    else setItems(items.map(i => i.productId === productId ? {...i, quantity: qty} : i));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = async () => {
    if (!token || !shopId || items.length === 0) return;
    setSaving(true);
    setError('');
    try {
      const res = await adminCreateWalkinSale(token, {
        shopId,
        customer: { name: customerName || 'Walk-in Customer', phone: customerPhone || '0000000000' },
        paymentMethod,
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        subtotal,
        total: subtotal,
      });
      setSuccess(`Sale recorded! Order ID: ${res.saleId || res.id}`);
      setItems([]);
      setCustomerName('');
      setCustomerPhone('');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-20 text-[#6B6B6B]">Loading...</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-black text-[#0A0A0A]">Walk-in Sale</h1>
      <p className="text-sm text-[#6B6B6B]">Record an in-store sale — inventory deducts automatically.</p>

      {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg font-medium">{success}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 space-y-4">
        {/* Shop & Customer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Shop *</label>
            <select value={shopId} onChange={e => { setShopId(e.target.value); setItems([]); }}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
              {shops.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Payment</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Customer Name</label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Phone</label>
            <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Optional" />
          </div>
        </div>

        {/* Product search */}
        <div>
          <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Add Product</label>
          <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
            placeholder="Search by name or SKU..." />
          {productSearch && filteredProducts.length > 0 && (
            <div className="border border-[#E0E0E0] rounded-lg mt-1 divide-y divide-[#F0F0F0] max-h-48 overflow-y-auto">
              {filteredProducts.slice(0, 8).map(p => (
                <button key={p.id} onClick={() => addItem(p)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[#F5F5F0] text-left">
                  <div>
                    <div className="font-medium text-[#0A0A0A]">{p.name}</div>
                    <div className="text-xs text-[#6B6B6B]">Stock: {p.stockByShop?.[shopId] || 0}</div>
                  </div>
                  <div className="font-bold text-[#0A0A0A]">₹{p.price}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        {items.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-[#0A0A0A] mb-2">Items</div>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3 bg-[#F5F5F0] rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0A0A0A] truncate">{item.name}</div>
                    <div className="text-xs text-[#6B6B6B]">₹{item.price} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white border border-[#E0E0E0] text-sm font-bold flex items-center justify-center hover:bg-red-50">−</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white border border-[#E0E0E0] text-sm font-bold flex items-center justify-center hover:bg-green-50">+</button>
                  </div>
                  <div className="text-sm font-bold text-[#0A0A0A] w-16 text-right">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-black text-lg mt-3 pt-3 border-t border-[#E0E0E0]">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={saving || items.length === 0}
          className="w-full bg-[#0A0A0A] text-white rounded-xl py-3 font-bold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? 'Recording...' : `Record Sale · ₹${subtotal}`}
        </button>
      </div>
    </div>
  );
}
