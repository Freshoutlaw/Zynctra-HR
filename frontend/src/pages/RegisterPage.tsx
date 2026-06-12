/**
 * Zynctra HR — Register Page
 * Clean editorial design. Creates account, then redirects to MFA setup.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

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

const IconUser = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBuilding = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 21v-6h6v6" />
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

const IconArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL ?? ''}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim()) { setError('First name is required.'); return; }
    if (!formData.lastName.trim()) { setError('Last name is required.'); return; }
    if (!formData.email.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Invalid email format.'); return; }
    if (!formData.company.trim()) { setError('Company name is required.'); return; }
    if (!formData.password) { setError('Password is required.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!acceptedTerms) { setError('Please accept the Terms of Service.'); return; }

    setIsSubmitting(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        password: formData.password,
      });
      // After successful registration, redirect to MFA setup
      navigate('/mfa-setup', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=1600&fit=crop"
          alt="Team collaborating"
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
              "We went live in 48 hours. The migration tools imported everything from our old system without a single data issue."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face"
                alt="Tom Bradley"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm font-semibold">Tom Bradley</div>
                <div className="text-xs text-neutral-400">VP Engineering, Forge Digital</div>
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
      <div className="flex items-center justify-center flex-1 px-6 py-12 overflow-y-auto lg:px-12">
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
              Create your account
            </h1>
            <p className={`text-sm ${mutedText}`}>
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {/* Card */}
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <AnimatePresence>
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
                  or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                  Work email
                </label>
                <div className="relative">
                  <IconMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                  Company
                </label>
                <div className="relative">
                  <IconBuilding className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} />
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                  Password
                </label>
                <div className="relative">
                  <IconLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${mutedText} hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors`}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1.5 ${labelText}`}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${inputBg}`}
                  disabled={isSubmitting}
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className={`text-xs ${mutedText} leading-relaxed`}>
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyan-600 dark:text-cyan-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</Link>
                  . I consent to receiving product updates and marketing communications.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full gap-2 py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
                {!isSubmitting && <IconArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className={`text-center text-sm mt-6 ${mutedText}`}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;