import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import { fetchSchools } from '../api/schools';
import { Product, Category, School } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, RotateCcw, Check, X } from 'lucide-react';
import { useGsapScrollReveal } from '../hooks/useGsapScrollReveal';

const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10', 'Class 11', 'Class 12',
];

export const ProductsPage: React.FC = () => {
  const { selectedShop } = useSelectedShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [sort, setSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, schoolsRes] = await Promise.all([
          fetchCategories(),
          fetchSchools(selectedShop?.id),
        ]);
        setCategories(catsRes);
        setSchools(schoolsRes);
      } catch (e) {
        console.error(e);
      }
    }
    loadMeta();
  }, [selectedShop]);

  useEffect(() => {
    async function loadProductsList() {
      try {
        setLoading(true);
        const res = await fetchProducts({
          shopId: selectedShop?.id || 'shop-guwahati-panbazar',
          categoryId: selectedCategoryId || undefined,
          schoolId: selectedSchoolId || undefined,
          classes: selectedClasses.length > 0 ? selectedClasses : undefined,
          inStockOnly,
          priceMax,
          sort,
        });
        setProducts(res.products);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductsList();
  }, [selectedShop, selectedCategoryId, selectedSchoolId, selectedClasses, inStockOnly, priceMax, sort]);

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const resetFilters = () => {
    setSelectedCategoryId('');
    setSelectedSchoolId('');
    setSelectedClasses([]);
    setInStockOnly(false);
    setPriceMax(2000);
    setSort('featured');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId) count++;
    if (selectedSchoolId) count++;
    if (selectedClasses.length > 0) count += selectedClasses.length;
    if (inStockOnly) count++;
    if (priceMax < 2000) count++;
    return count;
  }, [selectedCategoryId, selectedSchoolId, selectedClasses, inStockOnly, priceMax]);

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapScrollReveal(containerRef, [products, loading, categories, schools]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="gsap-section max-w-3xl space-y-2">
        <span className="gsap-item text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 inline-block">
          Complete Stockroom
        </span>
        <h1 className="gsap-item text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display purple-title-flow tracking-tight">
          All School Supplies
        </h1>
        <p className="gsap-item text-sm sm:text-base text-neutral-600">
          Filter syllabus books, tailored school uniforms, practical notebooks, and stationery in stock at {selectedShop?.name || 'SSG Main Store'}.
        </p>
      </div>

      {/* Top Filter and Sort Controls */}
      <div className="gsap-section flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div className="gsap-item flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 text-xs font-semibold bg-white text-purple-950 shadow-2xs cursor-pointer hover:bg-purple-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>
          <span className="text-xs font-medium text-neutral-600">
            Showing <strong className="text-purple-950">{products.length}</strong> items
          </span>
        </div>

        <div className="gsap-item flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-neutral-500 font-medium">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-white border border-purple-200 rounded-full px-3.5 py-1.5 font-medium text-purple-950 shadow-2xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Grid: Desktop Sidebar + Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="gsap-section hidden lg:block lg:col-span-3 space-y-5 bg-white p-5 rounded-2xl border border-purple-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-28">
          <div className="gsap-item flex items-center justify-between border-b border-purple-100 pb-3">
            <h3 className="text-xs font-extrabold font-display text-purple-950 uppercase tracking-wider">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Department / Category */}
          <div className="gsap-item space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs text-purple-950 font-medium focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* School */}
          <div className="gsap-item space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              School
            </label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs text-purple-950 font-medium focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            >
              <option value="">All Schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Multi-select */}
          <div className="gsap-item space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Class / Grade
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {ALL_CLASSES.map((cls) => {
                const checked = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                      checked
                        ? 'purple-badge-flow text-white shadow-xs'
                        : 'bg-neutral-50 text-neutral-800 hover:bg-purple-50 border border-neutral-200/60'
                    }`}
                  >
                    <span>{cls}</span>
                    {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="gsap-item space-y-2 border-t border-purple-100 pt-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-neutral-600">Max Price</span>
              <span className="text-purple-700 font-extrabold">Rs. {priceMax}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* In Stock Only */}
          <div className="gsap-item border-t border-purple-100 pt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800">In stock only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-purple-100 p-6 space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-neutral-900">
                No items match your filters
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Try clearing some filters to explore our full curriculum and uniform selection.
              </p>
              <Button onClick={resetFilters} variant="primary" className="text-xs">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="gsap-section grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((prod) => (
                <div key={prod.id} className="gsap-item">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-t-3xl border-t border-purple-200 max-h-[85vh] overflow-y-auto p-5 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-sm font-bold font-display text-purple-950 uppercase tracking-wider">Filters</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-medium text-purple-950"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* School */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                School
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-medium text-purple-950"
              >
                <option value="">All Schools</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sticky Actions */}
            <div className="pt-3 flex gap-3 sticky bottom-0 bg-white">
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="flex-1 text-xs py-2.5"
              >
                Reset
              </Button>
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                variant="primary"
                className="flex-1 text-xs py-2.5"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
