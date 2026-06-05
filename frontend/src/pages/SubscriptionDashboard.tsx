/**
 * /frontend/src/pages/SubscriptionDashboard.tsx
 *
 * Subscription and billing management dashboard.
 * Fixed: all useBilling return values used correctly (isFreeModeActive is boolean);
 * getNextBillingDate() returns Date|null; proper null checks throughout.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useBilling from '../hooks/useBilling';
import useBillingStore from '../stores/billingStore';
import { SubscriptionPlan, BillingPeriod } from '../types/billing.types';
import { getFeatureFlagService } from '../services/billing/featureFlags';
import { useTheme } from '../context/ThemeContext';
import AppLayout from '../components/layout/AppLayout';

type Tab = 'overview' | 'invoices' | 'payment-methods' | 'settings';

const flags = getFeatureFlagService();

const SubscriptionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const billing = useBilling();
  const billingStore = useBillingStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => { void flags.initialize(); }, []);

  const nextBillingDate = billing.getNextBillingDate();
  const nextAmount = billing.getNextBillingAmount();

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    await billing.cancelSubscription(cancelReason);
    setShowCancelDialog(false);
    setCancelReason('');
  };

  const sectionCard = `rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`;

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Current plan */}
      <div className={`${sectionCard} bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900 border-cyan-500/30' : 'from-white to-cyan-50 border-cyan-200'}`}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Plan</p>
            <h2 className="text-2xl font-bold">
              {billing.currentPlan?.displayName ?? 'No Plan'}
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {billing.getBillingStatus()}
            </p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${
            billing.isSubscriptionActive
              ? 'bg-green-500/20 text-green-300 border-green-400/50'
              : 'bg-slate-500/20 text-slate-300 border-slate-400/50'
          }`}>
            {billing.isSubscriptionActive ? '● Active' : '○ Inactive'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
          <div>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Monthly Cost</p>
            <p className="text-xl font-bold text-cyan-400">
              ${billing.currentPlan?.monthlyPrice ?? 0}/mo
            </p>
          </div>
          <div>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Next Billing</p>
            <p className="text-xl font-bold">
              {nextBillingDate ? nextBillingDate.toLocaleDateString() : '—'}
            </p>
          </div>
          <div>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days Remaining</p>
            <p className="text-xl font-bold">{billing.daysUntilRenewal}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {billing.canUpgrade() && billing.currentPlan?.id !== SubscriptionPlan.PREMIUM && (
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm"
            >
              ⬆ Upgrade Plan
            </button>
          )}
          {billing.canDowngrade() && billing.currentPlan?.id !== SubscriptionPlan.FREE && (
            <button
              onClick={() => navigate('/pricing')}
              className={`px-4 py-2 rounded-lg border font-medium text-sm transition ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            >
              ⬇ Downgrade
            </button>
          )}
          {billing.isSubscriptionActive && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition font-medium text-sm"
            >
              ✕ Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      {billing.currentPlan && (
        <div className={sectionCard}>
          <h3 className="font-semibold mb-4">Included Features</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {billing.currentPlan.features
              .filter((f) => f.included)
              .map((f) => (
                <div key={f.id} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const InvoicesTab = () => (
    <div className="space-y-3">
      {billingStore.invoices.length === 0 ? (
        <div className={`${sectionCard} text-center py-12`}>
          <p className="text-4xl mb-3">📄</p>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No invoices yet</p>
        </div>
      ) : (
        billingStore.invoices.map((inv) => (
          <div key={inv.id} className={`${sectionCard} flex items-center justify-between gap-4`}>
            <div>
              <p className="font-medium text-sm">{inv.invoiceNumber}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {new Date(inv.issueDate).toLocaleDateString()} — ${inv.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {inv.status}
              </span>
              {inv.pdfUrl && (
                <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  ↓ PDF
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const PaymentMethodsTab = () => (
    <div className="space-y-4">
      {billingStore.paymentMethods.length === 0 ? (
        <div className={`${sectionCard} text-center py-12`}>
          <p className="text-4xl mb-3">💳</p>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No payment methods saved</p>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
            Add Payment Method
          </button>
        </div>
      ) : (
        billingStore.paymentMethods.map((pm) => (
          <div key={pm.id} className={`${sectionCard} flex items-center justify-between ${pm.isDefault ? 'border-cyan-400' : ''}`}>
            <div>
              {pm.cardBrand && (
                <p className="font-medium">{pm.cardBrand} •••• {pm.cardLast4}</p>
              )}
              {pm.expiryDate && (
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expires: {pm.expiryDate}</p>
              )}
            </div>
            {pm.isDefault && (
              <span className="text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded">Default</span>
            )}
          </div>
        ))
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-5">
      <div className={`${sectionCard} flex items-center justify-between`}>
        <div>
          <p className="font-semibold">Billing Frequency</p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Switch between monthly and annual billing
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void billing.changeBillingPeriod(BillingPeriod.MONTHLY)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${billing.subscription?.billingPeriod === BillingPeriod.MONTHLY ? 'bg-cyan-600 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => void billing.changeBillingPeriod(BillingPeriod.ANNUAL)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${billing.subscription?.billingPeriod === BillingPeriod.ANNUAL ? 'bg-cyan-600 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            Annual (save 16%)
          </button>
        </div>
      </div>

      <div className={`${sectionCard} flex items-center justify-between`}>
        <div>
          <p className="font-semibold">Auto-Renewal</p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Automatically renew your subscription
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-600 peer-checked:bg-cyan-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'invoices', label: '📄 Invoices' },
    { id: 'payment-methods', label: '💳 Payment Methods' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <AppLayout showSidebar showFooter={false}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Subscription & Billing</h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Manage your plan, payment methods, and billing settings.
        </p>
        {billing.error && (
          <div className={`mt-4 p-3 rounded-lg border text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
            {billing.error}
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className={`border-b mb-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'invoices' && <InvoicesTab />}
          {activeTab === 'payment-methods' && <PaymentMethodsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>

      {/* Cancel dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`p-8 rounded-xl border max-w-md w-full ${isDark ? 'bg-slate-900 border-red-500/50' : 'bg-white border-red-300'}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h2 className="text-xl font-bold mb-3">Cancel Subscription?</h2>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Please share why you're cancelling so we can improve.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Your feedback…"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300'}`}
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowCancelDialog(false); setCancelReason(''); }} className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
                  Keep Plan
                </button>
                <button onClick={handleCancel} disabled={billing.isLoading || !cancelReason.trim()} className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  {billing.isLoading ? 'Cancelling…' : 'Cancel Plan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default SubscriptionDashboard;