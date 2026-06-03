/**
 * /frontend/src/pages/PaymentVerification.tsx
 * 
 * Payment verification page
 * Handles Paystack callback after payment completion
 * Verifies payment status and activates subscription
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useBilling from '../hooks/useBilling';
import { PaymentStatus } from '../types/billing.types';

/**
 * PaymentVerification Component
 */
const PaymentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billing = useBilling();
  const [verificationStatus, setVerificationStatus] = useState<'processing' | 'success' | 'failed'>(
    'processing'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Verify payment on component mount
   */
  useEffect(() => {
    verifyPayment();
  }, []);

  /**
   * Verify payment with backend
   */
  const verifyPayment = async () => {
    try {
      // Get reference from URL or session
      const reference = searchParams.get('reference') || sessionStorage.getItem('paymentReference');

      if (!reference) {
        setVerificationStatus('failed');
        setErrorMessage('No payment reference found');
        return;
      }

      // Verify with Paystack
      const status = await billing.verifyPayment(reference);

      if (status === PaymentStatus.COMPLETED) {
        setVerificationStatus('success');

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard/subscription');
        }, 3000);
      } else {
        setVerificationStatus('failed');
        setErrorMessage('Payment verification failed. Please try again.');
      }

      // Clean up session
      sessionStorage.removeItem('paymentReference');
      sessionStorage.removeItem('planId');
      sessionStorage.removeItem('billingPeriod');
    } catch (error) {
      setVerificationStatus('failed');
      setErrorMessage(
        error instanceof Error ? error.message : 'Payment verification error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {verificationStatus === 'processing' && (
          <div className="text-center">
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-slate-400">
              Please wait while we confirm your payment and activate your subscription...
            </p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-400 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-slate-400 mb-6">
              Your subscription has been activated. You can now access all premium features.
            </p>

            <button
              onClick={() => navigate('/dashboard/subscription')}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Go to Dashboard
            </button>

            <p className="text-xs text-slate-500 mt-4">
              Redirecting automatically in 3 seconds...
            </p>
          </motion.div>
        )}

        {verificationStatus === 'failed' && (
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-400 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-slate-400 mb-6">
              {errorMessage || 'We were unable to verify your payment. Please try again.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/pricing')}
                className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                Back to Pricing
              </button>
              <button
                onClick={verifyPayment}
                className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition"
              >
                Retry
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 p-4 rounded-lg bg-slate-800/40 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">
                Having issues? Contact our support team:
              </p>
              <p className="text-cyan-300 font-medium">support@zynctra.com</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerification;