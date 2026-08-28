import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetProducts, adminGetCategories, adminGetShops, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../api/client';

const EMPTY_PRODUCT = {
  id: '', name: '', slug: '', description: '', price: 0, mrp: 0,
  categoryId: '', schoolId: null, brand: '', sku: '', images: [''],
  classes: [], isActive: true, isFeatured: false, isBestSeller: false,
  stockByShop: {},
};

export function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([adminGetProducts(token), adminGetCategories(token), adminGetShops(token)]);
      setProducts(p.products || p || []);
      setCategories(c.categories || c || []);
      setShops(s.shops || s || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    const stock: any = {};
    shops.forEach(s => stock[s.id] = 0);
    setEditing({ ...EMPTY_PRODUCT, stockByShop: stock });
  };

  const openEdit = (p: any) => {
    const stock: any = { ...p.stockByShop };
    shops.forEach(s => { if (!(s.id in stock)) stock[s.id] = 0; });
    setEditing({ ...p, stockByShop: stock, images: p.images?.length ? p.images : [''] });
  };

  const handleSave = async () => {
    if (!token || !editing) return;
    setSaving(true);
    setError('');
    try {
      if (!editing.id) {
        const id = editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await adminCreateProduct(token, { ...editing, id });
      } else {
        await adminUpdateProduct(token, editing.id, editing);
      }
      setEditing(null);
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token || !confirm(`Delete "${name}"?`)) return;
    try { await adminDeleteProduct(token, id); await load(); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Products</h1>
        <button onClick={openNew} className="bg-[#0A0A0A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors">
          + Add Product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
      />

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E0E0] bg-[#F5F5F0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {filtered.map(p => {
                  const totalStock = Object.values(p.stockByShop || {}).reduce((s: number, v) => s + (v as number), 0);
                  return (
                    <tr key={p.id} className="hover:bg-[#F9F9F7]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#0A0A0A] line-clamp-1">{p.name}</div>
                        <div className="text-xs text-[#6B6B6B]">{p.brand}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">{p.sku}</td>
                      <td className="px-4 py-3 font-semibold">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          (totalStock as number) === 0 ? 'bg-red-100 text-red-600' :
                          (totalStock as number) < 10 ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>{totalStock as number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(p)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-xs text-[#6B6B6B]">No products found</div>}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editing.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#6B6B6B] hover:text-[#0A0A0A]">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Product Name *</label>
                  <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">SKU</label>
                  <input value={editing.sku} onChange={e => setEditing({...editing, sku: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="BK-XXX-001" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Description</label>
                <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})}
                  rows={3} className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A] resize-none" placeholder="Product description" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Price (₹) *</label>
                  <input type="number" value={editing.price} onChange={e => setEditing({...editing, price: +e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">MRP (₹)</label>
                  <input type="number" value={editing.mrp} onChange={e => setEditing({...editing, mrp: +e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Brand</label>
                  <input value={editing.brand || ''} onChange={e => setEditing({...editing, brand: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="NCERT" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Category</label>
                  <select value={editing.categoryId} onChange={e => setEditing({...editing, categoryId: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
                    <option value="">Select category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Image URL</label>
                  <input value={editing.images?.[0] || ''} onChange={e => setEditing({...editing, images: [e.target.value]})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="https://..." />
                </div>
              </div>

              {/* Stock by shop */}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-2">Stock by Shop</label>
                <div className="space-y-2">
                  {shops.map((shop: any) => (
                    <div key={shop.id} className="flex items-center gap-3">
                      <span className="text-xs text-[#6B6B6B] flex-1 truncate">{shop.name}</span>
                      <input
                        type="number" min="0"
                        value={editing.stockByShop?.[shop.id] || 0}
                        onChange={e => setEditing({...editing, stockByShop: {...editing.stockByShop, [shop.id]: +e.target.value}})}
                        className="w-24 border border-[#E0E0E0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0A0A0A] text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-4">
                {[['isActive','Active'],['isFeatured','Featured'],['isBestSeller','Best Seller']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-xs font-medium text-[#0A0A0A] cursor-pointer">
                    <input type="checkbox" checked={!!editing[key]} onChange={e => setEditing({...editing, [key]: e.target.checked})} className="rounded" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
