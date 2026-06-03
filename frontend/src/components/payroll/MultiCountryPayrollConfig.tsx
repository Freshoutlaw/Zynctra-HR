/**
 * /frontend/src/components/payroll/MultiCountryPayrollConfig.tsx
 * 
 * Multi-country payroll configuration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CountryPayrollConfig {
  country: string;
  currency: string;
  taxRate: number;
  socialContribution: number;
  minimumWage: number;
  paymentFrequency: string;
}

interface MultiCountryPayrollConfigProps {
  configs: CountryPayrollConfig[];
  onUpdate: (configs: CountryPayrollConfig[]) => void;
}

export const MultiCountryPayrollConfig: React.FC<MultiCountryPayrollConfigProps> = ({
  configs,
  onUpdate,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(configs[0]?.country || '');

  const handleUpdate = (field: keyof CountryPayrollConfig, value: any) => {
    const updated = configs.map((c) =>
      c.country === selectedCountry ? { ...c, [field]: value } : c
    );
    onUpdate(updated);
  };

  const currentConfig = configs.find((c) => c.country === selectedCountry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Multi-Country Payroll Configuration</h3>

        <div className="space-y-4">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            >
              {configs.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          {currentConfig && (
            <>
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <input
                  type="text"
                  value={currentConfig.currency}
                  onChange={(e) => handleUpdate('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={currentConfig.taxRate}
                  onChange={(e) => handleUpdate('taxRate', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
              </div>

              {/* Social Contribution */}
              <div>
                <label className="block text-sm font-medium mb-2">Social Contribution (%)</label>
                <input
                  type="number"
                  value={currentConfig.socialContribution}
                  onChange={(e) => handleUpdate('socialContribution', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
              </div>

              {/* Minimum Wage */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Wage ({currentConfig.currency})
                </label>
                <input
                  type="number"
                  value={currentConfig.minimumWage}
                  onChange={(e) => handleUpdate('minimumWage', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
              </div>

              {/* Payment Frequency */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Frequency</label>
                <select
                  value={currentConfig.paymentFrequency}
                  onChange={(e) => handleUpdate('paymentFrequency', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                  <option>Monthly</option>
                  <option>Bi-weekly</option>
                  <option>Weekly</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MultiCountryPayrollConfig;