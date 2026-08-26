import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelectedShop } from '../context/SelectedShopContext';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import { fetchSchools } from '../api/schools';
import { Product, Category, School } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/common/Button';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { TextbooksAndCopies3DSection } from '../components/home/TextbooksAndCopies3DSection';
import { FeaturedProductsCarousel } from '../components/home/FeaturedProductsCarousel';
import { ActionSearchBar, Action } from '../components/ui/action-search-bar';
import {
  MapPin,
  BookOpen,
  Play,
  ArrowRight,
  Copy,
  Check,
  Truck,
  ExternalLink,
  Search,
  GraduationCap,
  ShieldCheck,
  Zap,
  Clock,
  Shirt,
  Sparkles,
  Compass,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { useToast } from '../context/ToastContext';
import { useGsapScrollReveal } from '../hooks/useGsapScrollReveal';

// Bright Full Solid Color 3D Themes with High-Gloss Shine for School Cards
const BRIGHT_SOLID_THEMES = [
  {
    gradient: 'bg-gradient-to-br from-[#9333EA] via-[#7E22CE] to-[#581C87]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(147,51,234,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(147,51,234,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-purple-900/60 border-b-purple-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(37,99,235,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(37,99,235,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-blue-900/60 border-b-blue-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#064E3B]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(5,150,105,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(5,150,105,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-emerald-900/60 border-b-emerald-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(225,29,72,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(225,29,72,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-rose-900/60 border-b-rose-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#78350F]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(217,119,6,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(217,119,6,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-amber-900/60 border-b-amber-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134E4A]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(13,148,136,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(13,148,136,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-teal-900/60 border-b-teal-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(79,70,229,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-indigo-900/60 border-b-indigo-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
  {
    gradient: 'bg-gradient-to-br from-[#DB2777] via-[#BE185D] to-[#831843]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(219,39,119,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(219,39,119,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-pink-900/60 border-b-pink-950/80',
    iconBg: 'bg-white/20 border-white/40 text-white',
  },
];

export const HomePage: React.FC = () => {
  const { selectedShop } = useSelectedShop();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const schoolSearchActions: Action[] = [
    {
      id: 'act-1',
      label: 'DPS Guwahati Booksets',
      icon: <BookOpen className="h-4 w-4 text-[#FF5A1F]" />,
      description: 'Official 2026 Session Bundles (Class 1-12)',
      short: '⌘DPS',
      end: 'Curriculum',
      onClick: () => navigate('/schools?q=DPS%20Guwahati'),
    },
    {
      id: 'act-2',
      label: 'Don Bosco High School',
      icon: <GraduationCap className="h-4 w-4 text-blue-500" />,
      description: 'Prescribed Textbooks & School Copies',
      short: '⌘DB',
      end: 'School',
      onClick: () => navigate('/schools?q=Don%20Bosco'),
    },
    {
      id: 'act-3',
      label: 'NCERT & SEBA Textbooks',
      icon: <BookOpen className="h-4 w-4 text-emerald-500" />,
      description: 'Maths, Science, Social Studies, English',
      short: '⌘NCERT',
      end: 'Books',
      onClick: () => navigate('/categories/textbooks'),
    },
    {
      id: 'act-4',
      label: 'School Uniforms & Sports Wear',
      icon: <Shirt className="h-4 w-4 text-purple-500" />,
      description: 'Teacher-approved fabrics, stitch-guaranteed sizing',
      short: '⌘UNI',
      end: 'Uniforms',
      onClick: () => navigate('/categories/uniforms'),
    },
    {
      id: 'act-5',
      label: "Maria's Public School Kits",
      icon: <GraduationCap className="h-4 w-4 text-rose-500" />,
      description: 'Grade 1 to 10 Curriculum Sets',
      short: '⌘MPS',
      end: 'School',
      onClick: () => navigate('/schools?q=Maria'),
    },
    {
      id: 'act-6',
      label: 'Locate SSG Stores & WhatsApp Order',
      icon: <MapPin className="h-4 w-4 text-sky-500" />,
      description: 'Panbazar & Zoo Road SSG Book Galleries',
      short: '⌘LOC',
      end: 'Store',
      onClick: () => navigate('/contact'),
    },
  ];

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [prodsRes, catsRes, schoolsRes] = await Promise.all([
          fetchProducts({ shopId: selectedShop?.id || 'shop-guwahati-panbazar', limit: 30 }),
          fetchCategories(selectedShop?.id),
          fetchSchools(selectedShop?.id),
        ]);

        const allProds = prodsRes.products;
        setAllProducts(allProds);

        // Filter 8 featured products for New Arrivals
        const featured = allProds.filter((p) => p.isFeatured).slice(0, 8);
        setNewArrivals(featured.length > 0 ? featured : allProds.slice(0, 8));

        // Filter 4 best sellers
        const best = allProds.filter((p) => p.isBestSeller).slice(0, 4);
        setBestSellers(best.length > 0 ? best : allProds.slice(8, 12));

        setCategories(catsRes);
        setSchools(schoolsRes);
      } catch (err) {
        console.error('Error loading home data', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, [selectedShop]);

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const activeShopName = selectedShop?.name || 'SSG Guwahati Panbazar Main';
  const activeCity = selectedShop?.city || 'Guwahati';
  const homeContainerRef = useRef<HTMLDivElement>(null);

  useGsapScrollReveal(homeContainerRef, [newArrivals, bestSellers, schools]);

  return (
    <div ref={homeContainerRef} className="space-y-8 sm:space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* SECTION 1 — HERO: High-Clarity Editorial Hero with Clear Background Image  */}
      {/* ========================================================================= */}
      <section className="gsap-section relative text-white overflow-hidden bg-neutral-950 border-b border-neutral-800">
        {/* Background Image Layer (No heavy purple overlay, high clarity & visible across mobile/desktop) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://i.ibb.co/Jj91CM1F/f08b42ac-ae96-4c2e-9025-f7a3396098b8.webp"
            alt="Saraswati Student Gallery School Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top sm:object-[right_top] md:object-top filter brightness-[0.90] contrast-[1.04]"
          />
          {/* Subtle directional dark gradients on left for text legibility without turning purple */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent sm:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 sm:hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10 w-full flex flex-col justify-center min-h-[330px] sm:min-h-[420px] lg:min-h-[460px]">
          <div className="max-w-xl sm:max-w-2xl text-left space-y-3 sm:space-y-5">
            
            {/* Minimal Elegant Eyebrow */}
            <div className="gsap-item inline-flex items-center">
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
                Official School Partner • Guwahati
              </span>
            </div>

            {/* Editorial Elegant Headline */}
            <h1 className="gsap-item text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight drop-shadow-sm">
              Everything For School,<br />
              <span className="text-amber-400 sm:text-purple-300 font-bold">
                Simplified.
              </span>
            </h1>

            {/* Clean Refined Subtitle */}
            <p className="gsap-item text-[11px] sm:text-xs md:text-sm text-neutral-200/90 font-normal leading-relaxed max-w-xs sm:max-w-md font-body">
              Exact teacher-prescribed booklists, uniforms, and stationery for Guwahati schools. Delivered to your door.
            </p>

            {/* Clean Refined Action Buttons */}
            <div className="gsap-item flex flex-wrap items-center gap-2.5 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => navigate('/schools')}
                className="purple-button-flow text-white text-[11px] sm:text-xs font-bold px-4.5 py-2.5 sm:px-5 sm:py-2.5 rounded-full shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Browse School Booklists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md text-white text-[11px] sm:text-xs px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full font-medium transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 fill-current text-white" />
                <span>How SSG Works</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1.5 — ACTION SEARCH BAR (Command & School Discovery)              */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-2xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 mb-6 sm:mb-8 relative z-30">
        <div className="gsap-item bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] p-2.5 sm:p-3 transition-all space-y-2">
          <ActionSearchBar
            actions={schoolSearchActions}
            placeholder="Search school books, uniforms, class (e.g. DPS Class 6, NCERT Maths)..."
            onSearch={(q) => {
              // Interactive search callback
            }}
          />

          {/* Quick Trending School Tags */}
          <div className="pt-1.5 flex items-center justify-between flex-wrap gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900/70 shrink-0">
                <span>Trending:</span>
              </div>
              {[
                { name: 'DPS Guwahati', query: 'DPS Guwahati' },
                { name: 'Don Bosco', query: 'Don Bosco' },
                { name: "Maria's Public", query: "Maria's Public" },
                { name: "St. Mary's", query: "St. Mary's" },
                { name: 'NCERT Sets', query: 'NCERT' },
              ].map((sc) => (
                <button
                  key={sc.name}
                  type="button"
                  onClick={() => navigate(`/schools?q=${encodeURIComponent(sc.query)}`)}
                  className="shrink-0 bg-purple-50/60 hover:bg-purple-100/80 hover:border-purple-300 text-purple-950 border border-purple-200/60 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
                >
                  {sc.name}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
              <kbd className="px-1.5 py-0.2 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 text-[10px]">Enter</kbd>
              <span>to search</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — 3D FEATURED PRODUCTS 3D COVERFLOW CAROUSEL                    */}
      {/* ========================================================================= */}
      <div className="gsap-section">
        <FeaturedProductsCarousel />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3 — EDITORIAL STATEMENT: Vivid 3D Bright Red Glossy Statement Box */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12 sm:mt-12 sm:mb-16 lg:mt-16 lg:mb-20">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FF1A35] via-[#E60026] to-[#B3001B] p-6 sm:p-10 md:p-14 overflow-hidden border-2 border-red-200/60 shadow-[0_25px_60px_-12px_rgba(230,0,38,0.55),0_10px_25px_-5px_rgba(179,0,27,0.4),inset_0_3px_2px_rgba(255,255,255,0.7),inset_0_-4px_3px_rgba(0,0,0,0.35)] text-center shiny-solid-3d cursor-default">
          {/* 3D Specular Top Gloss Convex Highlight */}
          <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl" />

          {/* Sweeping Metallic Light Gleam */}
          <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/35 to-transparent -rotate-45 translate-x-[-150%] animate-gleam-sweep pointer-events-none" />

          {/* 3D Corner Specular Light Flares */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-200/25 rounded-full blur-2xl pointer-events-none" />

          {/* Quotation Mark Icon / Accent */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="gsap-item text-white/90 font-serif text-5xl sm:text-6xl leading-none select-none mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">“</span>
            <p className="gsap-item text-lg sm:text-2xl md:text-3xl font-serif-accent text-white leading-relaxed sm:leading-snug font-normal drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)] tracking-wide">
              Browse our carefully curated collection of school essentials — sourced locally, verified by teachers, delivered from your neighborhood SSG shop.
            </p>
            <div className="gsap-item mt-5 sm:mt-7 flex items-center gap-3">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-white/70 to-white" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Saraswati Student Gallery • Est. Guwahati
              </span>
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-white/70 to-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3.5 — 3D FLAGSHIP: TEXTBOOKS, NOTEBOOKS & COPIES SHOWCASE         */}
      {/* ========================================================================= */}
      <div className="gsap-section">
        <TextbooksAndCopies3DSection products={allProducts} activeShopName={activeShopName} />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4 — 2026 NEW ARRIVALS: Product Grid (8 items)                     */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gsap-item">
          <SectionHeader
            title="2026 New Arrivals"
            subtitle="Fresh stock for the upcoming academic session"
            viewAllLink="/products"
            viewAllText="Shop All (12)"
          />
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="gsap-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — SPLIT EDITORIAL BLOCK (Full top bleed image)                   */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/50 rounded-3xl border border-purple-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Top on mobile / Left on desktop: Full-cover Image */}
          <div className="gsap-item lg:col-span-6 w-full h-64 sm:h-80 lg:h-full min-h-[260px] lg:min-h-[380px] overflow-hidden relative bg-purple-100">
            <img
              src="https://i.ibb.co/N6Dj354Y/b74f206a-fbd4-4cd8-9d30-096dcc608ca4.webp"
              alt="Official school booklists and student learning essentials"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom on mobile / Right on desktop: Content */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
            <h3 className="gsap-item text-2xl sm:text-3xl lg:text-4xl font-display font-bold purple-title-flow leading-tight">
              Official school booklists, matched to the exact edition.
            </h3>

            <p className="gsap-item text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
              Every academic year, syllabus changes create confusion. We work directly with schools across Guwahati to stock the exact ISBNs and board-mandated notebooks before classes begin.
            </p>

            <div className="gsap-item pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/schools')}
                showArrow
              >
                Find Your School Booklist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — SCHOOL PARTNERS GRID (8 school cards with board pills)         */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gsap-item">
          <SectionHeader
            title="Partner Schools in Guwahati"
            subtitle="Select your school to load verified class-wise booklists"
            viewAllLink="/schools"
            viewAllText="All Schools"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
          {schools.slice(0, 8).map((school, index) => {
            const theme = BRIGHT_SOLID_THEMES[index % BRIGHT_SOLID_THEMES.length];
            return (
              <div key={school.id} className="gsap-item">
                <Link
                  to={`/schools/${school.slug || school.id}`}
                  className={`p-4 sm:p-5 rounded-2xl ${theme.gradient} ${theme.border} ${theme.shadow} border-2 group flex flex-col justify-between relative overflow-hidden shiny-solid-3d cursor-pointer shadow-[inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-3px_1px_rgba(0,0,0,0.25)] h-full`}
                >
                  {/* 3D Specular Top Gloss Dome */}
                  <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-2xl" />

                  {/* 3D Sweeping Light Gleam on Hover / Interactivity */}
                  <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/35 to-transparent -rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Specular Corner Flare */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-black/30 text-white border border-white/40 shadow-inner drop-shadow-sm backdrop-blur-xs">
                        {school.board}
                      </span>
                      <span className="text-[10px] sm:text-xs text-white flex items-center gap-1 font-bold drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-white shrink-0" /> 
                        <span className="truncate max-w-[65px] sm:max-w-none">{school.city}</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 mb-1.5">
                      <div className={`p-2 rounded-xl shrink-0 ${theme.iconBg} border hidden sm:flex items-center justify-center group-hover:scale-110 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] transition-transform`}>
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-display font-black text-sm sm:text-base text-white transition-colors leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {school.name}
                      </h4>
                    </div>
                  </div>

                  <div className="relative z-10 mt-3.5 pt-3 border-t border-white/30 flex items-center justify-between text-[11px] sm:text-xs text-white font-extrabold drop-shadow-sm">
                    <span>{school.classesOffered?.length || 0} Classes</span>
                    <span className="text-white font-black flex items-center gap-1 group-hover:translate-x-1.5 transition-all">
                      <span className="hidden sm:inline">View Booklist</span>
                      <span className="sm:hidden">View</span>
                      <span className="text-sm leading-none">→</span>
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — BESTSELLERS (4 items)                                          */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gsap-item">
          <SectionHeader
            title="Parent Favorites & Bestsellers"
            subtitle="Top rated stationery, lab kits, and student essentials"
            viewAllLink="/products"
            viewAllText="View All"
          />
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="gsap-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — PROMO BANNER (Luxury Velvet & Dark Obsidian Theme)            */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-10">
        <div className="relative rounded-3xl p-7 sm:p-12 lg:p-14 bg-gradient-to-br from-[#0B0616] via-[#140A28] to-[#07020E] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border border-purple-500/25">
          {/* Subtle Ambient Radial Lighting Flares */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,60,250,0.12),rgba(255,255,255,0))] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="gsap-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-white/[0.04] border border-purple-400/30 text-purple-200 backdrop-blur-md shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>New Session • Fresh Start</span>
              </div>

              <h3 className="gsap-item text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-[1.15] text-white tracking-tight">
                Order full year school kit &amp; get <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">10% off.</span>
              </h3>

              <p className="gsap-item text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-body max-w-xl">
                Get your child&apos;s complete set of prescribed textbooks, notebooks, school uniform, and lab kit in one order. Delivered to your doorstep with guaranteed edition match.
              </p>

              {/* Promo code copy badge & voucher card */}
              <div className="gsap-item pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="inline-flex items-center justify-between sm:justify-start gap-3 p-1.5 pr-2.5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md shadow-inner">
                  <div className="bg-purple-950/80 text-purple-100 font-mono font-bold text-sm sm:text-base px-3.5 py-2 rounded-xl tracking-widest border border-purple-700/40">
                    SESSION2026
                  </div>
                  <button
                    type="button"
                    onClick={() => copyPromoCode('SESSION2026')}
                    className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-purple-950/50 cursor-pointer active:scale-95"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-200" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-neutral-400 font-body">
                  Valid on complete session bundles
                </span>
              </div>
            </div>

            {/* Right Column: 3 perks & Action */}
            <div className="gsap-item lg:col-span-5 bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-5 border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h4 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                  Why parents trust SSG:
                </h4>
                <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                  Guwahati
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Exact syllabus match for CBSE, ICSE, and SEBA boards</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Exchange available within 7 days if class syllabus changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Cash on delivery &amp; UPI available across Assam</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/products')}
                  className="w-full bg-white text-neutral-950 hover:bg-neutral-100 font-bold py-3 text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                  showArrow
                >
                  Start Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9 — THREE PILLARS (Trust Grid - Compact & Responsive)              */}
      {/* ========================================================================= */}
      <section className="gsap-section max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {/* Pillar 1: Genuine Books */}
          <div className="gsap-item relative group overflow-hidden p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-white/95 border border-purple-200/80 shadow-[0_4px_16px_-2px_rgba(147,51,234,0.08)] hover:shadow-[0_8px_20px_-2px_rgba(147,51,234,0.18)] hover:border-purple-400 transition-all flex sm:flex-col items-start gap-3 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shadow-purple-500/30 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h4 className="font-display font-extrabold text-xs sm:text-sm bg-gradient-to-r from-purple-950 to-indigo-900 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 transition-all">
                100% Genuine Books
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 leading-snug font-body">
                NCERT, Cambridge &amp; Oxford authorized direct publisher stock.
              </p>
            </div>
          </div>

          {/* Pillar 2: Local Pickup */}
          <div className="gsap-item relative group overflow-hidden p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-white/95 border border-blue-200/80 shadow-[0_4px_16px_-2px_rgba(59,130,246,0.08)] hover:shadow-[0_8px_20px_-2px_rgba(59,130,246,0.18)] hover:border-blue-400 transition-all flex sm:flex-col items-start gap-3 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/30 shrink-0">
              <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h4 className="font-display font-extrabold text-xs sm:text-sm bg-gradient-to-r from-blue-950 to-sky-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                Same-Day Local Pickup
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 leading-snug font-body">
                Fast packup at Panbazar, Silpukhuri &amp; Beltola SSG hubs.
              </p>
            </div>
          </div>

          {/* Pillar 3: WhatsApp Support */}
          <div className="gsap-item relative group overflow-hidden p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white/95 border border-emerald-200/80 shadow-[0_4px_16px_-2px_rgba(16,185,129,0.08)] hover:shadow-[0_8px_20px_-2px_rgba(16,185,129,0.18)] hover:border-emerald-400 transition-all flex sm:flex-col items-start gap-3 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shadow-emerald-500/30 shrink-0">
              <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h4 className="font-display font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-950 to-teal-900 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-all">
                WhatsApp Assistance
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 leading-snug font-body">
                Send your class booklist photo for instant quote &amp; kit preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIDEO MODAL (SSG Tour / How it works)                                      */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/20 rounded-3xl max-w-3xl w-full p-6 text-white space-y-4 relative">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-sm bg-white/10 px-3 py-1.5 rounded-full"
            >
              ✕ Close
            </button>

            <h3 className="font-display font-bold text-xl">How SSG Works</h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="SSG Overview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-white/60">
              From school list verification to counter packup at Panbazar, Silpukhuri, and Beltola hubs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

