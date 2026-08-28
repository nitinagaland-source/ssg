import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetSchools, adminGetShops, adminCreateSchool, adminUpdateSchool, adminDeleteSchool } from '../api/client';

const BOARDS = ['CBSE', 'ICSE', 'SEBA', 'STATE', 'NBSE', 'OTHER'];
const CLASSES = ['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

const EMPTY: any = { id: '', name: '', slug: '', logo: '', city: '', board: 'CBSE', classesOffered: [], availableInShops: [], address: '' };

export function AdminSchoolsPage() {
  const { token } = useAdminAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, sh] = await Promise.all([adminGetSchools(token), adminGetShops(token)]);
      setSchools(s.schools || s || []);
      setShops(sh.shops || sh || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (s: any) => setEditing({ ...s });

  const handleSave = async () => {
    if (!token || !editing) return;
    setSaving(true);
    setError('');
    try {
      const id = editing.id || editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (!editing.id) await adminCreateSchool(token, { ...editing, id });
      else await adminUpdateSchool(token, editing.id, editing);
      setEditing(null);
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token || !confirm(`Delete "${name}"?`)) return;
    try { await adminDeleteSchool(token, id); await load(); }
    catch (e: any) { setError(e.message); }
  };

  const toggleClass = (cls: string) => {
    const arr = editing.classesOffered || [];
    setEditing({ ...editing, classesOffered: arr.includes(cls) ? arr.filter((c: string) => c !== cls) : [...arr, cls] });
  };

  const toggleShop = (shopId: string) => {
    const arr = editing.availableInShops || [];
    setEditing({ ...editing, availableInShops: arr.includes(shopId) ? arr.filter((s: string) => s !== shopId) : [...arr, shopId] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Schools</h1>
        <button onClick={openNew} className="bg-[#0A0A0A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors">+ Add School</button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
              <div className="flex items-start gap-3">
                {s.logo && <img src={s.logo} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0A0A0A] text-sm line-clamp-2">{s.name}</div>
                  <div className="text-xs text-[#6B6B6B] mt-0.5">{s.board} · {s.city}</div>
                  <div className="text-xs text-[#6B6B6B]">{s.classesOffered?.length || 0} classes</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(s)} className="flex-1 text-xs text-center py-1.5 border border-[#E0E0E0] rounded-lg hover:bg-[#F5F5F0]">Edit</button>
                <button onClick={() => handleDelete(s.id, s.name)} className="flex-1 text-xs text-center py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
          {schools.length === 0 && <div className="col-span-3 text-center py-12 text-xs text-[#6B6B6B]">No schools found</div>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-4">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editing.id ? 'Edit School' : 'Add School'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#6B6B6B] hover:text-[#0A0A0A]">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">School Name *</label>
                <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="School name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">City</label>
                  <input value={editing.city} onChange={e => setEditing({...editing, city: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Guwahati" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Board</label>
                  <select value={editing.board} onChange={e => setEditing({...editing, board: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]">
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Logo URL</label>
                <input value={editing.logo || ''} onChange={e => setEditing({...editing, logo: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-2">Classes Offered</label>
                <div className="flex flex-wrap gap-1.5">
                  {CLASSES.map(cls => (
                    <button key={cls} onClick={() => toggleClass(cls)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${editing.classesOffered?.includes(cls) ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E0E0E0] text-[#6B6B6B] hover:border-[#0A0A0A]'}`}>
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-2">Available in Shops</label>
                <div className="space-y-1.5">
                  {shops.map((shop: any) => (
                    <label key={shop.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editing.availableInShops?.includes(shop.id)} onChange={() => toggleShop(shop.id)} className="rounded" />
                      {shop.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save School'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
