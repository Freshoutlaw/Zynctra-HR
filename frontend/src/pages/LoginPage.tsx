/**
 * /frontend/src/pages/LoginPage.tsx
 *
 * User login with email/password and MFA support.
 * Fixed: uses AuthContext login directly; MFA step handled via state.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

type LoginStep = 'credentials' | 'mfa';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, verifyMFA, isAuthenticated, isLoading: authLoading } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planParam = searchParams.get('plan');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(planParam ? `/pricing?plan=${planParam}` : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, planParam]);

  const inputClass = (isError = false) =>
    `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
      isError
        ? isDark ? 'border-red-500 bg-red-500/10 text-white' : 'border-red-500 bg-red-50'
        : isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-300 bg-slate-50 placeholder-slate-400'
    }`;

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email format.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // If login succeeds without MFA, useEffect above handles redirect
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      // Check if MFA is required (backend signals this via error code or specific message)
      if (msg.toLowerCase().includes('mfa') || msg.toLowerCase().includes('two-factor')) {
        setStep('mfa');
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mfaCode.length < 6) { setError('Please enter a valid 6-digit code.'); return; }

    setIsSubmitting(true);
    try {
      await verifyMFA(mfaCode);
      navigate(planParam ? `/pricing?plan=${planParam}` : '/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid MFA code.');
      setMfaCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold text-xl mb-4">
            Z
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {step === 'credentials' ? 'Sign in to your account' : 'Enter your MFA code'}
          </p>
        </div>

        {/* Form card */}
        <div
          className={`p-8 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}
        >
          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                className={`mb-5 p-4 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-red-500/20 border-red-500/50 text-red-300'
                    : 'bg-red-50 border-red-300 text-red-700'
                }`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.form
                key="credentials"
                onSubmit={handleCredentials}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                noValidate
                className="space-y-5"
              >
                <div>
                  <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass()}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`${inputClass()} pr-12`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                >
                  {isSubmitting ? 'Signing in…' : 'Sign In'}
                </motion.button>

                <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                    Sign up
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="mfa"
                onSubmit={handleMFA}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="text-center mb-2">
                  <div className="text-5xl mb-3">🔐</div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Enter the 6-digit code from your authenticator app.
                  </p>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className={`w-full px-4 py-4 rounded-lg border text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-slate-50'
                  }`}
                  autoComplete="one-time-code"
                  autoFocus
                  disabled={isSubmitting}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setMfaCode(''); setError(null); }}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                    }`}
                  >
                    ← Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || mfaCode.length < 6}
                    className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                    whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                  >
                    {isSubmitting ? 'Verifying…' : 'Verify'}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Demo credentials hint */}
        {step === 'credentials' && (
          <motion.div
            className={`mt-6 p-5 rounded-xl border ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-semibold mb-2">Demo Credentials</p>
            <code
              className={`text-xs block p-2 rounded font-mono ${
                isDark ? 'bg-slate-900 text-cyan-400' : 'bg-white text-cyan-600'
              }`}
            >
              Email: demo@zynctra.com
              <br />
              Password: Demo@12345!
            </code>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;