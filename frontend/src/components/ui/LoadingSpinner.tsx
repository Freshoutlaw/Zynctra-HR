/**
 * /frontend/src/components/ui/LoadingSpinner.tsx
 * Loading spinner component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  text,
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-600 dark:text-cyan-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeMap[size]} ${colorMap[color]}`}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <path
          d="M12 2a10 10 0 010 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 flex flex-col items-center gap-4">
          {spinner}
          {text && <p className="text-slate-700 dark:text-slate-300 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {spinner}
      {text && <p className="text-slate-700 dark:text-slate-300 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;