import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const toneMap: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
};

const Badge: React.FC<BadgeProps> = ({
  tone = 'default',
  className = '',
  children,
  ...props
}) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneMap[tone]} ${className}`.trim()}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
