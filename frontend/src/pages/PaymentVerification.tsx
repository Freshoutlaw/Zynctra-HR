/**
 * /frontend/src/pages/PaymentVerification.tsx
 *
 * Payment verification page — handles Paystack callback.
 * Fixed: uses useBilling hook correctly; no process.env.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useBilling from '../hooks/useBilling';
import { PaymentStatus } from '../types/billing.types';
import { useTheme } from '../context/ThemeContext';

type VerifyState = 'processing' | 'success' | 'failed';

const PaymentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyPayment, isLoading } = useBilling();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [state, setState] = useState<VerifyState>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void runVerification();
  }, []);

  const runVerification = async () => {
    const reference =
      searchParams.get('reference') ??
      sessionStorage.getItem('paymentReference');

    if (!reference) {
      setState('failed');
      setErrorMessage('No payment reference found. Please contact support.');
      return;
    }

    const status = await verifyPayment(reference);

    if (status === PaymentStatus.COMPLETED) {
      setState('success');
      sessionStorage.removeItem('paymentReference');
      setTimeout(() => navigate('/dashboard/subscription', { replace: true }), 3000);
    } else {
      setState('failed');
      setErrorMessage('Payment verification failed. Please try again or contact support.');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {state === 'processing' && (
          <div className="text-center">
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Please wait while we confirm your payment…
            </p>
          </div>
        )}

        {state === 'success' && (
          <motion.div
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-400 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <span className="text-green-400 text-3xl">✓</span>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your subscription has been activated. Redirecting to your dashboard…
            </p>
            <button
              onClick={() => navigate('/dashboard/subscription', { replace: true })}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Go to Dashboard
            </button>
            <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Redirecting automatically in 3 seconds…
            </p>
          </motion.div>
        )}

        {state === 'failed' && (
          <motion.div
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-400 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <span className="text-red-400 text-3xl">✕</span>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {errorMessage ?? 'We could not verify your payment. Please try again.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/pricing', { replace: true })}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Back to Pricing
              </button>
              <button
                onClick={() => { setState('processing'); void runVerification(); }}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Retrying…' : 'Retry'}
              </button>
            </div>

            <div className={`mt-6 p-4 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Need help? Contact support:</p>
              <p className="text-cyan-400 font-medium mt-1">support@zynctra.com</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerification;