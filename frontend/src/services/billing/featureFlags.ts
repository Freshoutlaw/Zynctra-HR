/**
 * /frontend/src/services/billing/featureFlags.ts
 *
 * Feature flag and monetisation configuration service.
 * Fixed: uses import.meta.env instead of process.env; no circular imports.
 */

import type {
  FeatureFlagConfig,
  MonetizationSettings,
} from '../../types/billing.types';
import { SubscriptionPlan, PaymentProvider } from '../../types/billing.types';

const DEFAULT_FLAGS: FeatureFlagConfig = {
  monetizationEnabled:
    (import.meta.env['VITE_MONETIZATION_ENABLED'] as string | undefined) === 'true',
  freeMode:
    (import.meta.env['VITE_FREE_MODE'] as string | undefined) !== 'false', // default true
  allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.STANDARD, SubscriptionPlan.PREMIUM],
  defaultPlan:
    ((import.meta.env['VITE_DEFAULT_PLAN'] as string | undefined) as SubscriptionPlan) ??
    SubscriptionPlan.FREE,
  trialDaysCount: parseInt(
    (import.meta.env['VITE_TRIAL_DAYS'] as string | undefined) ?? '14',
    10
  ),
  primaryPaymentProvider:
    ((import.meta.env['VITE_PAYMENT_PROVIDER'] as string | undefined) as PaymentProvider) ??
    PaymentProvider.PAYSTACK,
  currencies: (
    (import.meta.env['VITE_CURRENCIES'] as string | undefined) ?? 'USD,NGN,EUR'
  ).split(','),
  requirePaymentMethod:
    (import.meta.env['VITE_REQUIRE_PAYMENT_METHOD'] as string | undefined) === 'true',
};

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

// ---------------------------------------------------------------------------

export class FeatureFlagService {
  private flags: FeatureFlagConfig = { ...DEFAULT_FLAGS };
  private monetizationSettings: MonetizationSettings | null = null;
  private initialised = false;

  async initialize(): Promise<void> {
    if (this.initialised) return;
    try {
      const res = await fetch(`${API_BASE}/admin/billing-config`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = (await res.json()) as {
          flags?: Partial<FeatureFlagConfig>;
          monetizationSettings?: MonetizationSettings;
        };
        if (data.flags) this.flags = { ...this.flags, ...data.flags };
        if (data.monetizationSettings)
          this.monetizationSettings = data.monetizationSettings;
      }
    } catch {
      // Use defaults when server unreachable
    } finally {
      this.initialised = true;
    }
  }

  isMonetizationEnabled(): boolean {
    return this.flags.monetizationEnabled && !this.flags.freeMode;
  }

  isFreeModeActive(): boolean {
    return this.flags.freeMode;
  }

  isPlanAllowed(plan: SubscriptionPlan): boolean {
    return this.flags.allowedPlans.includes(plan);
  }

  getDefaultPlan(): SubscriptionPlan {
    return this.flags.defaultPlan;
  }

  getTrialDays(): number {
    return this.flags.trialDaysCount;
  }

  getPrimaryPaymentProvider(): PaymentProvider {
    return this.flags.primaryPaymentProvider;
  }

  getAllowedCurrencies(): string[] {
    return this.flags.currencies;
  }

  isPaymentMethodRequired(): boolean {
    return this.flags.requirePaymentMethod;
  }

  shouldEnforceBilling(): boolean {
    return this.isMonetizationEnabled() && !this.isFreeModeActive();
  }

  getFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }

  getMonetizationSettings(): MonetizationSettings | null {
    return this.monetizationSettings
      ? { ...this.monetizationSettings }
      : null;
  }

  canChangePlan(): boolean {
    return !this.isFreeModeActive();
  }

  canDowngrade(): boolean {
    return (
      !this.isFreeModeActive() &&
      this.monetizationSettings?.allowDowngrade !== false
    );
  }

  canUpgrade(): boolean {
    return !this.isFreeModeActive();
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let instance: FeatureFlagService | null = null;

export const getFeatureFlagService = (): FeatureFlagService => {
  if (!instance) instance = new FeatureFlagService();
  return instance;
};

export const useFeatureFlags = (): FeatureFlagService =>
  getFeatureFlagService();

// ---------------------------------------------------------------------------
// Static feature-access helper
// ---------------------------------------------------------------------------

const PREMIUM_FEATURES = new Set([
  'advanced_analytics',
  'ai_copilot',
  'payroll_tools',
  'compliance_tools',
  'audit_tools',
  'priority_support',
  'sso',
  'advanced_integrations',
]);

const STANDARD_FEATURES = new Set([
  'automation',
  'basic_ai',
  'advanced_reporting',
]);

export class FeatureAccessManager {
  static canAccessFeature(
    feature: string,
    userPlan: SubscriptionPlan
  ): boolean {
    if (userPlan === SubscriptionPlan.PREMIUM) return true;
    if (userPlan === SubscriptionPlan.STANDARD)
      return !PREMIUM_FEATURES.has(feature);
    // FREE
    return !PREMIUM_FEATURES.has(feature) && !STANDARD_FEATURES.has(feature);
  }

  static getLockedFeatures(plan: SubscriptionPlan): string[] {
    const all = [...PREMIUM_FEATURES, ...STANDARD_FEATURES];
    return all.filter((f) => !this.canAccessFeature(f, plan));
  }

  static getMinimumPlanForFeature(feature: string): SubscriptionPlan {
    if (PREMIUM_FEATURES.has(feature)) return SubscriptionPlan.PREMIUM;
    if (STANDARD_FEATURES.has(feature)) return SubscriptionPlan.STANDARD;
    return SubscriptionPlan.FREE;
  }
}

export default { getFeatureFlagService, useFeatureFlags, FeatureAccessManager };