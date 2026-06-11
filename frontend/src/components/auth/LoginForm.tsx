/**
 * /frontend/src/components/auth/LoginForm.tsx
 *
 * Reusable login form component — used inside LoginPage.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onMFARequired?: (sessionToken: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onMFARequired: _onMFARequired }) => {
  const { login } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border transition ${
      hasError
        ? isDark
          ? 'border-red-500 bg-red-500/10'
          : 'border-red-500 bg-red-50'
        : isDark
          ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500'
          : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-cyan-500`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <motion.div
          className={`p-4 rounded-lg border text-sm ${
            isDark
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-red-100 border-red-300 text-red-900'
          }`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <div>
        <label
          htmlFor="email"
          className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass(false)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className={`${inputClass(false)} pr-12`}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
              isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-lg font-semibold transition bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </motion.button>
    </form>
  );
};

export default LoginForm;