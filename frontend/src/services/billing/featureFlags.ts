/**
 * /frontend/src/services/billing/featureFlags.ts
 * 
 * Feature flag and monetization configuration service
 * Controls billing system behavior, free mode, plan restrictions
 */

import {
  FeatureFlagConfig,
  SubscriptionPlan,
  PaymentProvider,
  MonetizationSettings,
} from '../../types/billing.types';

/**
 * Default feature flag configuration
 * These can be overridden by backend at runtime
 */
const DEFAULT_FLAGS: FeatureFlagConfig = {
  monetizationEnabled:
    process.env.REACT_APP_MONETIZATION_ENABLED === 'true' ?? false,
  freeMode: process.env.REACT_APP_FREE_MODE === 'true' ?? true,
  allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.STANDARD, SubscriptionPlan.PREMIUM],
  defaultPlan: (process.env.REACT_APP_DEFAULT_PLAN as SubscriptionPlan) ||
    SubscriptionPlan.FREE,
  trialDaysCount: parseInt(process.env.REACT_APP_TRIAL_DAYS || '14', 10),
  primaryPaymentProvider:
    (process.env.REACT_APP_PAYMENT_PROVIDER as PaymentProvider) ||
    PaymentProvider.PAYSTACK,
  currencies: (process.env.REACT_APP_CURRENCIES || 'USD,NGN,EUR').split(','),
  requirePaymentMethod:
    process.env.REACT_APP_REQUIRE_PAYMENT_METHOD === 'true' ?? false,
};

/**
 * Feature Flag Service
 * Manages access to billing features based on configuration and subscription
 */
export class FeatureFlagService {
  private flags: FeatureFlagConfig = { ...DEFAULT_FLAGS };
  private monetizationSettings: MonetizationSettings | null = null;

  /**
   * Initialize flags from backend
   * Allows runtime changes without redeployment
   */
  async initialize(): Promise<void> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/billing-config`,
        {
          credentials: 'include',
          headers: {
            'X-CSRF-Token': this.getCsrfToken(),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.flags = { ...this.flags, ...data.flags };
        this.monetizationSettings = data.monetizationSettings;
        console.log('[FeatureFlags] Loaded from server', this.flags);
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      // Fall back to defaults
    }
  }

  /**
   * Check if monetization is enabled
   */
  isMonetizationEnabled(): boolean {
    return this.flags.monetizationEnabled && !this.flags.freeMode;
  }

  /**
   * Check if free mode is active
   * When true: All features available, no payment required
   */
  isFreeModeActive(): boolean {
    return this.flags.freeMode;
  }

  /**
   * Check if a specific plan is allowed
   */
  isPlanAllowed(plan: SubscriptionPlan): boolean {
    return this.flags.allowedPlans.includes(plan);
  }

  /**
   * Get the default plan for new organizations
   */
  getDefaultPlan(): SubscriptionPlan {
    return this.flags.defaultPlan;
  }

  /**
   * Get trial period duration in days
   */
  getTrialDays(): number {
    return this.flags.trialDaysCount;
  }

  /**
   * Get primary payment provider
   */
  getPrimaryPaymentProvider(): PaymentProvider {
    return this.flags.primaryPaymentProvider;
  }

  /**
   * Get allowed currencies
   */
  getAllowedCurrencies(): string[] {
    return this.flags.currencies;
  }

  /**
   * Check if payment method is required on signup
   */
  isPaymentMethodRequired(): boolean {
    return this.flags.requirePaymentMethod;
  }

  /**
   * Check if billing should be enforced
   */
  shouldEnforceBilling(): boolean {
    return this.isMonetizationEnabled() && !this.isFreeModeActive();
  }

  /**
   * Get all current flags
   */
  getFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }

  /**
   * Get monetization settings
   */
  getMonetizationSettings(): MonetizationSettings | null {
    return this.monetizationSettings ? { ...this.monetizationSettings } : null;
  }

  /**
   * Check if plan changes are allowed
   */
  canChangePlan(): boolean {
    return !this.isFreeModeActive();
  }

  /**
   * Check if downgrades are allowed
   */
  canDowngrade(): boolean {
    return (
      !this.isFreeModeActive() &&
      this.monetizationSettings?.allowDowngrade !== false
    );
  }

  /**
   * Check if organization can upgrade
   */
  canUpgrade(): boolean {
    return !this.isFreeModeActive();
  }

  /**
   * Get CSRF token for API requests
   */
  private getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || '';
    }
    return '';
  }
}

/**
 * Singleton instance
 */
let instance: FeatureFlagService | null = null;

export const getFeatureFlagService = (): FeatureFlagService => {
  if (!instance) {
    instance = new FeatureFlagService();
  }
  return instance;
};

/**
 * Hook-compatible utility
 * Use in React components
 */
export const useFeatureFlags = () => {
  return getFeatureFlagService();
};

/**
 * Feature access checker
 * Used to protect premium features
 */
export class FeatureAccessManager {
  /**
   * Check if a feature is accessible based on subscription plan
   */
  static canAccessFeature(feature: string, userPlan: SubscriptionPlan): boolean {
    const premiumOnlyFeatures = [
      'advanced_analytics',
      'ai_copilot',
      'payroll_tools',
      'compliance_tools',
      'audit_tools',
      'priority_support',
      'sso',
      'advanced_integrations',
    ];

    const standardFeatures = [
      'core_hr',
      'ats',
      'attendance',
      'automation',
      'basic_ai',
      'reporting',
    ];

    if (userPlan === SubscriptionPlan.PREMIUM) {
      return true; // All features
    }

    if (userPlan === SubscriptionPlan.STANDARD) {
      return !premiumOnlyFeatures.includes(feature);
    }

    if (userPlan === SubscriptionPlan.FREE) {
      return standardFeatures.includes(feature);
    }

    return false;
  }

  /**
   * Get features locked for a plan
   */
  static getLockedFeatures(plan: SubscriptionPlan): string[] {
    if (plan === SubscriptionPlan.PREMIUM) {
      return [];
    }

    const premiumFeatures = [
      'advanced_analytics',
      'ai_copilot',
      'payroll_tools',
      'compliance_tools',
      'audit_tools',
      'priority_support',
      'sso',
      'advanced_integrations',
    ];

    if (plan === SubscriptionPlan.STANDARD) {
      return premiumFeatures;
    }

    if (plan === SubscriptionPlan.FREE) {
      return [
        ...premiumFeatures,
        'automation',
        'basic_ai',
        'advanced_reporting',
      ];
    }

    return [];
  }

  /**
   * Get the minimum plan required for a feature
   */
  static getMinimumPlanForFeature(feature: string): SubscriptionPlan {
    const premiumFeatures = [
      'advanced_analytics',
      'ai_copilot',
      'payroll_tools',
      'compliance_tools',
      'audit_tools',
      'sso',
      'advanced_integrations',
    ];

    const standardFeatures = ['automation', 'basic_ai', 'advanced_reporting'];

    if (premiumFeatures.includes(feature)) {
      return SubscriptionPlan.PREMIUM;
    }

    if (standardFeatures.includes(feature)) {
      return SubscriptionPlan.STANDARD;
    }

    return SubscriptionPlan.FREE;
  }
}

export default {
  getFeatureFlagService,
  useFeatureFlags,
  FeatureAccessManager,
};