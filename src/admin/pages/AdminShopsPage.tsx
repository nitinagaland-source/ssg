import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  adminGetShops, adminCreateShop, adminUpdateShop, adminDeleteShop,
  adminGetWarehouses, adminCreateWarehouse, adminUpdateWarehouse, adminDeleteWarehouse,
} from '../api/client';

const EMPTY_SHOP: any = {
  id: '', name: '', slug: '', address: '', city: 'Guwahati', state: 'Assam',
  pincode: '', phone: '', whatsapp: '', openHours: '9:00 AM - 7:00 PM',
  warehouseId: '', isActive: true,
};

const EMPTY_WH: any = {
  id: '', name: '', address: '', city: 'Guwahati', state: 'Assam',
  pincode: '', contactPhone: '',
};

export function AdminShopsPage() {
  const { token } = useAdminAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'shops' | 'warehouses'>('shops');
  const [editingShop, setEditingShop] = useState<any | null>(null);
  const [editingWh, setEditingWh] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, w] = await Promise.all([adminGetShops(token), adminGetWarehouses(token)]);
      setShops(s.shops || s || []);
      setWarehouses(w.warehouses || w || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const getWarehouse = (whId: string) => warehouses.find(w => w.id === whId);

  const saveShop = async () => {
    if (!token || !editingShop) return;
    setSaving(true); setError('');
    try {
      const slug = editingShop.id || ('shop-' + editingShop.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
      if (!editingShop.id) await adminCreateShop(token, { ...editingShop, id: slug, slug });
      else await adminUpdateShop(token, editingShop.id, editingShop);
      setEditingShop(null); await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deleteShop = async (id: string, name: string) => {
    if (!token || !window.confirm('Deactivate shop "' + name + '"?')) return;
    try { await adminDeleteShop(token, id); await load(); }
    catch (e: any) { setError(e.message); }
  };

  const saveWarehouse = async () => {
    if (!token || !editingWh) return;
    setSaving(true); setError('');
    try {
      const id = editingWh.id || ('wh-' + editingWh.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
      if (!editingWh.id) await adminCreateWarehouse(token, { ...editingWh, id });
      else await adminUpdateWarehouse(token, editingWh.id, editingWh);
      setEditingWh(null); await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deleteWarehouse = async (id: string, name: string) => {
    if (!token || !window.confirm('Delete warehouse "' + name + '"?')) return;
    try { await adminDeleteWarehouse(token, id); await load(); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Shops & Warehouses</h1>
        {tab === 'shops'
          ? <button onClick={() => setEditingShop({ ...EMPTY_SHOP })} className="bg-[#0A0A0A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors">+ Add Shop</button>
          : <button onClick={() => setEditingWh({ ...EMPTY_WH })} className="bg-[#0A0A0A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors">+ Add Warehouse</button>
        }
      </div>

      <div className="flex gap-1 bg-[#F5F5F0] p-1 rounded-xl w-fit">
        {(['shops', 'warehouses'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={'px-4 py-2 rounded-lg text-sm font-semibold transition-colors ' + (tab === t ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#6B6B6B] hover:text-[#0A0A0A]')}>
            {t === 'shops' ? '🏪 Shops (' + shops.length + ')' : '🏭 Warehouses (' + warehouses.length + ')'}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <>
          {tab === 'shops' && (
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
                      <span className={'text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ' + (shop.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                        {shop.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-[#6B6B6B] mb-3">
                      <div>⏰ {shop.openHours}</div>
                      <div>📞 {shop.phone}</div>
                      {shop.whatsapp && <div>💬 +{shop.whatsapp}</div>}
                    </div>
                    <div className="bg-[#F5F5F0] rounded-lg px-3 py-2 mb-3">
                      <div className="text-xs font-semibold text-[#0A0A0A] mb-0.5">Linked Warehouse</div>
                      {wh
                        ? <div className="text-xs text-[#6B6B6B]">🏭 {wh.name}</div>
                        : <div className="text-xs text-orange-500">⚠️ No warehouse linked — click Edit to link one</div>
                      }
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingShop({ ...shop })} className="flex-1 text-xs py-1.5 border border-[#E0E0E0] rounded-lg hover:bg-[#F5F5F0] text-center font-medium">✏️ Edit</button>
                      <button onClick={() => deleteShop(shop.id, shop.name)} className="flex-1 text-xs py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-center">Deactivate</button>
                    </div>
                  </div>
                );
              })}
              {shops.length === 0 && <div className="col-span-2 text-center py-12 text-xs text-[#6B6B6B]">No shops yet — click + Add Shop</div>}
            </div>
          )}

          {tab === 'warehouses' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {warehouses.map(wh => {
                const linkedShops = shops.filter(s => s.warehouseId === wh.id);
                return (
                  <div key={wh.id} className="bg-white rounded-xl border border-[#E0E0E0] p-5">
                    <div className="mb-3">
                      <h2 className="font-bold text-[#0A0A0A]">🏭 {wh.name}</h2>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{wh.address}</p>
                      <p className="text-xs text-[#6B6B6B]">{wh.city}, {wh.state} - {wh.pincode}</p>
                      {wh.contactPhone && <p className="text-xs text-[#6B6B6B] mt-0.5">📞 {wh.contactPhone}</p>}
                    </div>
                    <div className="bg-[#F5F5F0] rounded-lg px-3 py-2 mb-3">
                      <div className="text-xs font-semibold text-[#0A0A0A] mb-1">Shops using this warehouse</div>
                      {linkedShops.length > 0
                        ? linkedShops.map(s => <div key={s.id} className="text-xs text-[#6B6B6B]">🏪 {s.name}</div>)
                        : <div className="text-xs text-[#6B6B6B]">No shops linked yet</div>
                      }
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingWh({ ...wh })} className="flex-1 text-xs py-1.5 border border-[#E0E0E0] rounded-lg hover:bg-[#F5F5F0] text-center font-medium">✏️ Edit</button>
                      <button onClick={() => deleteWarehouse(wh.id, wh.name)} className="flex-1 text-xs py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-center">Delete</button>
                    </div>
                  </div>
                );
              })}
              {warehouses.length === 0 && <div className="col-span-2 text-center py-12 text-xs text-[#6B6B6B]">No warehouses yet — click + Add Warehouse</div>}
            </div>
          )}
        </>
      )}

      {/* SHOP MODAL */}
      {editingShop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-4">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editingShop.id ? 'Edit Shop' : 'Add New Shop'}</h2>
              <button onClick={() => { setEditingShop(null); setError(''); }} className="text-[#6B6B6B] hover:text-[#0A0A0A] text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Shop Name *</label>
                <input value={editingShop.name} onChange={e => setEditingShop({...editingShop, name: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="SSG Beltola Tiniali" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Address</label>
                <input value={editingShop.address} onChange={e => setEditingShop({...editingShop, address: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Full street address" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">City</label>
                  <input value={editingShop.city} onChange={e => setEditingShop({...editingShop, city: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">State</label>
                  <input value={editingShop.state} onChange={e => setEditingShop({...editingShop, state: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Pincode</label>
                  <input value={editingShop.pincode} onChange={e => setEditingShop({...editingShop, pincode: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Phone</label>
                  <input value={editingShop.phone} onChange={e => setEditingShop({...editingShop, phone: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="+91 98640 12345" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">WhatsApp Number</label>
                  <input value={editingShop.whatsapp} onChange={e => setEditingShop({...editingShop, whatsapp: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="919864012345" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Open Hours</label>
                <input value={editingShop.openHours} onChange={e => setEditingShop({...editingShop, openHours: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="9:00 AM - 7:00 PM" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">🏭 Link to Warehouse</label>
                <select value={editingShop.warehouseId || ''} onChange={e => setEditingShop({...editingShop, warehouseId: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A] bg-white">
                  <option value="">— No warehouse linked —</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
                </select>
                <p className="text-xs text-[#6B6B6B] mt-1">Orders from this shop will deduct inventory from the linked warehouse.</p>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editingShop.isActive !== false} onChange={e => setEditingShop({...editingShop, isActive: e.target.checked})} className="rounded" />
                Active (visible to customers)
              </label>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => { setEditingShop(null); setError(''); }} className="px-4 py-2 text-sm text-[#6B6B6B]">Cancel</button>
              <button onClick={saveShop} disabled={saving} className="bg-[#0A0A0A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Shop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WAREHOUSE MODAL */}
      {editingWh && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md my-4">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editingWh.id ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
              <button onClick={() => { setEditingWh(null); setError(''); }} className="text-[#6B6B6B] hover:text-[#0A0A0A] text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Warehouse Name *</label>
                <input value={editingWh.name} onChange={e => setEditingWh({...editingWh, name: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Beltola Warehouse" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Address</label>
                <input value={editingWh.address} onChange={e => setEditingWh({...editingWh, address: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Storage/godown address" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">City</label>
                  <input value={editingWh.city} onChange={e => setEditingWh({...editingWh, city: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">State</label>
                  <input value={editingWh.state} onChange={e => setEditingWh({...editingWh, state: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Pincode</label>
                  <input value={editingWh.pincode} onChange={e => setEditingWh({...editingWh, pincode: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Contact Phone</label>
                <input value={editingWh.contactPhone || ''} onChange={e => setEditingWh({...editingWh, contactPhone: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="+91 98640 12345" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => { setEditingWh(null); setError(''); }} className="px-4 py-2 text-sm text-[#6B6B6B]">Cancel</button>
              <button onClick={saveWarehouse} disabled={saving} className="bg-[#0A0A0A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Warehouse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
