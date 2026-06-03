/**
 * /frontend/src/components/analytics/PayrollSpendAnalysis.tsx
 * 
 * Comprehensive payroll spend analysis and cost breakdown
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PayrollMetrics {
  totalMonthlyPayroll: number;
  totalYearlyPayroll: number;
  averageSalary: number;
  medianSalary: number;
  byDepartment: Record<string, number>;
  byRole: Record<string, number>;
  benefits: Record<string, number>;
  trends: { month: string; amount: number }[];
}

interface PayrollSpendAnalysisProps {
  data?: PayrollMetrics;
  isLoading?: boolean;
}

const defaultData: PayrollMetrics = {
  totalMonthlyPayroll: 285000,
  totalYearlyPayroll: 3420000,
  averageSalary: 8769,
  medianSalary: 8200,
  byDepartment: {
    Engineering: 1200000,
    Sales: 850000,
    Marketing: 450000,
    Operations: 520000,
    Finance: 320000,
    HR: 180000,
    Legal: 180000,
    Other: 340000,
  },
  byRole: {
    'Senior Engineer': 420000,
    'Engineer': 580000,
    'Sales Manager': 320000,
    'Sales Representative': 380000,
    'Marketing Manager': 180000,
    'Coordinator': 250000,
    'Analyst': 310000,
    'Other': 980000,
  },
  benefits: {
    'Health Insurance': 95000,
    'Pension': 85000,
    'Transportation': 45000,
    'Meals': 32000,
    'Gym': 12000,
    'Other': 16000,
  },
  trends: [
    { month: 'Jan', amount: 275000 },
    { month: 'Feb', amount: 276000 },
    { month: 'Mar', amount: 280000 },
    { month: 'Apr', amount: 282000 },
    { month: 'May', amount: 283000 },
    { month: 'Jun', amount: 285000 },
    { month: 'Jul', amount: 285000 },
    { month: 'Aug', amount: 288000 },
    { month: 'Sep', amount: 285000 },
    { month: 'Oct', amount: 285000 },
    { month: 'Nov', amount: 285000 },
    { month: 'Dec', amount: 290000 },
  ],
};

export const PayrollSpendAnalysis: React.FC<PayrollSpendAnalysisProps> = ({
  data = defaultData,
  isLoading = false,
}) => {
  const [viewType, setViewType] = useState<'department' | 'role' | 'benefits'>('department');

  if (isLoading) {
    return <div className="text-center py-8">Loading payroll data...</div>;
  }

  const displayData =
    viewType === 'department'
      ? data.byDepartment
      : viewType === 'role'
      ? data.byRole
      : data.benefits;

  const entries = Object.entries(displayData).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, v]) => v));
  const totalValue = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Monthly Payroll</p>
          <p className="text-2xl font-bold">${(data.totalMonthlyPayroll / 1000).toFixed(0)}k</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Annual Payroll</p>
          <p className="text-2xl font-bold">${(data.totalYearlyPayroll / 1000000).toFixed(1)}M</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Average Salary</p>
          <p className="text-2xl font-bold">${data.averageSalary.toLocaleString()}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Median Salary</p>
          <p className="text-2xl font-bold">${data.medianSalary.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Payroll Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold mb-4">Monthly Payroll Trend</h3>
        <div className="flex items-end gap-1 h-40">
          {data.trends.map((trend, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${(trend.amount / 300000) * 100}%` }}
              transition={{ delay: idx * 0.03 }}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:opacity-80 cursor-pointer group relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                ${(trend.amount / 1000).toFixed(0)}k
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-3">
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
          <span>Dec</span>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
        {(['department', 'role', 'benefits'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              viewType === type
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4">
            {viewType === 'department'
              ? 'By Department'
              : viewType === 'role'
              ? 'By Role'
              : 'Benefits Breakdown'}
          </h3>
          <div className="space-y-3">
            {entries.slice(0, 8).map(([name, amount]) => (
              <motion.div key={name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    ${(amount / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(amount / maxValue) * 100}%` }}
                    transition={{ delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {((amount / totalValue) * 100).toFixed(1)}% of {viewType === 'benefits' ? 'benefits' : 'payroll'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Top {viewType}</p>
              <p className="text-lg font-bold">{entries[0][0]}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                ${(entries[0][1] / 1000).toFixed(0)}k (
                {((entries[0][1] / totalValue) * 100).toFixed(1)}%)
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Spend</p>
              <p className="text-lg font-bold">${(totalValue / 1000).toFixed(0)}k</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Average per item: ${(totalValue / entries.length / 1000).toFixed(0)}k
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Distribution</p>
              <p className="text-sm font-medium">
                Top 3 account for {((entries.slice(0, 3).reduce((sum, [, v]) => sum + v, 0) / totalValue) * 100).toFixed(1)}% of spend
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PayrollSpendAnalysis;