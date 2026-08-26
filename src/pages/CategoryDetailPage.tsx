import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCategoryBySlug } from '../api/categories';
import { fetchProducts } from '../api/products';
import { fetchSchools } from '../api/schools';
import { Category, Product, School } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, ArrowLeft, X, Check, RotateCcw } from 'lucide-react';

const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10', 'Class 11', 'Class 12',
];

export const CategoryDetailPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { selectedShop } = useSelectedShop();

  const [category, setCategory] = useState<Category | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [sort, setSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      if (!categorySlug) return;
      try {
        setLoading(true);
        const [catData, schoolsData] = await Promise.all([
          fetchCategoryBySlug(categorySlug),
          fetchSchools(selectedShop?.id),
        ]);
        setCategory(catData);
        setSchools(schoolsData);
      } catch (err) {
        console.error('Error loading category', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, [categorySlug, selectedShop]);

  useEffect(() => {
    async function loadFilteredProducts() {
      if (!category) return;
      try {
        setLoading(true);
        const res = await fetchProducts({
          shopId: selectedShop?.id || 'shop-guwahati-panbazar',
          categoryId: category.id,
          classes: selectedClasses.length > 0 ? selectedClasses : undefined,
          schoolId: selectedSchoolId || undefined,
          inStockOnly,
          priceMax,
          sort,
        });
        setProducts(res.products);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredProducts();
  }, [category, selectedShop, selectedClasses, selectedSchoolId, inStockOnly, priceMax, sort]);

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const resetFilters = () => {
    setSelectedClasses([]);
    setSelectedSchoolId('');
    setInStockOnly(false);
    setPriceMax(2000);
    setSort('featured');
  };

  const activeFilterCount = useMemo(() => {
    let count = selectedClasses.length;
    if (selectedSchoolId) count += 1;
    if (inStockOnly) count += 1;
    if (priceMax < 2000) count += 1;
    return count;
  }, [selectedClasses, selectedSchoolId, inStockOnly, priceMax]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B]">
        <Link to="/categories" className="hover:text-[#0A0A0A] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Categories</span>
        </Link>
        <span>/</span>
        <span className="text-[#0A0A0A]">{category ? category.name : 'Category'}</span>
      </div>

      {/* Category Hero Banner */}
      {category && (
        <div className="relative rounded-3xl overflow-hidden bg-[#0A0A0A] text-white p-8 sm:p-12 border border-[#E5E5E0]">
          <img
            src={category.image}
            alt={category.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5A1F] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              Department
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base font-serif-accent text-white/90">
              {category.description}
            </p>
          </div>
        </div>
      )}

      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-4">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0A0A0A] text-xs font-semibold bg-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          <span className="text-xs font-medium text-[#6B6B6B]">
            Showing <strong>{products.length}</strong> items in stock at {selectedShop?.name || 'SSG Store'}
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-[#6B6B6B] font-medium">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-white border border-[#E5E5E0] rounded-full px-3.5 py-1.5 font-medium text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-[#E5E5E0] sticky top-28">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
            <h3 className="text-sm font-bold font-display text-[#0A0A0A] uppercase tracking-wider">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#FF5A1F] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* School Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              Partner School
            </label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-xl px-3 py-2 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
            >
              <option value="">All Schools & General</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Class Multi-select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              Class / Grade
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {ALL_CLASSES.map((cls) => {
                const checked = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between ${
                      checked
                        ? 'bg-[#0A0A0A] text-white'
                        : 'bg-[#FFFFFF] text-[#0A0A0A] hover:bg-black/5'
                    }`}
                  >
                    <span>{cls}</span>
                    {checked && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 border-t border-[#E5E5E0] pt-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#6B6B6B]">Max Price</span>
              <span className="text-[#FF5A1F] font-bold">Rs. {priceMax}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#FF5A1F]"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="border-t border-[#E5E5E0] pt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#0A0A0A]">In stock only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A1F] rounded"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E0] p-6 space-y-4">
              <span className="text-3xl font-serif-accent">*</span>
              <h3 className="text-xl font-bold font-display text-[#0A0A0A]">
                No items match your criteria
              </h3>
              <p className="text-sm text-[#6B6B6B] max-w-md mx-auto">
                Try loosening your filters or price slider to see more school items from this category.
              </p>
              <Button onClick={resetFilters} variant="primary" className="text-xs">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:hidden">
          <div className="bg-[#FFFFFF] rounded-t-3xl border-t border-[#E5E5E0] max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="text-base font-bold font-display">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* School Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                School
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] rounded-xl px-3 py-2.5 text-sm"
              >
                <option value="">All Schools</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                Class / Grade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_CLASSES.map((cls) => {
                  const checked = selectedClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      onClick={() => toggleClass(cls)}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        checked ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E5E5E0]'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Max */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Max Price:</span>
                <span className="text-[#FF5A1F]">Rs. {priceMax}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#FF5A1F]"
              />
            </div>

            {/* Sticky Apply Button */}
            <div className="pt-4 flex gap-3 sticky bottom-0 bg-[#FFFFFF]">
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="flex-1 text-xs py-3"
              >
                Reset
              </Button>
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                variant="primary"
                className="flex-1 text-xs py-3"
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
