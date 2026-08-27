import { Category } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchCategories(_shopId?: string): Promise<Category[]> {
  if (!BASE) {
    const { default: categoriesData } = await import('../mocks/categories.json');
    const categories = categoriesData as Category[];
    return [...categories].sort((a, b) => a.order - b.order);
  }
  const res = await fetch(`${BASE}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  const cats: Category[] = data.categories ?? data;
  return cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  if (!BASE) {
    const { default: categoriesData } = await import('../mocks/categories.json');
    const categories = categoriesData as Category[];
    const cat = categories.find((c) => c.slug === slug || c.id === slug);
    if (!cat) throw new Error(`Category ${slug} not found`);
    return cat;
  }
  const res = await fetch(`${BASE}/api/categories/${slug}`);
  if (!res.ok) throw new Error(`Category ${slug} not found`);
  const data = await res.json();
  return data.category ?? data;
}
