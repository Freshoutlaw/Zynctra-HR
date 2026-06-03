/**
 * /frontend/src/pages/DashboardPage.tsx
 * 
 * Main application dashboard
 * Shows user stats, upcoming features, subscription info
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useBilling from '../hooks/useBilling';
import { useTheme } from '../context/ThemeContext';
import { getFeatureFlagService } from '../services/billing/featureFlags';

/**
 * DashboardPage Component
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentPlan, isTrialActive, daysUntilRenewal, canAccessFeature } = useBilling();
  const { theme } = useTheme();
  const flags = getFeatureFlagService();

  useEffect(() => {
    flags.initialize();
  }, []);

  const isDark = theme === 'dark';

  // Feature cards
  const features = [
    {
      id: 'core_hr',
      name: 'Core HR',
      description: 'Employee management and profiles',
      icon: '👥',
      accessible: true,
    },
    {
      id: 'ats',
      name: 'Applicant Tracking',
      description: 'Recruitment and hiring tools',
      icon: '📋',
      accessible: true,
    },
    {
      id: 'payroll',
      name: 'Payroll',
      description: 'Salary processing and management',
      icon: '💰',
      accessible: canAccessFeature('payroll_tools'),
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      description: 'Insights and reporting',
      icon: '📊',
      accessible: canAccessFeature('advanced_analytics'),
    },
    {
      id: 'ai_copilot',
      name: 'AI Copilot',
      description: 'AI-powered assistance',
      icon: '🤖',
      accessible: canAccessFeature('ai_copilot'),
    },
    {
      id: 'compliance',
      name: 'Compliance Tools',
      description: 'Regulatory compliance management',
      icon: '✅',
      accessible: canAccessFeature('compliance'),
    },
  ];

  return (
    <div className={`min-h-screen ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      {/* Header */}
      <motion.div
        className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur sticky top-0 z-40`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">{user?.email}</span>
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Here's your HR management hub
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Subscription Status */}
        {!flags.isFreeModeActive() && currentPlan && (
          <motion.div
            className={`mb-8 p-6 rounded-lg border ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
                : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentPlan.displayName} Plan</h2>
                {isTrialActive && (
                  <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Trial active • {daysUntilRenewal} days remaining
                  </p>
                )}
                {!isTrialActive && (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Renews in {daysUntilRenewal} days
                  </p>
                )}
              </div>
              <motion.button
                onClick={() => window.location.href = '/dashboard/subscription'}
                className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage Plan
              </motion.button>
            </div>

            {/* Plan Features Preview */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Max Users</p>
                <p className="text-2xl font-bold text-cyan-400">{currentPlan.maxUsers || '∞'}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Storage</p>
                <p className="text-2xl font-bold text-cyan-400">{currentPlan.storageGB}GB</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Support</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {currentPlan.supportLevel === 'email' ? '📧' : '🎯'} {currentPlan.supportLevel}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Free Mode Notice */}
        {flags.isFreeModeActive() && (
          <motion.div
            className={`mb-8 p-6 rounded-lg border ${
              isDark
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-green-50 border-green-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h2 className="text-lg font-bold mb-1">Free Mode Active</h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  All features are available to you at no cost during our launch phase.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-lg border transition relative ${
                  feature.accessible
                    ? isDark
                      ? 'bg-slate-800 border-slate-700 hover:border-cyan-500'
                      : 'bg-white border-slate-200 shadow hover:shadow-md'
                    : isDark
                      ? 'bg-slate-800/50 border-slate-700/50 opacity-75'
                      : 'bg-slate-100 border-slate-200 opacity-75'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={feature.accessible ? { y: -4 } : {}}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-1">{feature.name}</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.description}
                </p>

                {!feature.accessible && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      isDark
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-900'
                    }`}>
                      🔒 Premium
                    </span>
                  </div>
                )}

                <motion.button
                  onClick={() => {
                    // Navigate to feature or upgrade
                    if (!feature.accessible) {
                      window.location.href = '/pricing';
                    } else {
                      // Navigate to feature page
                    }
                  }}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                    feature.accessible
                      ? isDark
                        ? 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/40'
                        : 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200'
                      : isDark
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-slate-300 text-slate-600'
                  }`}
                  whileHover={feature.accessible ? { scale: 1.05 } : {}}
                  whileTap={feature.accessible ? { scale: 0.95 } : {}}
                >
                  {feature.accessible ? 'Open' : 'Upgrade to Access'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className={`p-8 rounded-lg border ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200 shadow'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Employees', value: '0', icon: '👥' },
              { label: 'Active Departments', value: '0', icon: '🏢' },
              { label: 'Pending Tasks', value: '0', icon: '✅' },
              { label: 'Upcoming Events', value: '0', icon: '📅' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={`p-4 rounded-lg ${
                  isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;