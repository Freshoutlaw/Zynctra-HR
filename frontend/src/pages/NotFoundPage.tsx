/**
 * /frontend/src/pages/NotFoundPage.tsx
 * 
 * 404 Not Found error page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

/**
 * NotFoundPage Component
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.div>

        {/* Message */}
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Illustration */}
        <motion.div
          className={`p-12 rounded-lg mb-8 ${
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className="text-6xl inline-block"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍
          </motion.span>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              isDark
                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
          </motion.button>
          <motion.button
            onClick={() => navigate(-1)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition border ${
              isDark
                ? 'border-slate-700 text-white hover:bg-slate-800'
                : 'border-slate-300 text-slate-900 hover:bg-slate-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </div>

        {/* Help Text */}
        <p className={`text-sm mt-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Need help?{' '}
          <a
            href="mailto:support@zynctra.com"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;