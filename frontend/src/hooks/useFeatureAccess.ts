/**
 * /frontend/src/hooks/useFeatureAccess.ts
 * 
 * Hook for checking feature accessibility based on subscription
 * Shows upgrade prompts when features are locked
 */

import { useCallback } from 'react';
import useBilling from './useBilling';
import { SubscriptionPlan } from '../types/billing.types';
import { FeatureAccessManager } from '../services/billing/featureFlags';

interface FeatureAccessResult {
  canAccess: boolean;
  requiredPlan: SubscriptionPlan;
  isLocked: boolean;
  shouldShowUpgradePrompt: boolean;
}

/**
 * useFeatureAccess Hook
 */
export const useFeatureAccess = (featureId: string): FeatureAccessResult => {
  const { currentPlan, isFreeModeActive } = useBilling();
  const currentPlanId = currentPlan?.id || SubscriptionPlan.FREE;

  const canAccess = useCallback((): boolean => {
    // In free mode, everything is accessible
    if (isFreeModeActive) {
      return true;
    }

    // Check against current plan
    return FeatureAccessManager.canAccessFeature(featureId, currentPlanId);
  }, [featureId, currentPlanId, isFreeModeActive]);

  const getRequiredPlan = useCallback((): SubscriptionPlan => {
    return FeatureAccessManager.getMinimumPlanForFeature(featureId);
  }, [featureId]);

  return {
    canAccess: canAccess(),
    requiredPlan: getRequiredPlan(),
    isLocked: !canAccess(),
    shouldShowUpgradePrompt: !canAccess() && !isFreeModeActive,
  };
};

/**
 * Check multiple features at once
 */
export const useMultipleFeatureAccess = (featureIds: string[]) => {
  const { currentPlan, isFreeModeActive } = useBilling();
  const currentPlanId = currentPlan?.id || SubscriptionPlan.FREE;

  return featureIds.map((featureId) => ({
    featureId,
    canAccess: isFreeModeActive || FeatureAccessManager.canAccessFeature(featureId, currentPlanId),
    requiredPlan: FeatureAccessManager.getMinimumPlanForFeature(featureId),
  }));
};

/**
 * Get all locked features for current plan
 */
export const useLockedFeatures = () => {
  const { currentPlan, isFreeModeActive } = useBilling();
  const currentPlanId = currentPlan?.id || SubscriptionPlan.FREE;

  if (isFreeModeActive) {
    return [];
  }

  return FeatureAccessManager.getLockedFeatures(currentPlanId);
};

export default useFeatureAccess;