/**
 * /frontend/src/components/billing/FeatureLock.tsx
 *
 * Component displayed when a feature is not accessible.
 * Shows upgrade CTA with the required plan information.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useTheme } from '../../context/ThemeContext';
import { SubscriptionPlan } from '../../types/billing.types';

interface FeatureLockProps {
  featureId: string;
  featureName?: string;
  description?: string;
  children?: React.ReactNode;
  showButton?: boolean;
  onUpgradeClick?: () => void;
}

const planNames: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.FREE]: 'Free Plan',
  [SubscriptionPlan.STANDARD]: 'Standard Plan',
  [SubscriptionPlan.PREMIUM]: 'Premium Plan',
};

const planEmojis: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.FREE]: '🎯',
  [SubscriptionPlan.STANDARD]: '⭐',
  [SubscriptionPlan.PREMIUM]: '👑',
};

// ---------------------------------------------------------------------------
// Main gate component
// ---------------------------------------------------------------------------

export const FeatureLock: React.FC<FeatureLockProps> = ({
  featureId,
  featureName,
  description,
  children,
  showButton = true,
  onUpgradeClick,
}) => {
  const navigate = useNavigate();
  const { canAccess, requiredPlan } = useFeatureAccess(featureId);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  if (canAccess) return <>{children}</>;

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate('/pricing');
    }
  };

  return (
    <motion.div
      className={`rounded-lg border-2 p-8 text-center flex flex-col items-center justify-center min-h-[300px] ${
        isDark
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-dashed border-slate-700'
          : 'bg-gradient-to-br from-slate-50 to-white border-dashed border-slate-300'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-6xl mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔒
      </motion.div>

      <h3 className="text-2xl font-bold mb-2">
        {featureName ?? 'Premium Feature'}
      </h3>

      <p
        className={`text-center mb-6 max-w-md ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        {description ??
          'This feature is only available on higher tier plans. Upgrade now to get access.'}
      </p>

      <motion.div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-semibold ${
          isDark
            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
            : 'bg-cyan-100 border border-cyan-300 text-cyan-900'
        }`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {planEmojis[requiredPlan]}
        <span>Requires {planNames[requiredPlan]}</span>
      </motion.div>

      {showButton && (
        <motion.button
          onClick={handleUpgrade}
          className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upgrade Now
        </motion.button>
      )}

      <p
        className={`text-xs mt-6 ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}
      >
        Get instant access by upgrading your subscription
      </p>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Inline lock badge
// ---------------------------------------------------------------------------

export const InlineFeatureLock: React.FC<Pick<FeatureLockProps, 'featureId' | 'featureName'>> = ({ featureId, featureName }) => {
  const navigate = useNavigate();
  const { canAccess } = useFeatureAccess(featureId);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  if (canAccess) return null;

  return (
    <motion.button
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
        isDark
          ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
          : 'bg-yellow-100 border border-yellow-300 text-yellow-900 hover:bg-yellow-200'
      } transition`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => navigate('/pricing')}
      whileHover={{ scale: 1.05 }}
    >
      🔒 {featureName ?? 'Premium'}
    </motion.button>
  );
};

// ---------------------------------------------------------------------------
// Overlay lock (blurs content behind it)
// ---------------------------------------------------------------------------

export const FeatureLockOverlay: React.FC<{
  isLocked: boolean;
  featureName?: string;
  children: React.ReactNode;
}> = ({ isLocked, featureName, children }) => {
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none select-none">{children}</div>

      <motion.div
        className={`absolute inset-0 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm ${
          isDark ? 'bg-black/40' : 'bg-white/40'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-4xl mb-2">🔒</div>
        <p className="font-bold text-white mb-2">{featureName ?? 'Premium Feature'}</p>
        <button
          onClick={() => navigate('/pricing')}
          className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition text-sm"
        >
          Unlock
        </button>
      </motion.div>
    </div>
  );
};

export default FeatureLock;