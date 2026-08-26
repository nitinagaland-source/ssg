import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSchoolBySlug } from '../api/schools';
import { fetchProducts } from '../api/products';
import { School, Product } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { ProductCard } from '../components/common/ProductCard';
import { Button } from '../components/common/Button';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { MapPin, MessageSquare, BookOpen, Shirt, FileText, Trophy, ArrowLeft } from 'lucide-react';

export const SchoolDetailPage: React.FC = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const { selectedShop } = useSelectedShop();
  const { getSchoolWhatsAppUrl } = useWhatsApp();

  const [school, setSchool] = useState<School | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!schoolSlug) return;
      try {
        setLoading(true);
        const schoolData = await fetchSchoolBySlug(schoolSlug);
        setSchool(schoolData);

        const prodsRes = await fetchProducts({
          shopId: selectedShop?.id || 'shop-guwahati-panbazar',
          schoolId: schoolData.id,
          classes: selectedClass !== 'ALL' ? [selectedClass] : undefined,
          categoryId: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        });
        setProducts(prodsRes.products);
      } catch (err) {
        console.error('Error loading school details', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [schoolSlug, selectedShop, selectedClass, selectedCategory]);

  if (!school && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-display">School not found</h2>
        <Link to="/schools" className="text-[#FF5A1F] text-sm mt-4 inline-block underline">
          ← Back to all schools
        </Link>
      </div>
    );
  }

  const categoryCards = [
    { id: 'cat-textbooks', name: 'Textbooks', icon: BookOpen, tag: 'Official Syllabus' },
    { id: 'cat-uniforms', name: 'Uniforms', icon: Shirt, tag: 'Crest Stitched' },
    { id: 'cat-notebooks', name: 'Registers', icon: FileText, tag: 'Classmate Copies' },
    { id: 'cat-sports', name: 'PT & House Kit', icon: Trophy, tag: 'House T-shirts' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb back */}
      <Link
        to="/schools"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Partner Schools</span>
      </Link>

      {/* School Header Banner */}
      {school && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E5E0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#E5E5E0] bg-[#FFFFFF] p-2 shrink-0">
              <img
                src={school.logo}
                alt={school.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0A0A0A] text-white px-3 py-0.5 rounded-full">
                  {school.board} Board
                </span>
                <span className="text-xs text-[#6B6B6B] bg-[#FFFFFF] border border-[#E5E5E0] px-2.5 py-0.5 rounded-full">
                  {school.city}, Nagaland
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#0A0A0A] tracking-tight">
                {school.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6B6B] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span>{school.address || `${school.city}, Nagaland`}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <a
              href={getSchoolWhatsAppUrl(school.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#1ebd5d] shadow-sm transition-all select-none"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp School Desk</span>
            </a>
          </div>
        </div>
      )}

      {/* Category Visual Tiles */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
          School Catalog Modules
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(isSelected ? 'ALL' : c.id)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-md'
                    : 'bg-white text-[#0A0A0A] border-[#E5E5E0] hover:border-[#0A0A0A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#FFFFFF] text-[#FF5A1F]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#FFFFFF] text-[#6B6B6B]'
                    }`}
                  >
                    {c.tag}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold font-display">{c.name}</h4>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#6B6B6B]'}`}>
                    {isSelected ? 'Filtering active' : 'Click to filter'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Class Selector Strip */}
      {school && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Filter by Grade / Class
            </h3>
            {selectedClass !== 'ALL' && (
              <button
                onClick={() => setSelectedClass('ALL')}
                className="text-xs text-[#FF5A1F] font-semibold underline underline-offset-2"
              >
                Clear class filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedClass('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClass === 'ALL'
                  ? 'bg-[#FF5A1F] text-white'
                  : 'bg-white text-[#0A0A0A] border border-[#E5E5E0] hover:border-[#0A0A0A]'
              }`}
            >
              All Grades
            </button>
            {school.classesOffered.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedClass === cls
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-white text-[#0A0A0A] border border-[#E5E5E0] hover:border-[#0A0A0A]'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-6 pt-4">
        <div className="flex items-baseline justify-between border-b border-[#E5E5E0] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0A0A0A]">
            {selectedClass === 'ALL' ? 'All Required Items' : `Prescribed Items for ${selectedClass}`}
          </h2>
          <span className="text-xs text-[#6B6B6B] font-medium">
            {products.length} {products.length === 1 ? 'item' : 'items'} in stock
          </span>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E5E0] p-6 space-y-3">
            <BookOpen className="w-10 h-10 text-[#6B6B6B] mx-auto" />
            <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
              No items matching this class filter
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
              Our branch is updating booklist files for this class. You can WhatsApp us your book slip directly.
            </p>
            <Button
              onClick={() => setSelectedClass('ALL')}
              variant="ghost"
              className="text-xs mt-2"
            >
              Show all school items
            </Button>
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
