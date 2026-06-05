/**
 * /frontend/src/components/common/Card.tsx
 *
 * Reusable card component for content containers.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  className?: string;
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, glow = false, children, onClick }, ref) => {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    return (
      <motion.div
        ref={ref}
        className={`rounded-lg border p-6 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } ${hover ? 'cursor-pointer' : ''} ${
          glow
            ? isDark
              ? 'shadow-[0_0_20px_rgba(0,217,255,0.3)]'
              : 'shadow-md'
            : isDark
              ? 'shadow-sm'
              : 'shadow'
        } ${className}`}
        onClick={onClick}
        whileHover={hover ? { y: -4 } : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mb-4">{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h3 className="text-lg font-semibold">{children}</h3>;

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { effectiveTheme } = useTheme();
  return (
    <p
      className={`text-sm mt-1 ${
        effectiveTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
      }`}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="my-4">{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
    {children}
  </div>
);

export default Card;