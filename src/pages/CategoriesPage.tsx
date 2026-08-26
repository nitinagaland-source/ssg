import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { Category } from '../types';
import { ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-700">
          Department Directory
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display purple-title-flow tracking-tight">
          All Student Categories
        </h1>
        <p className="text-base sm:text-lg font-serif-accent text-neutral-600">
          Explore complete school supply departments — from syllabus textbooks and tailored uniforms to laboratory anatomy kits.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl sm:rounded-3xl bg-purple-100/60 animate-pulse" />
            ))
          : categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-900 p-3 sm:p-8 flex flex-col justify-end text-white border border-purple-100"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="relative z-10 space-y-1">
                  <h3 className="text-xs sm:text-lg md:text-2xl font-bold font-display tracking-tight text-white group-hover:text-purple-300 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/80 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                    {cat.description}
                  </p>
                  <div className="pt-0.5 sm:pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-purple-300">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};
