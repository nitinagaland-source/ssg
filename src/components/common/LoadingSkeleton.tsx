import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between animate-pulse">
      <div className="w-full aspect-[4/5] rounded-xl sm:rounded-2xl bg-neutral-200" />
      <div className="mt-2.5 sm:mt-3 space-y-2">
        <div className="w-4/5 h-4 bg-neutral-200 rounded" />
        <div className="w-1/3 h-4 bg-neutral-200 rounded" />
      </div>
      <div className="mt-2.5 sm:mt-3 w-full h-9 sm:h-10 bg-neutral-200 rounded-lg sm:rounded-xl" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const SchoolCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl border border-[#E5E5E0] bg-white animate-pulse flex flex-col items-center gap-3">
      <div className="w-16 h-16 rounded-full bg-[#E5E5E0]" />
      <div className="h-4 bg-[#E5E5E0] rounded w-3/4" />
      <div className="h-3 bg-[#E5E5E0] rounded w-1/2" />
    </div>
  );
};
