import { School } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchSchools(shopId?: string): Promise<School[]> {
  if (!BASE) {
    const { default: schoolsData } = await import('../mocks/schools.json');
    const schools = schoolsData as School[];
    if (!shopId) return schools;
    return schools.filter((s) => s.availableInShops.includes(shopId));
  }
  const url = shopId ? `${BASE}/api/schools?shopId=${shopId}` : `${BASE}/api/schools`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch schools');
  const data = await res.json();
  return data.schools ?? data;
}

export async function fetchSchoolBySlug(slug: string): Promise<School> {
  if (!BASE) {
    const { default: schoolsData } = await import('../mocks/schools.json');
    const schools = schoolsData as School[];
    const school = schools.find((s) => s.slug === slug || s.id === slug);
    if (!school) throw new Error(`School ${slug} not found`);
    return school;
  }
  const res = await fetch(`${BASE}/api/schools/${slug}`);
  if (!res.ok) throw new Error(`School ${slug} not found`);
  const data = await res.json();
  return data.school ?? data;
}
