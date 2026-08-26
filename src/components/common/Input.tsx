import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-transparent border-b border-[#0A0A0A] py-2.5 text-sm sm:text-base text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-b-2 focus:border-[#FF5A1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-[#DC2626] focus:border-[#DC2626]' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[#DC2626] font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-[#6B6B6B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
