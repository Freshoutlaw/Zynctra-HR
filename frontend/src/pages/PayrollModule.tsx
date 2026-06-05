/**
 * /frontend/src/pages/PayrollModule.tsx
 *
 * Payroll management module page.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { PayrollCalculator } from '../components/payroll/PayrollCalculator';
import { MultiCountryPayrollConfig, type CountryPayrollConfig } from '../components/payroll/MultiCountryPayrollConfig';

type PayrollTab = 'calculator' | 'approval' | 'payslips' | 'tax' | 'config';

const DEFAULT_CONFIGS: CountryPayrollConfig[] = [
  { country: 'Nigeria', currency: 'NGN', taxRate: 11, socialContribution: 8, minimumWage: 30000, paymentFrequency: 'Monthly' },
  { country: 'Kenya', currency: 'KES', taxRate: 10, socialContribution: 6, minimumWage: 15000, paymentFrequency: 'Monthly' },
  { country: 'Ghana', currency: 'GHS', taxRate: 15, socialContribution: 5, minimumWage: 400, paymentFrequency: 'Monthly' },
];

const PayrollModule: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [activeTab, setActiveTab] = useState<PayrollTab>('calculator');
  const [countryConfigs, setCountryConfigs] = useState<CountryPayrollConfig[]>(DEFAULT_CONFIGS);

  const tabs: { id: PayrollTab; label: string; icon: string }[] = [
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'approval', label: 'Approvals', icon: '✅' },
    { id: 'payslips', label: 'Payslips', icon: '📄' },
    { id: 'tax', label: 'Tax Filing', icon: '📋' },
    { id: 'config', label: 'Country Config', icon: '🌍' },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      } p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payroll Management</h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Process payroll, manage approvals, and file taxes across multiple countries.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-900'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'calculator' && (
            <PayrollCalculator
              onCalculate={(output) =>
                console.log('Payroll calculated:', output)
              }
            />
          )}

          {activeTab === 'config' && (
            <MultiCountryPayrollConfig
              configs={countryConfigs}
              onUpdate={setCountryConfigs}
            />
          )}

          {(activeTab === 'approval' ||
            activeTab === 'payslips' ||
            activeTab === 'tax') && (
            <div
              className={`rounded-lg border p-12 text-center ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <p className="text-4xl mb-4">
                {activeTab === 'approval' ? '✅' : activeTab === 'payslips' ? '📄' : '📋'}
              </p>
              <p className="font-semibold text-lg mb-2 capitalize">
                {activeTab.replace('_', ' ')} Module
              </p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Connect to your payroll backend to view data here.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PayrollModule;