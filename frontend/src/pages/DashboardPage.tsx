/**
 * /frontend/src/pages/DashboardPage.tsx
 *
 * Main application dashboard.
 * Fixed: uses isFreeModeActive as boolean property (not function call),
 * canAccessFeature called correctly, no process.env references.
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useBilling from '../hooks/useBilling';
import { useTheme } from '../context/ThemeContext';
import { getFeatureFlagService } from '../services/billing/featureFlags';
import AppLayout from '../components/layout/AppLayout';

interface FeatureCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

const FEATURES: FeatureCardData[] = [
  { id: 'core_hr', name: 'Core HR', description: 'Employee management and profiles', icon: '👥', path: '/dashboard/employees' },
  { id: 'basic_ats', name: 'Applicant Tracking', description: 'Recruitment and hiring tools', icon: '📋', path: '/dashboard/ats' },
  { id: 'payroll_tools', name: 'Payroll', description: 'Salary processing and management', icon: '💰', path: '/dashboard/payroll' },
  { id: 'advanced_analytics', name: 'Advanced Analytics', description: 'Insights and reporting', icon: '📊', path: '/dashboard/analytics' },
  { id: 'ai_copilot', name: 'AI Copilot', description: 'AI-powered assistance', icon: '🤖', path: '/dashboard/ai' },
  { id: 'compliance', name: 'Compliance Tools', description: 'Regulatory compliance management', icon: '✅', path: '/dashboard/compliance' },
];

const QUICK_STATS = [
  { label: 'Total Employees', value: '0', icon: '👥' },
  { label: 'Active Departments', value: '0', icon: '🏢' },
  { label: 'Pending Tasks', value: '0', icon: '✅' },
  { label: 'Upcoming Events', value: '0', icon: '📅' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentPlan,
    isTrialActive,
    daysUntilRenewal,
    canAccessFeature,
    isFreeModeActive,
  } = useBilling();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const flags = getFeatureFlagService();

  useEffect(() => {
    void flags.initialize();
  }, []);

  const displayName =
    user?.fullName?.split(' ')[0] ??
    user?.firstName ??
    user?.email ??
    'there';

  return (
    <AppLayout showSidebar showFooter={false}>
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-1">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Here's your HR management hub.
        </p>
      </motion.div>

      {/* Subscription / Free-mode banner */}
      {isFreeModeActive ? (
        <motion.div
          className={`mb-8 p-6 rounded-lg border ${
            isDark
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-green-50 border-green-200'
          }`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h2 className="font-bold text-lg mb-1">Free Mode Active</h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                All features are available to you at no cost during our launch phase.
              </p>
            </div>
          </div>
        </motion.div>
      ) : currentPlan ? (
        <motion.div
          className={`mb-8 p-6 rounded-lg border ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
              : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
          }`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                {currentPlan.displayName} Plan
              </h2>
              {isTrialActive ? (
                <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  Trial active — {daysUntilRenewal} days remaining
                </p>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Renews in {daysUntilRenewal} days
                </p>
              )}
            </div>
            <motion.button
              onClick={() => navigate('/dashboard/subscription')}
              className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Manage Plan
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Max Users
              </p>
              <p className="text-xl font-bold text-cyan-400">
                {currentPlan.maxUsers ?? '∞'}
              </p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Storage
              </p>
              <p className="text-xl font-bold text-cyan-400">
                {currentPlan.storageGB ?? 0} GB
              </p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Support
              </p>
              <p className="text-xl font-bold text-cyan-400 capitalize">
                {currentPlan.supportLevel}
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Feature grid */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-5">Available Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => {
            const accessible = canAccessFeature(feature.id);
            return (
              <motion.div
                key={feature.id}
                className={`p-5 rounded-lg border transition-all relative ${
                  accessible
                    ? isDark
                      ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/60 cursor-pointer'
                      : 'bg-white border-slate-200 shadow hover:shadow-md hover:border-cyan-300 cursor-pointer'
                    : isDark
                      ? 'bg-slate-800/50 border-slate-700/50 opacity-70'
                      : 'bg-slate-100 border-slate-200 opacity-70'
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={accessible ? { y: -3 } : undefined}
                onClick={accessible ? () => navigate(feature.path) : undefined}
              >
                {!accessible && (
                  <span
                    className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-semibold ${
                      isDark
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    🔒 Premium
                  </span>
                )}
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold mb-1">{feature.name}</h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {feature.description}
                </p>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (accessible) navigate(feature.path);
                    else navigate('/pricing');
                  }}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                    accessible
                      ? isDark
                        ? 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/40'
                        : 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200'
                      : isDark
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  whileHover={accessible ? { scale: 1.03 } : undefined}
                  whileTap={accessible ? { scale: 0.97 } : undefined}
                >
                  {accessible ? 'Open' : 'Upgrade to Access'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick stats */}
      <motion.div
        className={`p-6 rounded-lg border ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200 shadow'
        }`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-xl font-bold mb-5">Quick Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 + idx * 0.05 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p
                className={`text-xs mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default DashboardPage;