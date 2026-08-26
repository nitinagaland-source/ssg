import { Product, ProductFilters } from '../types';
import productsData from '../mocks/products.json';

const products: Product[] = productsData as Product[];

export async function fetchProducts(filters: ProductFilters): Promise<{ products: Product[]; total: number }> {
  await new Promise((res) => setTimeout(res, 150));

  let filtered = products.filter((p) => p.isActive);

  // Shop filter (only products that are generic or have inventory for that shop)
  if (filters.shopId) {
    filtered = filtered.filter((p) => {
      const stock = p.stockByShop[filters.shopId] ?? 0;
      if (filters.inStockOnly) {
        return stock > 0;
      }
      return true;
    });
  }

  // School filter
  if (filters.schoolId) {
    filtered = filtered.filter((p) => p.schoolId === filters.schoolId || p.schoolId === null);
  }

  // Category filter
  if (filters.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === filters.categoryId || p.subCategoryId === filters.categoryId);
  }

  // Classes filter
  if (filters.classes && filters.classes.length > 0) {
    filtered = filtered.filter((p) => {
      if (p.classes.length === 0) return true;
      return filters.classes!.some((cls) => p.classes.includes(cls));
    });
  }

  // Price filters
  if (typeof filters.priceMin === 'number') {
    filtered = filtered.filter((p) => p.price >= filters.priceMin!);
  }
  if (typeof filters.priceMax === 'number') {
    filtered = filtered.filter((p) => p.price <= filters.priceMax!);
  }

  // In stock only filter
  if (filters.inStockOnly && filters.shopId) {
    filtered = filtered.filter((p) => (p.stockByShop[filters.shopId] ?? 0) > 0);
  }

  // Search filter
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchClass = p.classes.some((c) => c.toLowerCase().includes(q));
      return matchName || matchDesc || matchSku || matchBrand || matchClass;
    });
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // featured
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = filtered.length;
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  await new Promise((res) => setTimeout(res, 100));
  const product = products.find((p) => p.slug === slug || p.id === slug);
  if (!product) {
    throw new Error(`Product ${slug} not found`);
  }
  return product;
}

export async function searchProducts(shopId: string, query: string): Promise<Product[]> {
  await new Promise((res) => setTimeout(res, 120));
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products.filter((p) => {
    if (!p.isActive) return false;
    const matchName = p.name.toLowerCase().includes(q);
    const matchDesc = p.description.toLowerCase().includes(q);
    const matchSku = p.sku.toLowerCase().includes(q);
    const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
    const matchClass = p.classes.some((c) => c.toLowerCase().includes(q));
    return matchName || matchDesc || matchSku || matchBrand || matchClass;
  });
}
