/**
 * /frontend/src/pages/LoadingPage.tsx
 *
 * Cinematic loading splash shown while auth state is resolving.
 * Fixed: does not auto-navigate — that responsibility is in App.tsx.
 * This component is purely visual; it renders until isLoading is false.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Initialising secure systems…',
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(90deg,#00d9ff 1px,transparent 1px),linear-gradient(#00d9ff 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            className="w-32 h-32"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Zynctra logo"
          >
            <g stroke="#00d9ff" strokeWidth="3" fill="none" strokeLinecap="round">
              <motion.path
                d="M 50 50 L 100 50 L 75 80 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <motion.path
                d="M 100 50 L 150 50 L 125 80 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.path
                d="M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z"
                fill="#00d9ff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
              <motion.path
                d="M 50 150 L 75 120 L 100 150 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.path
                d="M 100 150 L 125 120 L 150 150 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </g>
          </motion.svg>
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Zynctra HR
          </h1>
          <p className="text-cyan-300 font-light tracking-wide">
            All-in-One HR Platform
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          role="progressbar"
          aria-label="Loading"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.9 }}
          />
        </motion.div>

        {/* Status message */}
        <motion.p
          className="text-sm text-slate-400 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        >
          {message}
        </motion.p>
      </div>

      {/* Corner decoration */}
      <motion.div
        className="absolute bottom-8 right-8 w-8 h-8 border-2 border-cyan-500 rounded-lg rotate-45 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
      />
    </div>
  );
};

export default LoadingPage;