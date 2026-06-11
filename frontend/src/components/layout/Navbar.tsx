/**
 * /frontend/src/components/layout/Navbar.tsx
 *
 * Navigation header with logo, menu, and user profile.
 * Fixed: imports useAuth from hooks (not directly from context),
 * useBilling properly typed, no duplicate identifier issues.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import useBilling from '../../hooks/useBilling';
import { UserRole } from '../../types/auth.types';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, effectiveTheme } = useTheme();
  const { currentPlan, isFreeModeActive } = useBilling();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = effectiveTheme === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    if (effectiveTheme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const planName = currentPlan?.displayName ?? 'Free';
  const planColorClass =
    currentPlan?.id === 'PREMIUM'
      ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
      : currentPlan?.id === 'STANDARD'
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
        : 'bg-slate-500/20 text-slate-300 border-slate-400/50';

  const userInitial =
    (user?.firstName?.charAt(0) ?? user?.lastName?.charAt(0) ?? user?.email?.charAt(0)) ??
    'U';

  const displayName = (user?.firstName ?? user?.lastName ?? user?.email) ?? '';

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
          <motion.button
            className="flex items-center gap-2"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to dashboard"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-slate-900 select-none">
              Z
            </div>
            <span className="font-bold text-lg hidden sm:inline">Zynctra</span>
          </motion.button>

          {/* Centre navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`text-sm font-medium transition hover:text-cyan-400 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Dashboard
            </button>
            {user?.role === UserRole.SUPER_ADMIN && (
              <button
                onClick={() => navigate('/admin')}
                className={`text-sm font-medium transition hover:text-cyan-400 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Admin
              </button>
            )}
            {!isFreeModeActive && (
              <button
                onClick={() => navigate('/pricing')}
                className={`text-sm font-medium transition hover:text-cyan-400 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Pricing
              </button>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            {user && (
              <motion.div
                className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${planColorClass}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>📦</span>
                <span>{planName}</span>
              </motion.div>
            )}

            {/* Theme toggle */}
            <motion.button
              onClick={cycleTheme}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={`Theme: ${theme}`}
              aria-label="Toggle theme"
            >
              {effectiveTheme === 'dark' ? '☀️' : '🌙'}
            </motion.button>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  onClick={() => setIsMenuOpen((o) => !o)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={isMenuOpen}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm select-none">
                    {userInitial}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {displayName}
                  </span>
                  <span
                    className={`text-xs transition-transform ${
                      isMenuOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${
                        isDark
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-white border-slate-200'
                      }`}
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="p-2">
                        <div
                          className={`px-4 py-2 text-xs truncate ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {user.email}
                        </div>
                        <hr
                          className={`my-1 ${
                            isDark ? 'border-slate-700' : 'border-slate-200'
                          }`}
                        />
                        <MenuButton
                          label="💳 Subscription"
                          onClick={() => {
                            navigate('/dashboard/subscription');
                            setIsMenuOpen(false);
                          }}
                          isDark={isDark}
                        />
                        {user.role === UserRole.SUPER_ADMIN && (
                          <MenuButton
                            label="⚙️ Admin Panel"
                            onClick={() => {
                              navigate('/admin');
                              setIsMenuOpen(false);
                            }}
                            isDark={isDark}
                          />
                        )}
                        <hr
                          className={`my-1 ${
                            isDark ? 'border-slate-700' : 'border-slate-200'
                          }`}
                        />
                        <MenuButton
                          label="🚪 Logout"
                          onClick={handleLogout}
                          isDark={isDark}
                          danger
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

// Small helper to keep the dropdown DRY
const MenuButton: React.FC<{
  label: string;
  onClick: () => void;
  isDark: boolean;
  danger?: boolean;
}> = ({ label, onClick, isDark, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm rounded transition ${
      danger
        ? 'text-red-400 hover:bg-red-500/10'
        : isDark
          ? 'text-slate-300 hover:bg-slate-700'
          : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    {label}
  </button>
);

export default Navbar;