import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetProducts, adminGetCategories, adminGetShops, adminGetWarehouses, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../api/client';
import { MultiImageUpload } from '../components/ImageUpload';

const CLASSES = ['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

const EMPTY_PRODUCT = {
  id: '', name: '', slug: '', description: '', price: 0, mrp: 0,
  categoryId: '', schoolId: null, brand: '', sku: '', images: [],
  classes: [], isActive: true, isFeatured: false, isBestSeller: false,
  stockByShop: {}, stockByWarehouse: {},
  specifications: [],
};

export function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [p, c, s, w] = await Promise.all([
        adminGetProducts(token), adminGetCategories(token),
        adminGetShops(token), adminGetWarehouses(token)
      ]);
      setProducts(p.products || p || []);
      setCategories(c.categories || c || []);
      setShops(s.shops || s || []);
      setWarehouses(w.warehouses || w || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    const shopStock: any = {};
    const whStock: any = {};
    shops.forEach(s => shopStock[s.id] = 0);
    warehouses.forEach(w => whStock[w.id] = 0);
    setEditing({ ...EMPTY_PRODUCT, stockByShop: shopStock, stockByWarehouse: whStock });
  };

  const openEdit = (p: any) => {
    const shopStock: any = { ...p.stockByShop };
    const whStock: any = { ...p.stockByWarehouse };
    shops.forEach(s => { if (!(s.id in shopStock)) shopStock[s.id] = 0; });
    warehouses.forEach(w => { if (!(w.id in whStock)) whStock[w.id] = 0; });
    setEditing({
      ...p,
      stockByShop: shopStock,
      stockByWarehouse: whStock,
      images: p.images || [],
      classes: p.classes || [],
      specifications: p.specifications || [],
    });
  };

  const syncWarehouseStock = (shopId: string, qty: number) => {
    const shop = shops.find(s => s.id === shopId);
    if (!shop?.warehouseId) return;
    setEditing((prev: any) => ({
      ...prev,
      stockByShop: { ...prev.stockByShop, [shopId]: qty },
      stockByWarehouse: { ...prev.stockByWarehouse, [shop.warehouseId]: qty }
    }));
  };

  // ── Specifications helpers ────────────────────────────────────────────────
  const addSpec = () => {
    setEditing((prev: any) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { label: '', value: '' }]
    }));
  };

  const updateSpec = (i: number, field: 'label' | 'value', val: string) => {
    setEditing((prev: any) => {
      const specs = [...(prev.specifications || [])];
      specs[i] = { ...specs[i], [field]: val };
      return { ...prev, specifications: specs };
    });
  };

  const removeSpec = (i: number) => {
    setEditing((prev: any) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_: any, idx: number) => idx !== i)
    }));
  };

  // ── Classes helpers ───────────────────────────────────────────────────────
  const toggleClass = (cls: string) => {
    setEditing((prev: any) => {
      const current: string[] = prev.classes || [];
      return {
        ...prev,
        classes: current.includes(cls)
          ? current.filter(c => c !== cls)
          : [...current, cls]
      };
    });
  };

  const handleSave = async () => {
    if (!token || !editing) return;
    setSaving(true);
    setError('');
    try {
      const id = editing.id || (editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
      const slug = editing.slug || id;
      if (!editing.id) {
        await adminCreateProduct(token, { ...editing, id, slug });
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

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search products by name or SKU..."
        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E0E0] bg-[#F5F5F0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Total Stock</th>
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
                        <div className="flex items-center gap-2">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />}
                          <div>
                            <div className="font-medium text-[#0A0A0A] line-clamp-1">{p.name}</div>
                            <div className="text-xs text-[#6B6B6B]">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">{p.sku}</td>
                      <td className="px-4 py-3 font-semibold">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          (totalStock as number) === 0 ? 'bg-red-100 text-red-600' :
                          (totalStock as number) < 10 ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>{totalStock as number} units</span>
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

      {/* Edit/Add Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editing.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#6B6B6B] hover:text-[#0A0A0A]">✕</button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}

              {/* Name + SKU */}
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

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Description</label>
                <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})}
                  rows={2} className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A] resize-none" />
              </div>

              {/* Price + MRP + Brand */}
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

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Category</label>
                <select value={editing.categoryId} onChange={e => setEditing({...editing, categoryId: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Classes / Grades */}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Classes / Grades</label>
                <p className="text-xs text-[#6B6B6B] mb-2">Select all grades this product applies to. Leave empty for general products.</p>
                <div className="flex flex-wrap gap-2">
                  {CLASSES.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleClass(cls)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        (editing.classes || []).includes(cls)
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-white text-[#6B6B6B] border-[#E0E0E0] hover:border-[#0A0A0A]'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <MultiImageUpload
                label="Product Images (upload from your device)"
                values={editing.images || []}
                onChange={urls => setEditing({...editing, images: urls})}
                folder="products"
              />

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0A0A0A]">Specifications</label>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    + Add row
                  </button>
                </div>
                <p className="text-xs text-[#6B6B6B] mb-2">These show in the Specifications tab on the product page. E.g. Pages → 200, Binding → Spiral</p>
                {(editing.specifications || []).length === 0 && (
                  <div className="text-xs text-[#9B9B9B] italic py-2">No specifications yet. Click "+ Add row" to add one.</div>
                )}
                <div className="space-y-2">
                  {(editing.specifications || []).map((spec: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={spec.label}
                        onChange={e => updateSpec(i, 'label', e.target.value)}
                        placeholder="Label (e.g. Pages)"
                        className="flex-1 border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
                      />
                      <input
                        value={spec.value}
                        onChange={e => updateSpec(i, 'value', e.target.value)}
                        placeholder="Value (e.g. 200)"
                        className="flex-1 border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="text-red-400 hover:text-red-600 text-lg leading-none px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock by Shop */}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1">Stock by Shop</label>
                <p className="text-xs text-[#6B6B6B] mb-2">Setting stock for a shop auto-updates the linked warehouse too.</p>
                <div className="space-y-2">
                  {shops.map((shop: any) => {
                    const wh = warehouses.find(w => w.id === shop.warehouseId);
                    return (
                      <div key={shop.id} className="flex items-center gap-3 bg-[#F5F5F0] rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-[#0A0A0A]">{shop.name}</div>
                          {wh && <div className="text-xs text-[#6B6B6B]">Warehouse: {wh.name}</div>}
                        </div>
                        <input
                          type="number" min="0"
                          value={editing.stockByShop?.[shop.id] || 0}
                          onChange={e => syncWarehouseStock(shop.id, +e.target.value)}
                          className="w-20 border border-[#E0E0E0] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#0A0A0A] text-center bg-white"
                        />
                        <span className="text-xs text-[#6B6B6B]">units</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-4 flex-wrap">
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
