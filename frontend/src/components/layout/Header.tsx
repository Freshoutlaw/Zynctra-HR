/**
 * /frontend/src/components/layout/Header.tsx
 *
 * Page-level header component used inside dashboard pages.
 * Displays page title, breadcrumbs, and optional action buttons.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  icon?: string;
  badge?: { label: string; variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' };
}

const badgeVariants = {
  success: 'bg-green-500/20 text-green-300 border-green-400/50',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
  error:   'bg-red-500/20 text-red-300 border-red-400/50',
  info:    'bg-blue-500/20 text-blue-300 border-blue-400/50',
  neutral: 'bg-slate-500/20 text-slate-300 border-slate-400/50',
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  badge,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1.5 text-xs">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>›</span>
              )}
              {crumb.href || crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className={`transition hover:text-cyan-400 ${
                    idx === breadcrumbs.length - 1
                      ? isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={
                  idx === breadcrumbs.length - 1
                    ? isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'
                    : isDark ? 'text-slate-500' : 'text-slate-400'
                }>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100'
            }`}>
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight">{title}</h1>
              {badge && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                  badgeVariants[badge.variant ?? 'neutral']
                }`}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions slot */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={`mt-4 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </motion.div>
  );
};

export default Header;