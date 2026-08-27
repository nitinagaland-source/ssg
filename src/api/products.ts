import { Product, ProductFilters } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function getMockProducts(): Promise<Product[]> {
  const { default: productsData } = await import('../mocks/products.json');
  return productsData as Product[];
}

export async function fetchProducts(filters: ProductFilters): Promise<{ products: Product[]; total: number }> {
  if (!BASE) {
    const products = await getMockProducts();
    let filtered = products.filter((p) => p.isActive);
    if (filters.shopId) {
      filtered = filtered.filter((p) => {
        const stock = p.stockByShop[filters.shopId] ?? 0;
        if (filters.inStockOnly) return stock > 0;
        return true;
      });
    }
    if (filters.schoolId) filtered = filtered.filter((p) => p.schoolId === filters.schoolId || p.schoolId === null);
    if (filters.categoryId) filtered = filtered.filter((p) => p.categoryId === filters.categoryId || p.subCategoryId === filters.categoryId);
    if (filters.classes && filters.classes.length > 0) filtered = filtered.filter((p) => p.classes.length === 0 || filters.classes!.some((c) => p.classes.includes(c)));
    if (typeof filters.priceMin === 'number') filtered = filtered.filter((p) => p.price >= filters.priceMin!);
    if (typeof filters.priceMax === 'number') filtered = filtered.filter((p) => p.price <= filters.priceMax!);
    if (filters.search?.trim()) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (filters.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    return { products: filtered.slice((page - 1) * limit, page * limit), total };
  }

  const params = new URLSearchParams();
  if (filters.shopId) params.set('shopId', filters.shopId);
  if (filters.schoolId) params.set('schoolId', filters.schoolId);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  if (typeof filters.priceMin === 'number') params.set('priceMin', String(filters.priceMin));
  if (typeof filters.priceMax === 'number') params.set('priceMax', String(filters.priceMax));
  if (filters.inStockOnly) params.set('inStockOnly', 'true');
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.classes?.length) params.set('classes', filters.classes.join(','));

  const res = await fetch(`${BASE}/api/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return { products: data.products ?? data, total: data.total ?? (data.products ?? data).length };
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  if (!BASE) {
    const products = await getMockProducts();
    const product = products.find((p) => p.slug === slug || p.id === slug);
    if (!product) throw new Error(`Product ${slug} not found`);
    return product;
  }
  const res = await fetch(`${BASE}/api/products/${slug}`);
  if (!res.ok) throw new Error(`Product ${slug} not found`);
  const data = await res.json();
  return data.product ?? data;
}

export async function searchProducts(shopId: string, query: string): Promise<Product[]> {
  if (!BASE) {
    const products = await getMockProducts();
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter((p) => p.isActive && (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  }
  const res = await fetch(`${BASE}/api/products?shopId=${shopId}&search=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.products ?? data;
}
