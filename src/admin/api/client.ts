const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function adminFetch(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Products
export const adminGetProducts = (token: string) =>
  adminFetch('/api/products?limit=100', token);
export const adminCreateProduct = (token: string, data: any) =>
  adminFetch('/api/products', token, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateProduct = (token: string, id: string, data: any) =>
  adminFetch(`/api/products/${id}`, token, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteProduct = (token: string, id: string) =>
  adminFetch(`/api/products/${id}`, token, { method: 'DELETE' });

// Schools
export const adminGetSchools = (token: string) =>
  adminFetch('/api/schools', token);
export const adminCreateSchool = (token: string, data: any) =>
  adminFetch('/api/schools', token, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateSchool = (token: string, id: string, data: any) =>
  adminFetch(`/api/schools/${id}`, token, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteSchool = (token: string, id: string) =>
  adminFetch(`/api/schools/${id}`, token, { method: 'DELETE' });

// Categories
export const adminGetCategories = (token: string) =>
  adminFetch('/api/categories', token);
export const adminCreateCategory = (token: string, data: any) =>
  adminFetch('/api/categories', token, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateCategory = (token: string, id: string, data: any) =>
  adminFetch(`/api/categories/${id}`, token, { method: 'PUT', body: JSON.stringify(data) });

// Shops
export const adminGetShops = (token: string) =>
  adminFetch('/api/shops', token);
export const adminCreateShop = (token: string, data: any) =>
  adminFetch('/api/shops', token, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateShop = (token: string, id: string, data: any) =>
  adminFetch(`/api/shops/${id}`, token, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteShop = (token: string, id: string) =>
  adminFetch(`/api/shops/${id}`, token, { method: 'DELETE' });

// Warehouses
export const adminGetWarehouses = (token: string) =>
  adminFetch('/api/warehouses', token);
export const adminCreateWarehouse = (token: string, data: any) =>
  adminFetch('/api/warehouses', token, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateWarehouse = (token: string, id: string, data: any) =>
  adminFetch(`/api/warehouses/${id}`, token, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteWarehouse = (token: string, id: string) =>
  adminFetch(`/api/warehouses/${id}`, token, { method: 'DELETE' });
export const adminGetOrders = (token: string, shopId?: string) =>
  adminFetch(`/api/orders${shopId ? `?shopId=${shopId}` : ''}`, token);
export const adminUpdateOrderStatus = (token: string, id: string, status: string) =>
  adminFetch(`/api/orders/${id}/status`, token, { method: 'PUT', body: JSON.stringify({ status }) });

// Walk-in sale
export const adminCreateWalkinSale = (token: string, data: any) =>
  adminFetch('/api/sales/walkin', token, { method: 'POST', body: JSON.stringify(data) });
