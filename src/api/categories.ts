import { Category } from '../types';
import categoriesData from '../mocks/categories.json';

const categories: Category[] = categoriesData as Category[];

export async function fetchCategories(_shopId?: string): Promise<Category[]> {
  await new Promise((res) => setTimeout(res, 100));
  return [...categories].sort((a, b) => a.order - b.order);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  await new Promise((res) => setTimeout(res, 100));
  const category = categories.find((c) => c.slug === slug || c.id === slug);
  if (!category) {
    throw new Error(`Category ${slug} not found`);
  }
  return category;
}
