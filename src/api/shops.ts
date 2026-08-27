import { Shop } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchShops(): Promise<Shop[]> {
  if (!BASE) {
    const { default: shopsData } = await import('../mocks/shops.json');
    return (shopsData as Shop[]).filter((s) => s.isActive);
  }
  const res = await fetch(`${BASE}/api/shops`);
  if (!res.ok) throw new Error('Failed to fetch shops');
  const data = await res.json();
  return data.shops ?? data;
}

export async function fetchShopById(id: string): Promise<Shop | null> {
  if (!BASE) {
    const { default: shopsData } = await import('../mocks/shops.json');
    const shops = shopsData as Shop[];
    return shops.find((s) => s.id === id || s.slug === id) ?? null;
  }
  const res = await fetch(`${BASE}/api/shops/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch shop');
  const data = await res.json();
  return data.shop ?? data;
}
