/**
 * /frontend/src/pages/AdminPanel.tsx
 * 
 * Professional enterprise admin panel
 * Complete control over:
 * - Monetization modes
 * - Organization management
 * - Billing and subscriptions
 * - Audit logs
 * - User management
 * - System settings
 * 
 * Only accessible to SUPER_ADMIN
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth.types';
import { orgBillingService, auditLogService } from '../services/supabase/supabaseClient';
import { getFeatureFlagService } from '../services/billing/featureFlags';
import { useTheme } from '../context/ThemeContext';

type AdminTab = 
  | 'dashboard' 
  | 'monetization' 
  | 'organizations' 
  | 'subscriptions' 
  | 'audit-logs' 
  | 'users' 
  | 'settings';

/**
 * Admin Panel Component
 */
const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [monetizationSettings, setMonetizationSettings] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const flags = getFeatureFlagService();

  /**
   * Check permissions
   */
  const hasPermission = (): boolean => {
    return user?.role === UserRole.SUPER_ADMIN;
  };

  /**
   * Load data on mount
   */
  useEffect(() => {
    if (hasPermission()) {
      loadData();
    }
  }, [user, activeTab]);

  /**
   * Load admin data based on active tab
   */
  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 'monetization':
          await loadMonetizationSettings();
          break;
        case 'organizations':
          await loadOrganizations();
          break;
        case 'subscriptions':
          await loadSubscriptions();
          break;
        case 'audit-logs':
          await loadAuditLogs();
          break;
        case 'dashboard':
          await loadDashboardData();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonetizationSettings = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/admin/monetization-settings`,
      { credentials: 'include' }
    );
    const data = await response.json();
    setMonetizationSettings(data);
  };

  const loadOrganizations = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/admin/organizations`,
      { credentials: 'include' }
    );
    const data = await response.json();
    setOrganizations(data.organizations || []);
  };

  const loadSubscriptions = async () => {
    const data = await orgBillingService.getAllBillingRecords(50);
    setOrganizations(data as any);
  };

  const loadAuditLogs = async () => {
    const data = await auditLogService.getLogs({}, 100);
    setAuditLogs(data as any);
  };

  const loadDashboardData = async () => {
    // Load summary stats
    const billings = await orgBillingService.getAllBillingRecords(100);
    setOrganizations(billings as any);
  };

  /**
   * Toggle monetization mode
   */
  const handleToggleMonetization = async (mode: 'free' | 'paid') => {
    if (!confirm(
      `Are you sure you want to switch to ${mode.toUpperCase()} MODE? This affects all organizations.`
    )) {
      return;
    }

    setIsLoading(true);
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
          body: JSON.stringify({
            freeMode: mode === 'free',
            enabled: mode === 'paid',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update settings');

      const data = await response.json();
      setMonetizationSettings(data);

      setSuccessMessage(`✓ Switched to ${mode.toUpperCase()} MODE`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Log security event
      logSecurityEvent(
        `MONETIZATION_MODE_${mode.toUpperCase()}`,
        `Admin switched to ${mode} mode`,
        'HIGH'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log security event
   */
  const logSecurityEvent = async (type: string, description: string, severity: string) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/admin/security-events`, {
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
        }),
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') || '';
  };

  // Permission check
  if (!hasPermission()) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={`p-8 rounded-lg border-2 max-w-md ${
          theme === 'dark' ? 'bg-slate-900 border-red-500 text-white' : 'bg-white border-red-500 text-slate-900'
        }`}>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="mb-6">Only SUPER_ADMIN can access this panel.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
    }`}>
      {/* Header */}
      <motion.div
        className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur sticky top-0 z-40`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Complete system administration and control
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2 bg-slate-700/20 rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded transition ${
                theme === 'light'
                  ? 'bg-yellow-400 text-slate-900 font-semibold'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☀️
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded transition ${
                theme === 'dark'
                  ? 'bg-slate-700 text-white font-semibold'
                  : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌙
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-3 py-1 rounded transition ${
                theme === 'system'
                  ? theme === 'dark' ? 'bg-slate-600 text-white font-semibold' : 'bg-slate-200 text-slate-900 font-semibold'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔄
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <motion.div
            className={`mb-6 p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-red-100 border-red-300 text-red-900'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className={`mb-6 p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-green-100 border-green-300 text-green-900'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {successMessage}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className={`mb-8 flex gap-2 overflow-x-auto pb-4 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          {[
            { id: 'dashboard' as AdminTab, label: '📊 Dashboard', icon: '📈' },
            { id: 'monetization' as AdminTab, label: '💳 Monetization', icon: '💰' },
            { id: 'organizations' as AdminTab, label: '🏢 Organizations', icon: '🏢' },
            { id: 'subscriptions' as AdminTab, label: '📜 Subscriptions', icon: '📋' },
            { id: 'audit-logs' as AdminTab, label: '📝 Audit Logs', icon: '🔐' },
            { id: 'users' as AdminTab, label: '👥 Users', icon: '👤' },
            { id: 'settings' as AdminTab, label: '⚙️ Settings', icon: '🔧' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-500 text-white'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardTab organizations={organizations} theme={theme} isLoading={isLoading} />
          )}
          {activeTab === 'monetization' && (
            <MonetizationTab
              settings={monetizationSettings}
              onToggle={handleToggleMonetization}
              theme={theme}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'organizations' && (
            <OrganizationsTab organizations={organizations} theme={theme} isLoading={isLoading} />
          )}
          {activeTab === 'subscriptions' && (
            <SubscriptionsTab organizations={organizations} theme={theme} isLoading={isLoading} />
          )}
          {activeTab === 'audit-logs' && (
            <AuditLogsTab logs={auditLogs} theme={theme} isLoading={isLoading} />
          )}
          {activeTab === 'users' && (
            <UsersTab theme={theme} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab theme={theme} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * Dashboard Tab
 */
const DashboardTab: React.FC<{ organizations: any[]; theme: string; isLoading: boolean }> = ({
  organizations,
  theme,
  isLoading,
}) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">System Overview</h2>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⏳</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Organizations', value: organizations.length, color: 'cyan' },
            {
              label: 'Active Subscriptions',
              value: organizations.filter((o) => o.subscription_status === 'active').length,
              color: 'green',
            },
            { label: 'Premium Plans', value: organizations.filter((o) => o.current_plan === 'PREMIUM').length, color: 'purple' },
            {
              label: 'Total Revenue (approx)',
              value: `$${organizations
                .reduce((sum, o) => sum + (o.total_spent || 0), 0)
                .toFixed(0)}`,
              color: 'yellow',
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200 shadow'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2 text-cyan-400">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Monetization Tab
 */
const MonetizationTab: React.FC<{
  settings: any;
  onToggle: (mode: 'free' | 'paid') => Promise<void>;
  theme: string;
  isLoading: boolean;
}> = ({ settings, onToggle, theme, isLoading }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">Monetization Control</h2>

      {settings && (
        <motion.div
          className={`p-8 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/50'
              : 'bg-gradient-to-br from-slate-50 to-white border-cyan-400'
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Current Mode</h3>
              <motion.div
                className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${
                  settings.freeMode
                    ? 'bg-green-500/20 text-green-400 border border-green-400'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-400'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {settings.freeMode ? '🎉 FREE MODE' : '💳 PAID MODE'}
              </motion.div>
            </div>
          </div>

          <p className={`mb-8 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {settings.freeMode
              ? '✓ All features available to all users. No payment required.'
              : '✓ Billing enforced. Subscription restrictions active.'}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onToggle('free')}
              disabled={settings.freeMode || isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                settings.freeMode
                  ? 'bg-green-600 text-white cursor-default'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              } disabled:opacity-50`}
            >
              {settings.freeMode ? '✓ Free Mode Active' : 'Enable Free Mode'}
            </button>
            <button
              onClick={() => onToggle('paid')}
              disabled={!settings.freeMode || isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                !settings.freeMode
                  ? 'bg-blue-600 text-white cursor-default'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              } disabled:opacity-50`}
            >
              {!settings.freeMode ? '✓ Paid Mode Active' : 'Enable Paid Mode'}
            </button>
          </div>

          <p className={`mt-6 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            ⚠️ This change affects ALL organizations immediately and is logged for audit purposes.
          </p>
        </motion.div>
      )}

      {/* Additional Settings */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200 shadow'
      }`}>
        <h3 className="text-lg font-bold mb-4">Monetization Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded bg-slate-700/20">
            <span>Allow Downgrades</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-3 rounded bg-slate-700/20">
            <span>Allow Plan Changes</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-3 rounded bg-slate-700/20">
            <span>Require Payment on Signup</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Organizations Tab
 */
const OrganizationsTab: React.FC<{
  organizations: any[];
  theme: string;
  isLoading: boolean;
}> = ({ organizations, theme, isLoading }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">Organizations</h2>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className={`rounded-lg border overflow-hidden ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}>
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Organization</th>
                <th className="px-6 py-3 text-left font-semibold">Users</th>
                <th className="px-6 py-3 text-left font-semibold">Plan</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'divide-y divide-slate-700' : 'divide-y divide-slate-200'}>
              {organizations.map((org, idx) => (
                <tr key={idx} className={theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4 font-medium">{org.organization_id}</td>
                  <td className="px-6 py-4">{org.users_count || 0}</td>
                  <td className="px-6 py-4">{org.current_plan || 'FREE'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      org.subscription_status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {org.subscription_status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-cyan-400 hover:text-cyan-300 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Subscriptions Tab
 */
const SubscriptionsTab: React.FC<{
  organizations: any[];
  theme: string;
  isLoading: boolean;
}> = ({ organizations, theme, isLoading }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">Subscriptions & Billing</h2>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {organizations.map((org, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  : 'bg-white border-slate-200 shadow hover:shadow-md'
              } transition`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{org.organization_id}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Plan: <span className="font-semibold text-cyan-400">{org.current_plan}</span>
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold ${
                  org.subscription_status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : org.subscription_status === 'trialing'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                }`}>
                  {org.subscription_status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Billing Period</p>
                  <p className="font-semibold">{org.billing_period}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total Spent</p>
                  <p className="font-semibold text-cyan-400">${org.total_spent?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Renewal Date</p>
                  <p className="font-semibold">{new Date(org.renewal_date).toLocaleDateString()}</p>
                </div>
              </div>

              <button className="w-full py-2 px-4 rounded bg-slate-700 hover:bg-slate-600 transition font-medium text-sm">
                View Details →
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Audit Logs Tab
 */
const AuditLogsTab: React.FC<{
  logs: any[];
  theme: string;
  isLoading: boolean;
}> = ({ logs, theme, isLoading }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">Audit Logs</h2>
      <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        All admin actions and important system events
      </p>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400'
                        : log.severity === 'HIGH'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {log.severity}
                    </span>
                    <span className="font-semibold">{log.action}</span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {log.changes ? JSON.stringify(log.changes).substring(0, 100) + '...' : 'No changes'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                    {new Date(log.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Users Tab
 */
const UsersTab: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">User Management</h2>
      <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
        Manage users, roles, and permissions across the platform
      </p>
      <div className={`p-12 text-center rounded-lg border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
          User management interface coming soon
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Settings Tab
 */
const SettingsTab: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold">System Settings</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: 'API Configuration', icon: '🔌' },
          { label: 'Email Settings', icon: '📧' },
          { label: 'Storage & Backups', icon: '💾' },
          { label: 'Security Policies', icon: '🔐' },
        ].map((setting, idx) => (
          <motion.div
            key={idx}
            className={`p-6 rounded-lg border cursor-pointer transition hover:border-cyan-500 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200 shadow hover:shadow-md'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="text-4xl mb-3">{setting.icon}</div>
            <h3 className="font-semibold text-lg">{setting.label}</h3>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Configure system settings
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminPanel;