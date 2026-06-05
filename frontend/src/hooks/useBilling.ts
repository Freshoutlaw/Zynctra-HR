/**
 * /frontend/src/hooks/useBilling.ts
 *
 * Complete billing and subscription management hook.
 * Fixed: proper function-vs-value distinction, getCsrfToken imported
 * from AuthContext (not duplicated), store typing aligned.
 */

import { useCallback, useEffect, useState } from 'react';
import useBillingStore from '../stores/billingStore';
import {
  SubscriptionPlan,
  BillingPeriod,
  PaymentStatus,
  Subscription,
  Invoice,
  PlanConfig,
} from '../types/billing.types';
import { getPaymentGateway } from '../services/payment/paymentGateway';
import {
  getFeatureFlagService,
  FeatureAccessManager,
} from '../services/billing/featureFlags';
import { useAuth } from './useAuth';
import { getCsrfToken } from '../context/AuthContext';

// ---------------------------------------------------------------------------

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

interface UseBillingReturn {
  subscription: Subscription | null;
  currentPlan: PlanConfig | null;
  isSubscriptionActive: boolean;
  isTrialActive: boolean;
  daysUntilRenewal: number;

  canAccessFeature: (featureId: string) => boolean;
  getLockedFeatures: () => string[];
  canUpgrade: () => boolean;
  canDowngrade: () => boolean;

  upgradePlan: (newPlan: SubscriptionPlan, billingPeriod: BillingPeriod) => Promise<void>;
  downgradePlan: (newPlan: SubscriptionPlan) => Promise<void>;
  changeBillingPeriod: (period: BillingPeriod) => Promise<void>;
  cancelSubscription: (reason: string) => Promise<void>;
  renewSubscription: () => Promise<void>;

  initiateCheckout: (plan: SubscriptionPlan, period: BillingPeriod) => Promise<void>;
  verifyPayment: (reference: string) => Promise<PaymentStatus>;
  getPaymentHistory: () => Invoice[];
  retryFailedPayment: (paymentId: string) => Promise<void>;

  getNextBillingAmount: () => number;
  getNextBillingDate: () => Date | null;
  getBillingStatus: () => string;

  isMonetizationEnabled: () => boolean;
  isFreeModeActive: boolean;
  shouldShowUpgradePrompt: () => boolean;

  isLoading: boolean;
  error: string | null;
  lastPaymentStatus: PaymentStatus | null;
}

// ---------------------------------------------------------------------------

export const useBilling = (): UseBillingReturn => {
  const { user } = useAuth();
  const billingStore = useBillingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flags = getFeatureFlagService();

  // Load subscription data on mount / user change
  useEffect(() => {
    if (!user?.id) return;
    void loadSubscriptionData();
  }, [user?.id]);

  const loadSubscriptionData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/billing/subscription`, {
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() },
      });
      if (!res.ok) throw new Error('Failed to load subscription');
      const data = (await res.json()) as { subscription: Subscription };
      billingStore.setSubscription(data.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // -------------------------------------------------------------------------
  // Derived values (computed, not callbacks)
  // -------------------------------------------------------------------------

  const isSubscriptionActive = (() => {
    const sub = billingStore.currentSubscription;
    if (!sub) return false;
    return sub.status === 'active' && new Date(sub.endDate) > new Date();
  })();

  const isTrialActive = (() => {
    const sub = billingStore.currentSubscription;
    if (!sub?.trialEndDate) return false;
    return new Date(sub.trialEndDate) > new Date() && sub.isTrialActive;
  })();

  const daysUntilRenewal = (() => {
    const sub = billingStore.currentSubscription;
    if (!sub) return 0;
    const diff = new Date(sub.renewalDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------

  const canAccessFeature = useCallback(
    (featureId: string): boolean => {
      if (flags.isFreeModeActive()) return true;
      const planId = billingStore.currentPlan?.id ?? SubscriptionPlan.FREE;
      return FeatureAccessManager.canAccessFeature(featureId, planId);
    },
    [billingStore.currentPlan, flags]
  );

  const getLockedFeatures = useCallback((): string[] => {
    const planId = billingStore.currentPlan?.id ?? SubscriptionPlan.FREE;
    return FeatureAccessManager.getLockedFeatures(planId);
  }, [billingStore.currentPlan]);

  const initiateCheckout = useCallback(
    async (plan: SubscriptionPlan, period: BillingPeriod): Promise<void> => {
      if (!user?.email) { setError('User email not found'); return; }
      setIsLoading(true);
      setError(null);
      try {
        const gateway = getPaymentGateway();
        const planConfig = billingStore.availablePlans.find((p) => p.id === plan);
        if (!planConfig) throw new Error('Plan not found');

        const amount =
          period === BillingPeriod.MONTHLY
            ? planConfig.monthlyPrice
            : planConfig.annualPrice;

        const { authorizationUrl, reference } = await gateway.initializePayment({
          amount,
          email: user.email,
          currency: planConfig.currency,
          metadata: {
            organizationId: user.id,
            planId: plan,
            billingPeriod: period,
            userId: user.id,
          },
        });

        sessionStorage.setItem('paymentReference', reference);
        sessionStorage.setItem('planId', plan);
        sessionStorage.setItem('billingPeriod', period);
        window.location.href = authorizationUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed');
      } finally {
        setIsLoading(false);
      }
    },
    [user, billingStore.availablePlans]
  );

  const verifyPayment = useCallback(
    async (reference: string): Promise<PaymentStatus> => {
      setIsLoading(true);
      setError(null);
      try {
        const gateway = getPaymentGateway();
        const response = await gateway.verifyPayment(reference);

        if (response.status && response.data.status === 'success') {
          const updateRes = await fetch(`${API_BASE}/billing/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': getCsrfToken(),
            },
            credentials: 'include',
            body: JSON.stringify({ reference, metadata: response.data.metadata }),
          });
          if (!updateRes.ok) throw new Error('Failed to finalise subscription');
          await loadSubscriptionData();
          billingStore.setLastPaymentStatus(PaymentStatus.COMPLETED);
          return PaymentStatus.COMPLETED;
        }
        billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
        return PaymentStatus.FAILED;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
        billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
        return PaymentStatus.FAILED;
      } finally {
        setIsLoading(false);
      }
    },
    [loadSubscriptionData]
  );

  const upgradePlan = useCallback(
    async (newPlan: SubscriptionPlan, period: BillingPeriod): Promise<void> => {
      await initiateCheckout(newPlan, period);
    },
    [initiateCheckout]
  );

  const downgradePlan = useCallback(
    async (newPlan: SubscriptionPlan): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/billing/downgrade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ newPlan, effectiveDate: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error('Failed to downgrade plan');
        await loadSubscriptionData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Downgrade failed');
      } finally {
        setIsLoading(false);
      }
    },
    [loadSubscriptionData]
  );

  const changeBillingPeriod = useCallback(
    async (period: BillingPeriod): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/billing/change-period`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ newPeriod: period, effectiveDate: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error('Failed to change billing period');
        await loadSubscriptionData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Change failed');
      } finally {
        setIsLoading(false);
      }
    },
    [loadSubscriptionData]
  );

  const cancelSubscription = useCallback(
    async (reason: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/billing/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ reason, effectiveDate: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error('Failed to cancel subscription');
        await loadSubscriptionData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Cancellation failed');
      } finally {
        setIsLoading(false);
      }
    },
    [loadSubscriptionData]
  );

  const renewSubscription = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/billing/renew`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': getCsrfToken() },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to renew subscription');
      await loadSubscriptionData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Renewal failed');
    } finally {
      setIsLoading(false);
    }
  }, [loadSubscriptionData]);

  const getBillingStatus = useCallback((): string => {
    const sub = billingStore.currentSubscription;
    if (!sub) return 'No active subscription';
    if (isTrialActive) return `Trial active (${daysUntilRenewal} days remaining)`;
    if (isSubscriptionActive) return `Active — Renews in ${daysUntilRenewal} days`;
    if (sub.status === 'cancelled') return 'Cancelled';
    if (sub.status === 'expired') return 'Expired';
    return sub.status;
  }, [billingStore.currentSubscription, isTrialActive, isSubscriptionActive, daysUntilRenewal]);

  return {
    subscription: billingStore.currentSubscription,
    currentPlan: billingStore.currentPlan,
    isSubscriptionActive,
    isTrialActive,
    daysUntilRenewal,

    canAccessFeature,
    getLockedFeatures,
    canUpgrade: () => flags.canUpgrade(),
    canDowngrade: () => flags.canDowngrade(),

    upgradePlan,
    downgradePlan,
    changeBillingPeriod,
    cancelSubscription,
    renewSubscription,

    initiateCheckout,
    verifyPayment,
    getPaymentHistory: () => billingStore.invoices,
    retryFailedPayment: async (_paymentId: string) => {
      // TODO: implement retry via gateway
    },

    getNextBillingAmount: () => billingStore.getNextBillingAmount(),
    getNextBillingDate: () =>
      billingStore.currentSubscription?.renewalDate
        ? new Date(billingStore.currentSubscription.renewalDate)
        : null,
    getBillingStatus,

    isMonetizationEnabled: () => flags.isMonetizationEnabled(),
    isFreeModeActive: flags.isFreeModeActive(),
    shouldShowUpgradePrompt: () =>
      flags.isMonetizationEnabled() &&
      billingStore.currentPlan?.id === SubscriptionPlan.FREE,

    isLoading,
    error,
    lastPaymentStatus: billingStore.lastPaymentStatus,
  };
};

export default useBilling;