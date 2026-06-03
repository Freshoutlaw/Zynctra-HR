/**
 * /frontend/src/components/admin/AdminMonetizationToggle.tsx
 * 
 * Admin-only component for controlling monetization settings
 * Toggle between FREE MODE and PAID MODE
 * Only accessible to SUPER_ADMIN and TENANT_ADMIN roles
 * 
 * FREE MODE: All features available, no payment required
 * PAID MODE: Billing enforcement, subscription restrictions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, SecurityEvent, EventSeverity } from '../../types/auth.types';
import { MonetizationSettings, FeatureFlagConfig } from '../../types/billing.types';

interface AdminMonetizationToggleProps {
  onClose?: () => void;
}

/**
 * AdminMonetizationToggle Component
 */
export const AdminMonetizationToggle: React.FC<AdminMonetizationToggleProps> = ({
  onClose,
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<MonetizationSettings | null>(null);
  const [flags, setFlags] = useState<FeatureFlagConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'enable-paid' | 'enable-free' | null>(null);

  /**
   * Check if user has permission to access this component
   */
  const hasPermission = (): boolean => {
    if (!user) return false;
    return (
      user.role === UserRole.SUPER_ADMIN || user.role === UserRole.TENANT_ADMIN
    );
  };

  /**
   * Load current monetization settings
   */
  useEffect(() => {
    if (hasPermission()) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/monetization-settings`,
        {
          credentials: 'include',
          headers: {
            'X-CSRF-Token': getCsrfToken(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load monetization settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setFlags(data.flags);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load settings'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle monetization mode
   */
  const handleToggle = async (mode: 'free' | 'paid') => {
    if (!settings) return;

    setPendingAction(mode === 'free' ? 'enable-free' : 'enable-paid');
    setShowConfirmDialog(true);
  };

  /**
   * Confirm and apply changes
   */
  const confirmToggle = async () => {
    if (!settings || !pendingAction) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newSettings: Partial<MonetizationSettings> = {
        freeMode: pendingAction === 'enable-free',
        enabled: pendingAction === 'enable-paid',
        enforceBilling: pendingAction === 'enable-paid',
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/monetization-settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify(newSettings),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update monetization settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setFlags(data.flags);

      const mode = pendingAction === 'enable-free' ? 'FREE' : 'PAID';
      setSuccessMessage(
        `✓ Monetization mode changed to ${mode} MODE successfully`
      );

      // Log security event
      logSecurityEvent(
        'MONETIZATION_MODE_CHANGED',
        `Admin changed monetization mode to ${mode}`,
        'HIGH'
      );

      setShowConfirmDialog(false);
      setPendingAction(null);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update settings'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update individual settings
   */
  const updateSetting = async (key: keyof MonetizationSettings, value: any) => {
    if (!settings) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/monetization-settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ [key]: value }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const data = await response.json();
      setSettings(data.settings);

      setSuccessMessage('✓ Setting updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Log security event
      logSecurityEvent(
        'MONETIZATION_SETTING_CHANGED',
        `Admin changed ${key} to ${value}`,
        'MEDIUM'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log security event
   */
  const logSecurityEvent = (
    type: string,
    description: string,
    severity: string
  ) => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/security-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        eventType: type,
        description,
        severity,
        metadata: {
          admin: user?.email,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(console.error);
  };

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

  // Permission check
  if (!hasPermission()) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-slate-900 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            You do not have permission to access admin monetization settings.
            Only SUPER_ADMIN and TENANT_ADMIN roles are allowed.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  if (isLoading && !settings) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-900 border-2 border-cyan-500 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Monetization Settings</h2>
            <p className="text-slate-400 text-sm mt-1">
              Control billing enforcement and platform monetization
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {successMessage}
          </motion.div>
        )}

        {/* Current Mode */}
        {settings && (
          <>
            {/* Mode Indicator */}
            <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Current Mode</h3>
                <motion.div
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    settings.freeMode
                      ? 'bg-green-500/20 text-green-300 border border-green-400'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-400'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {settings.freeMode ? '🎉 FREE MODE' : '💳 PAID MODE'}
                </motion.div>
              </div>

              <p className="text-slate-300 text-sm mb-4">
                {settings.freeMode
                  ? 'All features are available to all users. No payment enforcement.'
                  : 'Billing is active. Subscription restrictions and payment enforcement enabled.'}
              </p>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleToggle('free')}
                  disabled={isLoading || settings.freeMode}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    settings.freeMode
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  } disabled:opacity-50`}
                >
                  {settings.freeMode ? '✓ Free Mode Active' : 'Enable Free Mode'}
                </button>
                <button
                  onClick={() => handleToggle('paid')}
                  disabled={isLoading || !settings.freeMode}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    !settings.freeMode
                      ? 'bg-blue-600 text-white cursor-default'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  } disabled:opacity-50`}
                >
                  {!settings.freeMode ? '✓ Paid Mode Active' : 'Enable Paid Mode'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                ⚠️ Changing mode will affect all organizations immediately. This action is logged for
                audit purposes.
              </p>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>

              {/* Monetization Enabled */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Monetization Enabled</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Enable/disable the entire billing system
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => updateSetting('enabled', e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-cyan-600 rounded-full peer-focus:ring-2 peer-focus:ring-cyan-500 transition after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:translate-x-full" />
                </label>
              </div>

              {/* Allow Downgrade */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Allow Downgrade</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Let users downgrade to lower plans
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowDowngrade}
                    onChange={(e) => updateSetting('allowDowngrade', e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-cyan-600 rounded-full peer-focus:ring-2 peer-focus:ring-cyan-500 transition after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:translate-x-full" />
                </label>
              </div>

              {/* Allow Plan Change */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Allow Plan Changes</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Let users switch between plans
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowPlanChange}
                    onChange={(e) => updateSetting('allowPlanChange', e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-cyan-600 rounded-full peer-focus:ring-2 peer-focus:ring-cyan-500 transition after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:translate-x-full" />
                </label>
              </div>

              {/* Trial Days */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700">
                <label className="block font-medium text-white mb-2">
                  Free Trial Period (days)
                </label>
                <input
                  type="number"
                  value={settings.trialPeriodDays}
                  onChange={(e) =>
                    updateSetting('trialPeriodDays', parseInt(e.target.value, 10))
                  }
                  disabled={isLoading}
                  min="0"
                  max="90"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 outline-none"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Number of days for trial period before payment required
                </p>
              </div>

              {/* Last Updated */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 text-sm">
                <p className="text-slate-400">
                  Last updated: {new Date(settings.lastUpdatedAt).toLocaleString()}
                </p>
                <p className="text-slate-400">By: {settings.updatedBy}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                Close Settings
              </button>
            </div>
          </>
        )}

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-900 border-2 border-yellow-500 rounded-lg p-6 max-w-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">⚠️ Confirm Mode Change</h3>
                <p className="text-slate-300 mb-6">
                  {pendingAction === 'enable-free'
                    ? 'Are you sure you want to enable FREE MODE? All features will be available to all users regardless of subscription.'
                    : 'Are you sure you want to enable PAID MODE? Billing enforcement will be activated immediately.'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setPendingAction(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmToggle}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AdminMonetizationToggle;