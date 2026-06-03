/**
 * /frontend/src/pages/LoginPage.tsx
 * 
 * User login with email/password and MFA support
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

type LoginStep = 'credentials' | 'mfa';

interface LoginForm {
  email: string;
  password: string;
  mfaCode: string;
}

/**
 * LoginPage Component
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [step, setStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    mfaCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const planParam = searchParams.get('plan');
  const actionParam = searchParams.get('action');

  /**
   * Validate email and password
   */
  const validateCredentials = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Invalid password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle credential submission
   */
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCredentials()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setErrors({
          submit: data.message || 'Login failed. Check your credentials.',
        });
        return;
      }

      const data = await response.json();

      // Check if MFA is required
      if (data.mfaRequired) {
        setSessionToken(data.sessionToken);
        setStep('mfa');
        setErrors({});
      } else {
        // Login successful
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle MFA submission
   */
  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mfaCode || formData.mfaCode.length < 6) {
      setErrors({ mfaCode: 'Invalid MFA code' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/mfa-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({
            sessionToken,
            mfaCode: formData.mfaCode,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setErrors({
          mfaCode: data.message || 'Invalid MFA code',
        });
        return;
      }

      // Login successful
      window.location.href = planParam ? `/pricing?plan=${planParam}` : '/dashboard';
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'MFA verification failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') || '';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {step === 'credentials' ? 'Sign in to your account' : 'Enter your MFA code'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={step === 'credentials' ? handleCredentialsSubmit : handleMFASubmit}
          className={`p-8 rounded-lg border ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-lg'
          }`}
        >
          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onBlur={() => setErrors({})}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      errors.email
                        ? isDark
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-red-500 bg-red-50'
                        : isDark
                          ? 'border-slate-700 bg-slate-800'
                          : 'border-slate-300 bg-slate-50'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      onBlur={() => setErrors({})}
                      placeholder="••••••••••••"
                      className={`w-full px-4 py-3 rounded-lg border transition ${
                        errors.password
                          ? isDark
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-red-500 bg-red-50'
                          : isDark
                            ? 'border-slate-700 bg-slate-800'
                            : 'border-slate-300 bg-slate-50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className={`w-4 h-4 rounded ${
                      isDark ? 'border-slate-600 bg-slate-700' : 'border-slate-300'
                    }`} />
                    <span>Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error */}
                {errors.submit && (
                  <motion.div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-red-100 border-red-300 text-red-900'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.submit}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="mfaCode" className="block text-sm font-semibold mb-2">
                    Enter your 6-digit MFA code
                  </label>
                  <input
                    type="text"
                    id="mfaCode"
                    value={formData.mfaCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mfaCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                      })
                    }
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-lg border transition text-center text-3xl tracking-widest font-mono ${
                      errors.mfaCode
                        ? isDark
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-red-500 bg-red-50'
                        : isDark
                          ? 'border-slate-700 bg-slate-800'
                          : 'border-slate-300 bg-slate-50'
                    }`}
                  />
                  {errors.mfaCode && (
                    <p className="text-red-500 text-xs mt-2 text-center">{errors.mfaCode}</p>
                  )}
                </div>

                {errors.submit && (
                  <motion.div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-red-100 border-red-300 text-red-900'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.submit}
                  </motion.div>
                )}

                <p className={`text-sm text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Check your authenticator app for the code
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setFormData({ ...formData, mfaCode: '' });
                    setErrors({});
                  }}
                  className={`w-full py-2 text-sm font-medium ${
                    isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-cyan-600 hover:text-cyan-700'
                  }`}
                >
                  ← Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition mt-6 ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
            }`}
          >
            {isLoading ? 'Signing in...' : step === 'credentials' ? 'Sign In' : 'Verify'}
          </button>

          {/* Sign Up Link */}
          {step === 'credentials' && (
            <p className={`text-center text-sm mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign up
              </Link>
            </p>
          )}
        </form>

        {/* Info Box */}
        {step === 'credentials' && (
          <motion.div
            className={`mt-8 p-6 rounded-lg border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-slate-100 border-slate-300'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-3">Demo Credentials</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
              For testing purposes:
            </p>
            <code className={`text-xs block p-2 rounded ${
              isDark ? 'bg-slate-900 text-cyan-400' : 'bg-white text-cyan-600'
            } font-mono`}>
              Email: demo@example.com
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