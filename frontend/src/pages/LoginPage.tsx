/**
 * Zynctra HR — Login Page
 * Editorial, minimal. Email/password or Google → MFA → Dashboard.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

type LoginStep = 'credentials' | 'mfa';

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconEye = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const IconLock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconMail = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const IconShield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconGoogle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ─── Zynctra Logo ──────────────────────────────────────────────────────────

const ZynctraLogo = ({ className }: { className?: string }) => (
  <img
    src="./assets/logos/logo.png"
    alt="Zynctra"
    className={className}
  />
);

// ─── Main Component ────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyMFA, mfaVerified } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleAuth = () => {
    // TODO: Wire to your Google OAuth endpoint
    // After OAuth, backend should redirect to /mfa-setup or /dashboard
    window.location.href = `${import.meta.env.VITE_API_URL ?? ''}/auth/google`;
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email format.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // After login, check if MFA is needed
      if (!mfaVerified) {
        setStep('mfa');
      }
      // If mfaVerified is true, App.tsx AuthRoute will redirect to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
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
      // After successful MFA, mfaVerified becomes true
      // App.tsx will redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid MFA code.');
      setMfaCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Shared Styles ───────────────────────────────────────────────────────

  const cardBg = isDark ? 'bg-[#111] border-neutral-800' : 'bg-white border-neutral-200';
  const mutedText = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const labelText = isDark ? 'text-neutral-300' : 'text-neutral-700';
  const inputBg = isDark
    ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-cyan-500 focus:ring-cyan-500/20'
    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-cyan-500 focus:ring-cyan-500/20';
  const errorBg = isDark
    ? 'bg-red-500/10 border-red-500/30 text-red-400'
    : 'bg-red-50 border-red-200 text-red-700';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0a0a0a]' : 'bg-neutral-50'}`}>
      {/* ─── Left Panel: Visual ─────────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=1600&fit=crop"
          alt="Modern office interior"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-neutral-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <ZynctraLogo className="w-8 h-8" />
              <span className="text-lg font-semibold tracking-tight transition-opacity group-hover:opacity-80">Zynctra</span>
            </Link>
            <blockquote className="max-w-md mb-6 text-2xl font-medium leading-relaxed">
              "Zynctra cut our onboarding time by 60%. The platform handles everything from payroll to compliance without us touching a spreadsheet."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
                alt="Sarah Chen"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm font-semibold">Sarah Chen</div>
                <div className="text-xs text-neutral-400">VP People Operations, TechFlow</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <IconShield className="w-3.5 h-3.5" />
              SOC 2 Type II
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5" />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <IconLock className="w-3.5 h-3.5" />
              AES-256
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Form ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 lg:px-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-10 group">
            <ZynctraLogo className="w-7 h-7" />
            <span className="text-lg font-semibold tracking-tight transition-opacity text-neutral-900 dark:text-white group-hover:opacity-80">
              Zynctra
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {step === 'credentials' ? 'Welcome back' : 'Two-factor authentication'}
            </h1>
            <p className={`text-sm ${mutedText}`}>
              {step === 'credentials'
                ? 'Sign in to access your dashboard.'
                : 'Enter the 6-digit code from your authenticator app.'}
            </p>
          </div>

          {/* Card */}
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className={`mb-5 p-3.5 rounded-lg border text-sm ${errorBg}`}
                  initial={{ opacity: 0, y: -6 }}
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
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Google OAuth */}
                  <button
                    onClick={handleGoogleAuth}
                    type="button"
                    className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      isDark
                        ? 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800'
                        : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <IconGoogle className="w-5 h-5" />
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`} />
                    </div>
                    <div className="relative flex justify-center">
                      <span className={`px-3 text-xs ${mutedText} ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
                        or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleCredentials} className="space-y-5">
                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium mb-2 ${labelText}`}>
                        Email
                      </label>
                      <div className="relative">
                        <IconMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} />
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className={`text-sm font-medium ${labelText}`}>
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <div className="relative">
                        <IconLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`w-full pl-10 pr-11 py-3 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${mutedText} hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors`}
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.form
                  key="mfa"
                  onSubmit={handleMFA}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="py-4 text-center">
                    <div className="inline-flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <IconLock className="w-6 h-6" />
                    </div>
                    <p className={`text-sm ${mutedText} max-w-xs mx-auto`}>
                      Open your authenticator app and enter the 6-digit code.
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
                    className={`w-full px-4 py-4 rounded-lg border text-center text-2xl tracking-[0.4em] font-mono transition focus:outline-none focus:ring-2 ${inputBg}`}
                    autoComplete="one-time-code"
                    autoFocus
                    disabled={isSubmitting}
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep('credentials'); setMfaCode(''); setError(null); }}
                      className={`flex items-center justify-center gap-1.5 flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                        isDark ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      <IconArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || mfaCode.length < 6}
                      className="flex-1 py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer link */}
          <p className={`text-center text-sm mt-6 ${mutedText}`}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
              Start free trial
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;