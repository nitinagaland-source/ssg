import { School } from '../types';
import schoolsData from '../mocks/schools.json';

const schools: School[] = schoolsData as School[];

export async function fetchSchools(shopId?: string): Promise<School[]> {
  await new Promise((res) => setTimeout(res, 120));
  if (!shopId) return schools;
  return schools.filter((school) => school.availableInShops.includes(shopId));
}

export async function fetchSchoolBySlug(slug: string): Promise<School> {
  await new Promise((res) => setTimeout(res, 100));
  const school = schools.find((s) => s.slug === slug || s.id === slug);
  if (!school) {
    throw new Error(`School ${slug} not found`);
  }
  return school;
}
