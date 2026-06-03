/**
 * /frontend/src/pages/PricingPage.tsx
 * 
 * Complete pricing page with plan comparison
 * Supports free mode toggle, feature comparison, and plan selection
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useBilling from '../hooks/useBilling';
import useBillingStore from '../stores/billingStore';
import { SubscriptionPlan, BillingPeriod } from '../types/billing.types';
import { getFeatureFlagService } from '../services/billing/featureFlags';

/**
 * Props for plan card component
 */
interface PlanCardProps {
  plan: any;
  isCurrentPlan: boolean;
  onSelectPlan: (plan: SubscriptionPlan, period: BillingPeriod) => void;
  isLoading: boolean;
}

/**
 * Plan Card Component
 */
const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  onSelectPlan,
  isLoading,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(BillingPeriod.MONTHLY);
  const flags = getFeatureFlagService();

  const getPrice = () => {
    return billingPeriod === BillingPeriod.MONTHLY
      ? plan.monthlyPrice
      : plan.annualPrice;
  };

  const getSavings = () => {
    if (billingPeriod === BillingPeriod.ANNUAL && plan.annualPrice > 0) {
      const monthly = plan.monthlyPrice * 12;
      const savings = monthly - plan.annualPrice;
      const percentage = ((savings / monthly) * 100).toFixed(0);
      return { savings, percentage };
    }
    return null;
  };

  const savings = getSavings();

  return (
    <motion.div
      className={`relative rounded-lg border-2 p-8 transition-all duration-300 ${
        isCurrentPlan
          ? 'border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900 scale-105 shadow-2xl shadow-cyan-500/20'
          : 'border-slate-700 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={!isCurrentPlan ? { y: -8 } : {}}
    >
      {/* Popular Badge */}
      {plan.id === SubscriptionPlan.PREMIUM && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold text-sm rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Most Popular
        </motion.div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="mb-4 inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-semibold rounded-full">
          ✓ Current Plan
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.displayName}</h3>
      <p className="text-slate-400 text-sm mb-6">{plan.recommendedFor}</p>

      {/* Pricing */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl font-bold text-white">${getPrice()}</span>
          <span className="text-slate-400">
            /{billingPeriod === BillingPeriod.MONTHLY ? 'mo' : 'yr'}
          </span>
        </div>

        {savings && (
          <p className="text-xs text-cyan-400">
            Save {savings.percentage}% with annual billing
          </p>
        )}

        <p className="text-xs text-slate-500 mt-2">{plan.currency}</p>
      </div>

      {/* Billing Period Toggle */}
      {plan.monthlyPrice > 0 && (
        <div className="mb-8 flex gap-2 bg-slate-700/50 p-1 rounded-lg">
          <button
            onClick={() => setBillingPeriod(BillingPeriod.MONTHLY)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              billingPeriod === BillingPeriod.MONTHLY
                ? 'bg-cyan-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod(BillingPeriod.ANNUAL)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              billingPeriod === BillingPeriod.ANNUAL
                ? 'bg-cyan-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Annual
          </button>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onSelectPlan(plan.id, billingPeriod)}
        disabled={isCurrentPlan || isLoading || (flags.isFreeModeActive() && plan.id !== SubscriptionPlan.FREE)}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-8 ${
          isCurrentPlan
            ? 'bg-slate-700 text-slate-400 cursor-default'
            : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {isCurrentPlan ? '✓ Current Plan' : 'Select Plan'}
      </button>

      {/* Features List */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Features</p>
        {plan.features.map((feature: any) => (
          <div key={feature.id} className="flex items-start gap-3">
            {feature.included ? (
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      {/* Plan Limits */}
      <div className="mt-8 pt-8 border-t border-slate-700 space-y-2">
        <div className="text-xs text-slate-400">
          <span className="font-semibold">Max Users:</span> {plan.maxUsers || '∞'}
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold">Storage:</span> {plan.storageGB}GB
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold">API Calls/Month:</span> {(plan.apiCallsPerMonth || 0).toLocaleString()}
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold">Support:</span> {plan.supportLevel}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * PricingPage Component
 */
const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const billing = useBilling();
  const billingStore = useBillingStore();
  const flags = getFeatureFlagService();
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    flags.initialize();
  }, []);

  const handleSelectPlan = async (plan: SubscriptionPlan, period: BillingPeriod) => {
    if (plan === billing.currentPlan?.id) {
      return; // Already on this plan
    }

    try {
      await billing.initiateCheckout(plan, period);
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
    }
  };

  const currentPlanId = billing.currentPlan?.id || SubscriptionPlan.FREE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your organization. All plans include a 14-day free trial.
          </p>

          {/* Free Mode Indicator */}
          {flags.isFreeModeActive() && (
            <motion.div
              className="inline-block px-4 py-2 bg-green-500/20 border border-green-400 text-green-300 rounded-lg text-sm font-semibold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🎉 Free Mode Active - All features available
            </motion.div>
          )}

          {!flags.isFreeModeActive() && (
            <motion.div
              className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-lg text-sm font-semibold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              💳 Billing Active
            </motion.div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {billingStore.availablePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlanId === plan.id}
              onSelectPlan={handleSelectPlan}
              isLoading={billing.isLoading}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          className="mt-20 pt-12 border-t border-slate-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="mx-auto block mb-8 px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium"
          >
            {showComparison ? '▼ Hide' : '▶ Show'} Feature Comparison
          </button>

          {showComparison && (
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-4 font-semibold text-slate-300">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-300">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-300">Standard</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-300">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {billingStore.availablePlans[0]?.features.map((feature) => (
                    <tr key={feature.id} className="border-b border-slate-800">
                      <td className="py-4 px-4 text-slate-300">{feature.name}</td>
                      {billingStore.availablePlans.map((plan) => {
                        const planFeature = plan.features.find((f) => f.id === feature.id);
                        return (
                          <td key={`${plan.id}-${feature.id}`} className="text-center py-4 px-4">
                            {planFeature?.included ? (
                              <span className="text-cyan-400">✓</span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, bank transfers, and mobile wallets via Paystack.',
              },
              {
                q: 'Is there a contract?',
                a: 'No contracts. You can cancel anytime. If you cancel, your access ends at the end of your billing period.',
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Yes! Save up to 16% when you choose annual billing instead of monthly.',
              },
              {
                q: 'What happens if I exceed my limits?',
                a: 'We\'ll notify you before reaching limits. You can upgrade anytime to get higher limits.',
              },
              {
                q: 'Do you offer custom plans?',
                a: 'Yes! Contact our sales team for custom enterprise plans tailored to your needs.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg border border-slate-700 bg-slate-800/40"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-cyan-300 mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-300 mb-6">
            Need help choosing a plan? <span className="text-cyan-300">Contact our sales team</span>
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-medium"
          >
            Get in Touch
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;