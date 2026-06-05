/**
 * /frontend/src/components/common/Badge.tsx
 *
 * Status badge component with variants.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  animated = false,
  className = '',
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50',
    success: 'bg-green-500/20 text-green-300 border border-green-400/50',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50',
    error: 'bg-red-500/20 text-red-300 border border-red-400/50',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-400/50',
    neutral: isDark
      ? 'bg-slate-800 text-slate-300 border border-slate-700'
      : 'bg-slate-200 text-slate-700 border border-slate-300',
  };

  return (
    <motion.span
      className={`inline-flex items-center gap-2 rounded-full font-semibold whitespace-nowrap ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      initial={animated ? { scale: 0 } : undefined}
      animate={animated ? { scale: 1 } : undefined}
      transition={animated ? { duration: 0.3, type: 'spring' } : undefined}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </motion.span>
  );
};

export default Badge;