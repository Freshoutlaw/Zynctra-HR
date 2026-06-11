import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'shadow' | 'outline' | 'solid';
  accent?: boolean;
}

const variantClassMap: Record<NonNullable<CardProps['variant']>, string> = {
  shadow: 'shadow-sm border border-slate-200 dark:border-slate-700',
  outline: 'border border-slate-200 dark:border-slate-700',
  solid: 'border-transparent',
};

const Card: React.FC<CardProps> = ({
  variant = 'shadow',
  accent = false,
  className = '',
  children,
  ...props
}) => {
  const accentClass = accent ? 'ring-1 ring-cyan-400/20 dark:ring-cyan-500/25' : '';

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-900 p-6 transition-colors ${variantClassMap[variant]} ${accentClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
