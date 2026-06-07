/**
 * /frontend/src/hooks/useFeatureAccess.ts
 *
 * Hook for checking feature accessibility based on subscription plan.
 */

import useBilling from './useBilling';
import type { SubscriptionPlan } from '../types/billing.types';
import { FeatureAccessManager } from '../services/billing/featureFlags';

export interface FeatureAccessResult {
  canAccess: boolean;
  requiredPlan: SubscriptionPlan;
  isLocked: boolean;
  shouldShowUpgradePrompt: boolean;
}

export const useFeatureAccess = (featureId: string): FeatureAccessResult => {
  const { currentPlan, isFreeModeActive } = useBilling();
  const currentPlanId = currentPlan?.id ?? SubscriptionPlan.FREE;

  const accessible = isFreeModeActive
    ? true
    : FeatureAccessManager.canAccessFeature(featureId, currentPlanId);

  const requiredPlan = FeatureAccessManager.getMinimumPlanForFeature(featureId);

  return {
    canAccess: accessible,
    requiredPlan,
    isLocked: !accessible,
    shouldShowUpgradePrompt: !accessible && !isFreeModeActive,
  };
};

/**
 * Check multiple features at once.
 */
export const useMultipleFeatureAccess = (featureIds: string[]) => {
  const { currentPlan, isFreeModeActive } = useBilling();
  const currentPlanId = currentPlan?.id ?? SubscriptionPlan.FREE;

  return featureIds.map((featureId) => ({
    featureId,
    canAccess:
      isFreeModeActive ||
      FeatureAccessManager.canAccessFeature(featureId, currentPlanId),
    requiredPlan: FeatureAccessManager.getMinimumPlanForFeature(featureId),
  }));
};

/**
 * Return all locked features for the current plan.
 */
export const useLockedFeatures = (): string[] => {
  const { currentPlan, isFreeModeActive } = useBilling();
  if (isFreeModeActive) return [];
  return FeatureAccessManager.getLockedFeatures(
    currentPlan?.id ?? SubscriptionPlan.FREE
  );
};

export default useFeatureAccess;