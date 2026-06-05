/**
 * /frontend/src/components/common/Spinner.tsx
 *
 * Loading spinner component.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  fullScreen?: boolean;
  message?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  message,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const spinnerEl = (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-4`}
      style={{
        borderTopColor: 'rgb(0, 217, 255)',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm ${
          isDark ? 'bg-slate-900/50' : 'bg-white/50'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-cyan-400">{spinnerEl}</div>
          {message && (
            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-cyan-400">{spinnerEl}</div>
  );
};

export default Spinner;