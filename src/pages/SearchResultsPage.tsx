import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { Product } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { Search } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedShop } = useSelectedShop();

  useEffect(() => {
    setQuery(initialQuery);
    async function doSearch() {
      if (!initialQuery.trim()) {
        setProducts([]);
        return;
      }
      try {
        setLoading(true);
        const res = await fetchProducts({
          shopId: selectedShop?.id || 'shop-guwahati-panbazar',
          search: initialQuery.trim(),
        });
        setProducts(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [initialQuery, selectedShop]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const quickSearches = ['Holy Cross', 'Science Kit', 'Classmate Register', 'Uniform White Shirt', 'Mathematics Class 10', 'Oxford Geometry'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Search Header Input */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#0A0A0A]">
          Search School Supplies
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search textbooks, uniform sizes, school names, publishers..."
            className="w-full bg-white border border-[#0A0A0A] rounded-full py-4 pl-12 pr-28 text-sm sm:text-base text-[#0A0A0A] placeholder:text-[#8E8E93] focus:outline-none shadow-sm"
          />
          <Search className="w-5 h-5 text-[#8E8E93] absolute left-4 top-4 sm:top-4.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 rounded-full bg-[#FF5A1F] text-white text-xs sm:text-sm font-semibold hover:bg-[#E04E18] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick searches chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-[#6B6B6B] font-medium">
            Popular:
          </span>
          {quickSearches.map((qs) => (
            <button
              key={qs}
              onClick={() => {
                setQuery(qs);
                setSearchParams({ q: qs });
              }}
              className="bg-white border border-[#E5E5E0] hover:border-[#0A0A0A] px-3 py-1 rounded-full text-[#0A0A0A] transition-colors"
            >
              {qs}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 space-y-6">
        {initialQuery && (
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4 text-xs font-semibold text-[#6B6B6B]">
            <span>
              Results for &ldquo;<strong className="text-[#0A0A0A]">{initialQuery}</strong>&rdquo;
            </span>
            <span>{products.length} {products.length === 1 ? 'result' : 'results'} found</span>
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 && initialQuery ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E5E0] space-y-3">
            <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
              No exact matches for &ldquo;{initialQuery}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
              Check for typos or try searching by school name, subject, or class grade.
            </p>
            <div className="pt-2">
              <Link to="/products" className="text-xs font-semibold text-[#FF5A1F] underline">
                Browse full product catalog →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
