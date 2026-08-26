import React from 'react';
import { ArrowRight } from 'lucide-react';

export type ButtonVariant = 'primary' | 'ghost' | 'whatsapp' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  showArrow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  showArrow = false,
  fullWidth = false,
  children,
  className = '',
  asAnchor = false,
  href,
  target,
  rel,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 rounded-full select-none cursor-pointer whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none px-6 py-3';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles =
        'purple-button-flow shadow-md shadow-purple-600/30 focus-visible:ring-2 focus-visible:ring-purple-400';
      break;
    case 'ghost':
      variantStyles =
        'border border-purple-300 text-purple-900 bg-purple-50/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-transparent';
      break;
    case 'whatsapp':
      variantStyles =
        'bg-[#25D366] text-white hover:bg-[#1ebd5d] shadow-sm';
      break;
    case 'danger':
      variantStyles =
        'bg-[#DC2626] text-white hover:bg-red-700';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClass = `${baseStyles} ${variantStyles} ${widthStyle} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  if (asAnchor && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`group ${combinedClass}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`group ${combinedClass}`}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};
