import { Shop } from '../types';
import shopsData from '../mocks/shops.json';

const shops: Shop[] = shopsData as Shop[];

export async function fetchShops(): Promise<Shop[]> {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 120));
  return shops.filter((s) => s.isActive);
}

export async function fetchShopById(id: string): Promise<Shop | null> {
  await new Promise((res) => setTimeout(res, 100));
  const shop = shops.find((s) => s.id === id || s.slug === id);
  if (!shop) {
    return null;
  }
  return shop;
}
