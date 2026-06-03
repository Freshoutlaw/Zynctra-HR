/**
 * /frontend/src/hooks/useBilling.ts
 * 
 * Complete billing and subscription management hook
 * Handles subscriptions, payments, feature access, and plan management
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface UseBillingReturn {
  // Subscription state
  subscription: Subscription | null;
  currentPlan: PlanConfig | null;
  isSubscriptionActive: boolean;
  isTrialActive: boolean;
  daysUntilRenewal: number;

  // Feature access
  canAccessFeature: (featureId: string) => boolean;
  getLockedFeatures: () => string[];
  canUpgrade: () => boolean;
  canDowngrade: () => boolean;

  // Plan management
  upgradePlan: (newPlan: SubscriptionPlan, billingPeriod: BillingPeriod) => Promise<void>;
  downgradePlan: (newPlan: SubscriptionPlan) => Promise<void>;
  changeBillingPeriod: (period: BillingPeriod) => Promise<void>;
  cancelSubscription: (reason: string) => Promise<void>;
  renewSubscription: () => Promise<void>;

  // Payment
  initiateCheckout: (plan: SubscriptionPlan, period: BillingPeriod) => Promise<void>;
  verifyPayment: (reference: string) => Promise<PaymentStatus>;
  getPaymentHistory: () => Invoice[];
  retryFailedPayment: (paymentId: string) => Promise<void>;

  // Billing info
  getNextBillingAmount: () => number;
  getNextBillingDate: () => Date | null;
  getBillingStatus: () => string;

  // Monetization
  isMonetizationEnabled: () => boolean;
  isFreeModeActive: () => boolean;
  shouldShowUpgradePrompt: () => boolean;

  // State
  isLoading: boolean;
  error: string | null;
  lastPaymentStatus: PaymentStatus | null;
}

/**
 * useBilling Hook
 * Main hook for all billing and subscription functionality
 */
export const useBilling = (): UseBillingReturn => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const billingStore = useBillingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const flags = getFeatureFlagService();

  /**
   * Load subscription data on mount
   */
  useEffect(() => {
    loadSubscriptionData();
  }, [user?.id]);

  /**
   * Load subscription from backend
   */
  const loadSubscriptionData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/billing/subscription`,
        {
          credentials: 'include',
          headers: {
            'X-CSRF-Token': getCsrfToken(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load subscription');
      }

      const data = await response.json();
      billingStore.setSubscription(data.subscription);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load subscription:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, billingStore]);

  /**
   * Check if subscription is active
   */
  const isSubscriptionActive = useCallback(() => {
    const subscription = billingStore.currentSubscription;
    if (!subscription) return false;

    return (
      subscription.status === 'active' &&
      new Date(subscription.endDate) > new Date()
    );
  }, [billingStore.currentSubscription]);

  /**
   * Check if trial is active
   */
  const isTrialActive = useCallback(() => {
    const subscription = billingStore.currentSubscription;
    if (!subscription || !subscription.trialEndDate) return false;

    return (
      new Date(subscription.trialEndDate) > new Date() &&
      subscription.isTrialActive
    );
  }, [billingStore.currentSubscription]);

  /**
   * Calculate days until renewal
   */
  const daysUntilRenewal = useCallback(() => {
    const subscription = billingStore.currentSubscription;
    if (!subscription) return 0;

    const renewalDate = new Date(subscription.renewalDate);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }, [billingStore.currentSubscription]);

  /**
   * Check if a feature is accessible
   */
  const canAccessFeature = useCallback(
    (featureId: string): boolean => {
      if (flags.isFreeModeActive()) return true;

      const currentPlan = billingStore.currentPlan?.id || SubscriptionPlan.FREE;
      return FeatureAccessManager.canAccessFeature(featureId, currentPlan);
    },
    [billingStore.currentPlan, flags]
  );

  /**
   * Get locked features for current plan
   */
  const getLockedFeatures = useCallback((): string[] => {
    const currentPlan = billingStore.currentPlan?.id || SubscriptionPlan.FREE;
    return FeatureAccessManager.getLockedFeatures(currentPlan);
  }, [billingStore.currentPlan]);

  /**
   * Initiate checkout flow
   */
  const initiateCheckout = useCallback(
    async (plan: SubscriptionPlan, period: BillingPeriod) => {
      if (!user?.email) {
        setError('User email not found');
        return;
      }

      setProcessingCheckout(true);
      setError(null);

      try {
        const gateway = getPaymentGateway();
        const planConfig = billingStore.availablePlans.find((p) => p.id === plan);

        if (!planConfig) {
          throw new Error('Plan not found');
        }

        const amount =
          period === BillingPeriod.MONTHLY
            ? planConfig.monthlyPrice
            : planConfig.annualPrice;

        const paymentRequest = {
          amount,
          email: user.email,
          currency: planConfig.currency,
          metadata: {
            organizationId: user.id, // Use user/org ID
            planId: plan,
            billingPeriod: period,
            userId: user.id,
          },
        };

        const { authorizationUrl, reference } =
          await gateway.initializePayment(paymentRequest);

        // Store reference in session for verification
        sessionStorage.setItem('paymentReference', reference);
        sessionStorage.setItem('planId', plan);
        sessionStorage.setItem('billingPeriod', period);

        // Redirect to Paystack checkout
        window.location.href = authorizationUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Checkout failed';
        setError(message);
        console.error('Checkout error:', err);
      } finally {
        setProcessingCheckout(false);
      }
    },
    [user, billingStore.availablePlans]
  );

  /**
   * Verify payment after return from Paystack
   */
  const verifyPayment = useCallback(
    async (reference: string): Promise<PaymentStatus> => {
      setIsLoading(true);
      setError(null);

      try {
        const gateway = getPaymentGateway();
        const response = await gateway.verifyPayment(reference);

        if (response.status && response.data.status === 'success') {
          // Call backend to finalize subscription
          const updateResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/billing/verify-payment`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken(),
              },
              credentials: 'include',
              body: JSON.stringify({
                reference,
                metadata: response.data.metadata,
              }),
            }
          );

          if (!updateResponse.ok) {
            throw new Error('Failed to finalize subscription');
          }

          await loadSubscriptionData();
          billingStore.setLastPaymentStatus(PaymentStatus.COMPLETED);

          return PaymentStatus.COMPLETED;
        }

        billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
        return PaymentStatus.FAILED;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Verification failed';
        setError(message);
        billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
        return PaymentStatus.FAILED;
      } finally {
        setIsLoading(false);
      }
    },
    [billingStore, loadSubscriptionData]
  );

  /**
   * Upgrade to a higher plan
   */
  const upgradePlan = useCallback(
    async (newPlan: SubscriptionPlan, period: BillingPeriod) => {
      if (!user?.id) {
        setError('User not found');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await initiateCheckout(newPlan, period);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upgrade failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, initiateCheckout]
  );

  /**
   * Downgrade to a lower plan
   */
  const downgradePlan = useCallback(
    async (newPlan: SubscriptionPlan) => {
      if (!user?.id) {
        setError('User not found');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/billing/downgrade`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': getCsrfToken(),
            },
            credentials: 'include',
            body: JSON.stringify({
              newPlan,
              effectiveDate: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to downgrade plan');
        }

        await loadSubscriptionData();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Downgrade failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, loadSubscriptionData]
  );

  /**
   * Change billing period (monthly to annual or vice versa)
   */
  const changeBillingPeriod = useCallback(
    async (period: BillingPeriod) => {
      if (!user?.id) {
        setError('User not found');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/billing/change-period`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': getCsrfToken(),
            },
            credentials: 'include',
            body: JSON.stringify({
              newPeriod: period,
              effectiveDate: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to change billing period');
        }

        await loadSubscriptionData();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Change failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, loadSubscriptionData]
  );

  /**
   * Cancel subscription
   */
  const cancelSubscription = useCallback(
    async (reason: string) => {
      if (!user?.id) {
        setError('User not found');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/billing/cancel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': getCsrfToken(),
            },
            credentials: 'include',
            body: JSON.stringify({
              reason,
              effectiveDate: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to cancel subscription');
        }

        await loadSubscriptionData();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Cancellation failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, loadSubscriptionData]
  );

  /**
   * Renew subscription
   */
  const renewSubscription = useCallback(async () => {
    if (!user?.id) {
      setError('User not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/billing/renew`,
        {
          method: 'POST',
          headers: {
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to renew subscription');
      }

      await loadSubscriptionData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Renewal failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, loadSubscriptionData]);

  /**
   * Get billing status text
   */
  const getBillingStatus = useCallback((): string => {
    const subscription = billingStore.currentSubscription;

    if (!subscription) {
      return 'No active subscription';
    }

    if (isTrialActive()) {
      return `Trial active (${daysUntilRenewal()} days remaining)`;
    }

    if (isSubscriptionActive()) {
      return `Active - Renews in ${daysUntilRenewal()} days`;
    }

    if (subscription.status === 'cancelled') {
      return 'Cancelled';
    }

    if (subscription.status === 'expired') {
      return 'Expired';
    }

    return subscription.status;
  }, [billingStore.currentSubscription, isTrialActive, daysUntilRenewal, isSubscriptionActive]);

  /**
   * Get CSRF token
   */
  const getCsrfToken = (): string => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || '';
    }
    return '';
  };

  return {
    // Subscription state
    subscription: billingStore.currentSubscription,
    currentPlan: billingStore.currentPlan,
    isSubscriptionActive: isSubscriptionActive(),
    isTrialActive: isTrialActive(),
    daysUntilRenewal: daysUntilRenewal(),

    // Feature access
    canAccessFeature,
    getLockedFeatures,
    canUpgrade: () => flags.canUpgrade(),
    canDowngrade: () => flags.canDowngrade(),

    // Plan management
    upgradePlan,
    downgradePlan,
    changeBillingPeriod,
    cancelSubscription,
    renewSubscription,

    // Payment
    initiateCheckout,
    verifyPayment,
    getPaymentHistory: () => billingStore.invoices,
    retryFailedPayment: async (paymentId: string) => {
      // Implementation for retry
    },

    // Billing info
    getNextBillingAmount: () => billingStore.getNextBillingAmount(),
    getNextBillingDate: () => billingStore.currentSubscription?.renewalDate || null,
    getBillingStatus,

    // Monetization
    isMonetizationEnabled: () => flags.isMonetizationEnabled(),
    isFreeModeActive: () => flags.isFreeModeActive(),
    shouldShowUpgradePrompt: () => {
      return (
        flags.isMonetizationEnabled() &&
        billingStore.currentPlan?.id === SubscriptionPlan.FREE
      );
    },

    // State
    isLoading,
    error,
    lastPaymentStatus: billingStore.lastPaymentStatus,
  };
};

export default useBilling;