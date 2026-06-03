/**
 * /frontend/src/pages/SubscriptionDashboard.tsx
 * 
 * Subscription and billing management dashboard
 * Users manage plans, payment methods, view invoices, etc.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBilling from '../hooks/useBilling';
import useBillingStore from '../stores/billingStore';
import { SubscriptionPlan, BillingPeriod, PaymentStatus } from '../types/billing.types';
import { getFeatureFlagService } from '../services/billing/featureFlags';

/**
 * Subscription Status Badge
 */
const StatusBadge: React.FC<{ status: string; isTrialActive: boolean }> = ({
  status,
  isTrialActive,
}) => {
  const colors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-300 border-green-400',
    trialing: 'bg-blue-500/20 text-blue-300 border-blue-400',
    inactive: 'bg-gray-500/20 text-gray-300 border-gray-400',
    cancelled: 'bg-red-500/20 text-red-300 border-red-400',
    expired: 'bg-orange-500/20 text-orange-300 border-orange-400',
  };

  const displayStatus = isTrialActive ? 'Trialing' : status;
  const colorClass = colors[status] || colors.inactive;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${colorClass}`}>
      <span className={`w-2 h-2 rounded-full ${isTrialActive ? 'bg-blue-400' : 'bg-green-400'}`} />
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
};

/**
 * Subscription Dashboard Component
 */
const SubscriptionDashboard: React.FC = () => {
  const billing = useBilling();
  const billingStore = useBillingStore();
  const flags = getFeatureFlagService();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payment-methods' | 'settings'>(
    'overview'
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    flags.initialize();
  }, []);

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      await billing.cancelSubscription(cancellationReason);
      setShowCancelDialog(false);
      setCancellationReason('');
    } catch (error) {
      console.error('Cancellation error:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <motion.div
        className="p-6 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm text-slate-400 mb-2">Current Plan</h3>
            <h2 className="text-3xl font-bold text-white">
              {billing.currentPlan?.displayName || 'No Plan'}
            </h2>
          </div>
          <StatusBadge
            status={billing.subscription?.status || 'inactive'}
            isTrialActive={billing.isTrialActive}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Plan Price */}
          <div>
            <p className="text-sm text-slate-400 mb-1">Monthly Cost</p>
            <p className="text-2xl font-bold text-cyan-300">
              ${billing.currentPlan?.monthlyPrice}/mo
            </p>
          </div>

          {/* Renewal Date */}
          <div>
            <p className="text-sm text-slate-400 mb-1">Next Billing Date</p>
            <p className="text-2xl font-bold text-white">
              {billing.getNextBillingDate()
                ? new Date(billing.getNextBillingDate()!).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>

          {/* Days Remaining */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              {billing.isTrialActive ? 'Trial Days' : 'Days Until Renewal'}
            </p>
            <p className="text-2xl font-bold text-white">{billing.daysUntilRenewal}</p>
          </div>
        </div>

        {/* Plan Description */}
        <p className="text-slate-300 text-sm mt-6 mb-6">
          {billing.currentPlan?.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {billing.canUpgrade() && billing.currentPlan?.id !== SubscriptionPlan.PREMIUM && (
            <button
              onClick={() => {
                // Navigate to pricing page for upgrade
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm"
            >
              ⬆ Upgrade Plan
            </button>
          )}

          {billing.canDowngrade() && billing.currentPlan?.id !== SubscriptionPlan.FREE && (
            <button
              onClick={() => {
                // Navigate to pricing page for downgrade
              }}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium text-sm"
            >
              ⬇ Downgrade Plan
            </button>
          )}

          {billing.subscription?.status === 'active' && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-600/30 transition font-medium text-sm"
            >
              ✕ Cancel Subscription
            </button>
          )}
        </div>
      </motion.div>

      {/* Features Breakdown */}
      {billing.currentPlan && (
        <motion.div
          className="p-6 rounded-lg bg-slate-800/40 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {billing.currentPlan.features
              .filter((f) => f.included)
              .map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm">{feature.name}</p>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderInvoicesTab = () => (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {billingStore.invoices.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-400">No invoices yet</p>
        </div>
      ) : (
        billingStore.invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 flex items-center justify-between hover:border-slate-600 transition"
          >
            <div className="flex-1">
              <p className="font-medium text-white">{invoice.invoiceNumber}</p>
              <p className="text-sm text-slate-400">
                {new Date(invoice.issueDate).toLocaleDateString()} • ${invoice.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  invoice.status === 'paid'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
              {invoice.pdfUrl && (
                <a
                  href={invoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );

  const renderPaymentMethodsTab = () => (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {billingStore.paymentMethods.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-400 mb-4">No payment methods saved</p>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
            Add Payment Method
          </button>
        </div>
      ) : (
        billingStore.paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border transition ${
              method.isDefault
                ? 'bg-cyan-500/10 border-cyan-400'
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {method.cardBrand && (
                  <span className="font-medium text-white">
                    {method.cardBrand} •••• {method.cardLast4}
                  </span>
                )}
                {method.type === 'bank_transfer' && (
                  <span className="font-medium text-white">
                    {method.bankName} •••• {method.accountLast4}
                  </span>
                )}
              </div>
              {method.isDefault && (
                <span className="text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            {method.expiryDate && (
              <p className="text-xs text-slate-400">Expires: {method.expiryDate}</p>
            )}
          </div>
        ))
      )}
    </motion.div>
  );

  const renderSettingsTab = () => (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Billing Frequency */}
      <div className="p-6 rounded-lg bg-slate-800/40 border border-slate-700">
        <h3 className="font-semibold text-white mb-4">Billing Frequency</h3>
        <div className="flex gap-3">
          <button className="flex-1 p-3 rounded-lg bg-cyan-600 text-white font-medium text-sm">
            Monthly
          </button>
          <button className="flex-1 p-3 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition font-medium text-sm">
            Annual
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Save 16% when switching to annual billing
        </p>
      </div>

      {/* Auto-Renewal */}
      <div className="p-6 rounded-lg bg-slate-800/40 border border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Auto-Renewal</h3>
          <p className="text-sm text-slate-400 mt-1">
            Your subscription will automatically renew
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600" />
        </label>
      </div>

      {/* Email Preferences */}
      <div className="p-6 rounded-lg bg-slate-800/40 border border-slate-700">
        <h3 className="font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Billing reminders', checked: true },
            { label: 'Payment receipts', checked: true },
            { label: 'Plan upgrades', checked: false },
            { label: 'Marketing emails', checked: false },
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-600"
              />
              <span className="text-sm text-slate-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Subscription & Billing</h1>
          <p className="text-slate-400">Manage your plan, payment methods, and billing settings</p>

          {billing.error && (
            <motion.div
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {billing.error}
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <div className="flex gap-8 overflow-x-auto">
            {(['overview', 'invoices', 'payment-methods', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 transition font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'invoices' && '📄 Invoices'}
                {tab === 'payment-methods' && '💳 Payment Methods'}
                {tab === 'settings' && '⚙️ Settings'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <div key="overview">{renderOverviewTab()}</div>}
          {activeTab === 'invoices' && <div key="invoices">{renderInvoicesTab()}</div>}
          {activeTab === 'payment-methods' && (
            <div key="payment-methods">{renderPaymentMethodsTab()}</div>
          )}
          {activeTab === 'settings' && <div key="settings">{renderSettingsTab()}</div>}
        </AnimatePresence>

        {/* Cancel Dialog */}
        <AnimatePresence>
          {showCancelDialog && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-900 border border-red-500/50 rounded-lg p-8 max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h2>
                <p className="text-slate-300 mb-4">
                  We're sad to see you go. Please let us know why you're cancelling so we can
                  improve.
                </p>

                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none mb-4 resize-none"
                  rows={4}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelDialog(false);
                      setCancellationReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium"
                  >
                    Keep Plan
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={billing.isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {billing.isLoading ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubscriptionDashboard;