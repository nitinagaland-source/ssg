import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
}

// Sophisticated, editorial-grade category styling with sleek micro-accents
const categoryStyles: Record<
  string,
  {
    pillBg: string;
    pillBorder: string;
    pillHover: string;
    dotColor: string;
    textColor: string;
    imgBorder: string;
  }
> = {
  textbooks: {
    pillBg: 'bg-white hover:bg-orange-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-orange-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(255,90,31,0.2)]',
    dotColor: 'bg-[#FF5A1F]',
    textColor: 'text-neutral-900 group-hover:text-orange-950',
    imgBorder: 'border-orange-100 group-hover:border-orange-300',
  },
  notebooks: {
    pillBg: 'bg-white hover:bg-blue-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-blue-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.2)]',
    dotColor: 'bg-blue-600',
    textColor: 'text-neutral-900 group-hover:text-blue-950',
    imgBorder: 'border-blue-100 group-hover:border-blue-300',
  },
  uniforms: {
    pillBg: 'bg-white hover:bg-emerald-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-emerald-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]',
    dotColor: 'bg-emerald-600',
    textColor: 'text-neutral-900 group-hover:text-emerald-950',
    imgBorder: 'border-emerald-100 group-hover:border-emerald-300',
  },
  bags: {
    pillBg: 'bg-white hover:bg-purple-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-purple-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(147,51,234,0.2)]',
    dotColor: 'bg-purple-600',
    textColor: 'text-neutral-900 group-hover:text-purple-950',
    imgBorder: 'border-purple-100 group-hover:border-purple-300',
  },
  stationery: {
    pillBg: 'bg-white hover:bg-rose-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-rose-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(244,63,94,0.2)]',
    dotColor: 'bg-rose-600',
    textColor: 'text-neutral-900 group-hover:text-rose-950',
    imgBorder: 'border-rose-100 group-hover:border-rose-300',
  },
  'art-craft': {
    pillBg: 'bg-white hover:bg-amber-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-amber-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.2)]',
    dotColor: 'bg-amber-600',
    textColor: 'text-neutral-900 group-hover:text-amber-950',
    imgBorder: 'border-amber-100 group-hover:border-amber-300',
  },
  'sports-kits': {
    pillBg: 'bg-white hover:bg-sky-50/50',
    pillBorder: 'border-neutral-200/90 hover:border-sky-300',
    pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(14,165,233,0.2)]',
    dotColor: 'bg-sky-600',
    textColor: 'text-neutral-900 group-hover:text-sky-950',
    imgBorder: 'border-sky-100 group-hover:border-sky-300',
  },
};

const defaultStyle = {
  pillBg: 'bg-white hover:bg-neutral-50',
  pillBorder: 'border-neutral-200/90 hover:border-neutral-400',
  pillHover: 'hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.12)]',
  dotColor: 'bg-[#FF5A1F]',
  textColor: 'text-neutral-900 group-hover:text-neutral-950',
  imgBorder: 'border-neutral-200 group-hover:border-neutral-400',
};

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive = false }) => {
  const style = categoryStyles[category.slug] || defaultStyle;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`group relative inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-200 text-xs sm:text-sm font-semibold whitespace-nowrap select-none shrink-0 cursor-pointer shadow-xs ${
        isActive
          ? 'bg-neutral-900 text-white border-neutral-900 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)] scale-[1.02]'
          : `${style.pillBg} ${style.pillBorder} ${style.pillHover} hover:-translate-y-0.5 active:translate-y-0 active:scale-98`
      }`}
    >
      {/* High-Resolution Circular Product Icon */}
      <div
        className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 border bg-neutral-100 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${
          isActive ? 'border-neutral-700' : style.imgBorder
        }`}
      >
        <img
          src={category.image}
          alt={category.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category Name */}
      <span className={`tracking-tight ${isActive ? 'text-white' : style.textColor}`}>
        {category.name}
      </span>

      {/* Sleek Minimal Accent Pip */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover:scale-125 shrink-0 ${
          isActive ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]' : style.dotColor
        }`}
      />
    </Link>
  );
};
