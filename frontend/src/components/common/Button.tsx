/**
 * /frontend/src/components/common/Button.tsx
 *
 * Reusable button component with multiple variants.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success'
  | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 font-semibold',
      secondary: isDark
        ? 'bg-slate-800 text-white hover:bg-slate-700'
        : 'bg-slate-200 text-slate-900 hover:bg-slate-300',
      outline:
        'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold',
      danger:
        'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30',
      success:
        'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30',
      ghost: isDark
        ? 'text-slate-300 hover:bg-slate-800/50'
        : 'text-slate-700 hover:bg-slate-100',
    };

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : undefined}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        {...(props as Record<string, unknown>)}
      >
        {icon && iconPosition === 'left' && !isLoading && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        {isLoading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ⟳
          </motion.span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && !isLoading && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;