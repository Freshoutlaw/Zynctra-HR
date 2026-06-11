/**
 * Zynctra HR — MFA Setup Page
 * Shown after registration to configure 2FA before accessing dashboard.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const IconLock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

const IconCopy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ZynctraLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="currentColor" className="text-neutral-900 dark:text-white" />
    <path
      d="M10 10h12l-8 12h8"
      stroke="currentColor"
      className="text-white dark:text-neutral-900"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="22" cy="22" r="2.5" fill="currentColor" className="text-cyan-500" />
  </svg>
);

const MFASetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const { isAuthenticated, mfaVerified, verifyMFA } = useAuth();

  const [step, setStep] = useState<'qr' | 'verify'>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock secret — in production this comes from your backend
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Zynctra:user@company.com?secret=${secretKey}&issuer=Zynctra`;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
    if (mfaVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, mfaVerified, navigate]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.length < 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyMFA(verificationCode);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className={`min-h-screen flex items-center justify-center px-6 py-12 ${isDark ? 'bg-[#0a0a0a]' : 'bg-neutral-50'}`}>
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <ZynctraLogo className="w-8 h-8" />
            <span className="text-lg font-semibold tracking-tight transition-opacity text-neutral-900 dark:text-white group-hover:opacity-80">Zynctra</span>
          </Link>
          <div className="inline-flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <IconShield className="w-7 h-7" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Secure your account
          </h1>
          <p className={`text-sm ${mutedText} max-w-sm mx-auto`}>
            Add an extra layer of security. Scan the QR code with your authenticator app to continue.
          </p>
        </div>

        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          {error && (
            <motion.div
              className={`mb-5 p-3.5 rounded-lg border text-sm ${errorBg}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {step === 'qr' ? (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white' : 'bg-white border border-neutral-200'}`}>
                  <img
                    src={qrCodeUrl}
                    alt="MFA QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Secret Key */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                  Can't scan? Enter this key manually
                </label>
                <div className="flex gap-2">
                  <div className={`flex-1 px-3 py-2.5 rounded-lg border font-mono text-sm tracking-wider ${inputBg}`}>
                    {secretKey}
                  </div>
                  <button
                    onClick={handleCopySecret}
                    type="button"
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      isDark
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">Copied to clipboard</p>
                )}
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
              >
                I've scanned the code
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="py-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <IconLock className="w-5 h-5" />
                </div>
                <p className={`text-sm ${mutedText}`}>
                  Enter the 6-digit code from your authenticator app to verify setup.
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className={`w-full px-4 py-4 rounded-lg border text-center text-2xl tracking-[0.4em] font-mono transition focus:outline-none focus:ring-2 ${inputBg}`}
                autoComplete="one-time-code"
                autoFocus
                disabled={isSubmitting}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep('qr'); setVerificationCode(''); setError(null); }}
                  className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                    isDark ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || verificationCode.length < 6}
                  className="flex-1 py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verifying…' : 'Enable 2FA'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className={`text-center text-xs mt-6 ${mutedText}`}>
          This step is required to protect your account. You can disable 2FA later from Settings.
        </p>
      </motion.div>
    </div>
  );
};

export default MFASetupPage;