import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '📦' },
  { path: '/admin/orders', label: 'Orders', icon: '📋' },
  { path: '/admin/walkin', label: 'Walk-in Sale', icon: '🧾' },
  { path: '/admin/schools', label: 'Schools', icon: '🏫' },
  { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { path: '/admin/shops', label: 'Shops', icon: '🏪' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0A0A0A] flex flex-col transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-5 border-b border-white/10">
          <div className="text-white font-black text-xl">SSG</div>
          <div className="text-white/40 text-xs mt-0.5">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-[#FF5A1F] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="text-white/40 text-xs px-3 mb-2 truncate">{user?.email}</div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-[#F5F5F0]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-[#0A0A0A]">SSG Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
