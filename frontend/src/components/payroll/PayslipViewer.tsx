/**
 * /frontend/src/components/payroll/PayrollCalculator.tsx
 *
 * Payroll calculation engine with deductions and taxes
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PayrollInput {
  baseSalary: number;
  bonuses: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
}

export interface PayrollOutput {
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  breakdown: Record<string, number>;
  taxAmount: number;
}

interface PayrollCalculatorProps {
  onCalculate?: (output: PayrollOutput) => void;
}

export const PayrollCalculator: React.FC<PayrollCalculatorProps> = ({
  onCalculate,
}) => {
  const [input, setInput] = useState<PayrollInput>({
    baseSalary: 0,
    bonuses: 0,
    allowances: {},
    deductions: {},
  });

  const calculatePayroll = (): PayrollOutput => {
    const allowancesTotal = Object.values(input.allowances).reduce(
      (a, b) => a + b,
      0
    );
    const deductionsTotal = Object.values(input.deductions).reduce(
      (a, b) => a + b,
      0
    );
    const grossPay = input.baseSalary + input.bonuses + allowancesTotal;
    const taxAmount = grossPay * 0.11;
    const totalDeductions = deductionsTotal + taxAmount;
    const netPay = grossPay - totalDeductions;

    return {
      grossPay,
      totalDeductions,
      netPay,
      breakdown: {
        'Base Salary': input.baseSalary,
        Bonuses: input.bonuses,
        ...input.allowances,
      },
      taxAmount,
    };
  };

  const output = calculatePayroll();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <h2 className="text-xl font-bold">Payroll Input</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Base Salary</label>
            <input
              type="number"
              value={input.baseSalary}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  baseSalary: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bonuses</label>
            <input
              type="number"
              value={input.bonuses}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  bonuses: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 p-6 space-y-4">
          <h2 className="text-xl font-bold">Payroll Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Gross Pay:</span>
              <span className="font-semibold">
                ${output.grossPay.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-cyan-200 dark:border-cyan-800 pt-3">
              <span>Income Tax (11%):</span>
              <span className="font-semibold text-red-600">
                ${output.taxAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Other Deductions:</span>
              <span className="font-semibold text-red-600">
                ${(output.totalDeductions - output.taxAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-cyan-400 dark:border-cyan-700 pt-3">
              <span>Net Pay:</span>
              <span className="text-green-600 dark:text-green-400">
                ${output.netPay.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onCalculate?.(output)}
        className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
      >
        Save Calculation
      </button>
    </motion.div>
  );
};

export default PayrollCalculator;