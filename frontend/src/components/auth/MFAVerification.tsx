/**
 * /frontend/src/components/auth/MFAVerification.tsx
 *
 * MFA code entry component.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

interface MFAVerificationProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({
  onSuccess,
  onBack,
}) => {
  const { verifyMFA } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length < 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyMFA(code);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid code. Please try again.'
      );
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {error && (
        <motion.div
          className={`p-4 rounded-lg border text-sm ${
            isDark
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-red-100 border-red-300 text-red-900'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className={`w-full px-4 py-4 rounded-lg border text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-white'
              : 'border-slate-300 bg-slate-50 text-slate-900'
          }`}
          disabled={isLoading}
          aria-label="MFA code"
          autoComplete="one-time-code"
        />
      </div>

      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isDark
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            }`}
          >
            ← Back
          </button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading || code.length < 6}
          className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          whileHover={!isLoading  ? { scale: 1.02 } : {}}
          whileTap={!isLoading  ? { scale: 0.98 } : {}}
        >
          {isLoading ? 'Verifying…' : 'Verify'}
        </motion.button>
      </div>
    </form>
  );
};

export default MFAVerification;