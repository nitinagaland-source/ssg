import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchSchools } from '../api/schools';
import { School, SchoolBoard } from '../types';
import { useSelectedShop } from '../context/SelectedShopContext';
import { Search, MapPin, GraduationCap, ChevronRight } from 'lucide-react';
import { SchoolCardSkeleton } from '../components/common/LoadingSkeleton';
import { useGsapScrollReveal } from '../hooks/useGsapScrollReveal';

// Bright Full Solid Color 3D Themes with High-Gloss Shine for School Cards
const BRIGHT_SOLID_THEMES = [
  {
    gradient: 'bg-gradient-to-br from-[#9333EA] via-[#7E22CE] to-[#581C87]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(147,51,234,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(147,51,234,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-purple-900/60 border-b-purple-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(37,99,235,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(37,99,235,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-blue-900/60 border-b-blue-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#064E3B]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(5,150,105,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(5,150,105,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-emerald-900/60 border-b-emerald-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(225,29,72,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(225,29,72,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-rose-900/60 border-b-rose-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#78350F]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(217,119,6,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(217,119,6,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-amber-900/60 border-b-amber-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134E4A]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(13,148,136,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(13,148,136,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-teal-900/60 border-b-teal-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(79,70,229,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-indigo-900/60 border-b-indigo-950/80',
  },
  {
    gradient: 'bg-gradient-to-br from-[#DB2777] via-[#BE185D] to-[#831843]',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(219,39,119,0.55),0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_-8px_rgba(219,39,119,0.7),0_8px_16px_rgba(0,0,0,0.35)]',
    border: 'border-t-white/60 border-l-white/40 border-r-pink-900/60 border-b-pink-950/80',
  },
];

export const SchoolsPage: React.FC = () => {
  const { selectedShop } = useSelectedShop();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedBoard, setSelectedBoard] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchSchools(selectedShop?.id);
        setSchools(data);
      } catch (err) {
        console.error('Error fetching schools', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedShop]);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchSearch =
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.board.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity = selectedCity === 'ALL' || school.city.toUpperCase() === selectedCity;
      const matchBoard = selectedBoard === 'ALL' || school.board === selectedBoard;

      return matchSearch && matchCity && matchBoard;
    });
  }, [schools, searchQuery, selectedCity, selectedBoard]);

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapScrollReveal(containerRef, [filteredSchools, loading]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="gsap-section max-w-3xl space-y-3">
        <span className="gsap-item text-xs font-semibold uppercase tracking-widest text-purple-700">
          Verified School Catalogs
        </span>
        <h1 className="gsap-item text-3xl sm:text-5xl font-extrabold font-display purple-title-flow tracking-tight">
          Partner Schools in Guwahati
        </h1>
        <p className="gsap-item text-base sm:text-lg font-serif-accent text-neutral-600">
          Choose your child&apos;s school to browse prescribed book bundles, official crest-embroidered uniforms, and class stationery kits.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="gsap-section bg-white p-6 rounded-3xl border border-[#E5E5E0] shadow-sm space-y-4">
        {/* Search */}
        <div className="gsap-item relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school name (e.g. Don Bosco, DPS Guwahati, Sanskriti, St. Mary's)..."
            className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-full py-3 pl-11 pr-4 text-sm text-[#0A0A0A] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#0A0A0A]"
          />
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-4 top-3.5" />
        </div>

        {/* Filter Chips Row */}
        <div className="gsap-item flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5E5E0] text-xs">
          {/* City Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#6B6B6B] uppercase tracking-wider text-[11px] mr-1">
              Area:
            </span>
            {['ALL', 'GUWAHATI'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedCity === city
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-[#FFFFFF] text-[#0A0A0A] border border-[#E5E5E0] hover:border-[#0A0A0A]'
                }`}
              >
                {city === 'ALL' ? 'All Guwahati' : city.charAt(0) + city.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Board Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#6B6B6B] uppercase tracking-wider text-[11px] mr-1">
              Board:
            </span>
            {['ALL', 'CBSE', 'SEBA', 'ICSE'].map((board) => (
              <button
                key={board}
                onClick={() => setSelectedBoard(board)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedBoard === board
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-[#FFFFFF] text-[#0A0A0A] border border-[#E5E5E0] hover:border-[#0A0A0A]'
                }`}
              >
                {board === 'ALL' ? 'All Boards' : board}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SchoolCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E5E0]">
          <GraduationCap className="w-10 h-10 text-[#6B6B6B] mx-auto mb-3" />
          <h3 className="text-lg font-bold font-display text-[#0A0A0A]">No schools found</h3>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Try adjusting your search query or city/board filters.
          </p>
        </div>
      ) : (
        <div className="gsap-section grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredSchools.map((school, index) => {
            const theme = BRIGHT_SOLID_THEMES[index % BRIGHT_SOLID_THEMES.length];
            return (
              <div key={school.id} className="gsap-item">
                <Link
                  to={`/schools/${school.slug}`}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${theme.gradient} ${theme.border} ${theme.shadow} border-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shiny-solid-3d cursor-pointer shadow-[inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-3px_1px_rgba(0,0,0,0.25)] h-full`}
                >
                  {/* 3D Specular Top Gloss Dome */}
                  <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl" />

                  {/* 3D Sweeping Light Gleam on Hover / Interactivity */}
                  <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/35 to-transparent -rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Specular Corner Flare */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-white/40 bg-white shadow-lg p-1.5 mx-auto sm:mx-0 group-hover:scale-105 transition-transform shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
                      <img
                        src={school.logo}
                        alt={school.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/30 text-white border border-white/40 shadow-inner drop-shadow-sm backdrop-blur-xs">
                        {school.board} Board
                      </span>
                      <h2 className="mt-2.5 text-xs sm:text-base md:text-lg font-black font-display text-white transition-colors leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {school.name}
                      </h2>
                    </div>

                    <p className="text-[10px] sm:text-xs text-white flex items-center gap-1 font-bold drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{school.city}, Assam</span>
                    </p>
                  </div>

                  <div className="relative z-10 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/30 flex items-center justify-between text-[10px] sm:text-xs font-black text-white drop-shadow-sm">
                    <span>{school.classesOffered.length > 0 ? (() => { const c = school.classesOffered; if (c.length === 1) return c[0]; if (c.length <= 3) return c.join(', '); return `${c[0]} – ${c[c.length - 1]}`; })() : 'No classes'}</span>
                    <span className="flex items-center gap-0.5 sm:gap-1 text-white font-black transition-transform group-hover:translate-x-1.5">
                      <span className="hidden sm:inline">View Catalog</span>
                      <span className="sm:hidden">Catalog</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
