/**
 * /frontend/src/components/ui/Input.tsx
 * Input field component
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500';
    const variantStyles = {
      default:
        'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
      filled:
        'border-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-150 dark:hover:bg-slate-600',
      outlined: 'border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:border-slate-400 dark:hover:border-slate-500',
    };

    const errorStyles = error ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            className={`w-full ${baseStyles} ${variantStyles[variant]} ${errorStyles} ${
              icon ? 'pl-10' : ''
            } ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {hint && !error && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;