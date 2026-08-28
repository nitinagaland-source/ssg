import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminWalkinPage } from './pages/AdminWalkinPage';
import { AdminSchoolsPage } from './pages/AdminSchoolsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminShopsPage } from './pages/AdminShopsPage';

function AdminRoutes() {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-[#6B6B6B] text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return <AdminLoginPage />;

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/products" element={<AdminProductsPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/walkin" element={<AdminWalkinPage />} />
        <Route path="/schools" element={<AdminSchoolsPage />} />
        <Route path="/categories" element={<AdminCategoriesPage />} />
        <Route path="/shops" element={<AdminShopsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}
