/**
 * /frontend/src/components/layout/Navbar.tsx
 * 
 * Navigation header with logo, menu, and user profile
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import useBilling from '../../hooks/useBilling';

/**
 * Navbar Component
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, effectiveTheme } = useTheme();
  const { currentPlan, isFreeModeActive } = useBilling();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = effectiveTheme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const planBadge = currentPlan?.name || 'Free';
  const planColor =
    currentPlan?.id === 'PREMIUM'
      ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
      : currentPlan?.id === 'STANDARD'
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
        : 'bg-slate-500/20 text-slate-300 border-slate-400/50';

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition ${
        isDark
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-slate-900">
              Z
            </div>
            <span className="font-bold text-lg hidden sm:inline">Zynctra</span>
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/dashboard"
              className={`text-sm font-medium transition hover:text-cyan-400 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Dashboard
            </a>
            {user?.role === 'SUPER_ADMIN' && (
              <a
                href="/admin"
                className={`text-sm font-medium transition hover:text-cyan-400 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Admin
              </a>
            )}
            {!isFreeModeActive && (
              <a
                href="/pricing"
                className={`text-sm font-medium transition hover:text-cyan-400 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Pricing
              </a>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Plan Badge */}
            {user && (
              <motion.div
                className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${planColor}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>📦</span>
                <span>{planBadge}</span>
              </motion.div>
            )}

            {/* Theme Toggle */}
            <motion.button
              onClick={() =>
                setTheme(
                  effectiveTheme === 'dark'
                    ? 'light'
                    : effectiveTheme === 'light'
                      ? 'system'
                      : 'dark'
                )
              }
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={`Theme: ${theme}`}
            >
              {effectiveTheme === 'dark' ? '☀️' : '🌙'}
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <span className="text-lg">▼</span>
                </motion.button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                      isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-2">
                      <div
                        className={`px-4 py-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {user.email}
                      </div>

                      <button
                        onClick={() => {
                          navigate('/dashboard/subscription');
                          setIsMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded transition ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-900'
                        }`}
                      >
                        💳 Subscription
                      </button>

                      {user.role === 'SUPER_ADMIN' && (
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setIsMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm rounded transition ${
                            isDark
                              ? 'hover:bg-slate-700 text-slate-300'
                              : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          ⚙️ Admin Panel
                        </button>
                      )}

                      <div
                        className={`my-2 h-px ${
                          isDark ? 'bg-slate-700' : 'bg-slate-200'
                        }`}
                      />

                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm rounded transition text-red-400 hover:bg-red-500/10`}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              ≡
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;