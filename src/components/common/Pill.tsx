import React from 'react';

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'dark' | 'light' | 'orange' | 'purple' | 'green' | 'muted';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({
  variant = 'light',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm';

  let variantStyles = 'bg-white text-[#0A0A0A] border border-[#E5E5E0]';
  if (variant === 'dark') {
    variantStyles = 'bg-[#0A0A0A] text-white';
  } else if (variant === 'orange') {
    variantStyles = 'bg-[#FF5A1F] text-white';
  } else if (variant === 'purple') {
    variantStyles = 'bg-[#7C3AED] text-white';
  } else if (variant === 'green') {
    variantStyles = 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20';
  } else if (variant === 'muted') {
    variantStyles = 'bg-neutral-100 text-[#6B6B6B] border border-[#E5E5E0]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
