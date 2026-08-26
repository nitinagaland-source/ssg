import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'Shop All',
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold purple-title-flow font-display tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-600 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-purple-200 text-purple-900 bg-purple-50/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all w-fit group shadow-xs"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
};
