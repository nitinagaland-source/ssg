import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory } from '../api/client';

const EMPTY: any = { id: '', name: '', slug: '', icon: '', image: '', order: 1, description: '', isActive: true };

export function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const c = await adminGetCategories(token);
      setCategories(c.categories || c || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const handleSave = async () => {
    if (!token || !editing) return;
    setSaving(true);
    setError('');
    try {
      const id = editing.id || editing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (!editing.id) await adminCreateCategory(token, { ...editing, id });
      else await adminUpdateCategory(token, editing.id, editing);
      setEditing(null);
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Categories</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="bg-[#0A0A0A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors">+ Add Category</button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? <div className="text-center py-20 text-[#6B6B6B]">Loading...</div> : (
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#F5F5F0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B6B]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-[#F9F9F7]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <div className="font-medium text-[#0A0A0A]">{c.name}</div>
                        <div className="text-xs text-[#6B6B6B]">{c.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B6B6B]">{c.order}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing({ ...c })} className="text-xs text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <div className="text-center py-12 text-xs text-[#6B6B6B]">No categories</div>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <h2 className="font-bold text-[#0A0A0A]">{editing.id ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#6B6B6B] hover:text-[#0A0A0A]">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Name *</label>
                <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Icon (emoji)</label>
                  <input value={editing.icon || ''} onChange={e => setEditing({...editing, icon: e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="📚" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Display Order</label>
                  <input type="number" value={editing.order} onChange={e => setEditing({...editing, order: +e.target.value})}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Description</label>
                <input value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})}
                  className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.isActive !== false} onChange={e => setEditing({...editing, isActive: e.target.checked})} />
                Active
              </label>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[#6B6B6B]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
