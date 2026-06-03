/**
 * /frontend/src/components/payroll/PayslipViewer.tsx
 * Payslip viewing and download
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PayslipLine {
  name: string;
  amount: number;
  type: 'earning' | 'deduction' | 'tax';
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  issueDate: Date;
  grossSalary: number;
  deductions: PayslipLine[];
  taxes: PayslipLine[];
  netSalary: number;
  currency: string;
  bankAccount: string;
}

interface PayslipViewerProps {
  payslips: Payslip[];
  onDownload?: (payslipId: string) => void;
}

export const PayslipViewer: React.FC<PayslipViewerProps> = ({ payslips, onDownload }) => {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(payslips[0] || null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {/* Payslip List */}
      <div className="lg:col-span-1">
        <h3 className="font-semibold text-sm mb-4">Payslips</h3>
        <div className="space-y-2">
          {payslips.map((slip) => (
            <button
              key={slip.id}
              onClick={() => setSelectedPayslip(slip)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedPayslip?.id === slip.id
                  ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <p className="font-semibold text-sm">{slip.payPeriod}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {slip.issueDate.toLocaleDateString()}
              </p>
              <p className="text-sm font-bold mt-2">
                {slip.currency} {slip.netSalary.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Payslip Details */}
      {selectedPayslip && (
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold">PAYSLIP</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedPayslip.employeeName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Pay Period</p>
              <p className="font-semibold">{selectedPayslip.payPeriod}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Issued</p>
              <p className="font-semibold">{selectedPayslip.issueDate.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Earnings */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Earnings</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Gross Salary</span>
                <span className="font-semibold">
                  {selectedPayslip.currency} {selectedPayslip.grossSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          {selectedPayslip.deductions.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Deductions</h3>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {selectedPayslip.deductions.map((ded, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{ded.name}</span>
                    <span>
                      {selectedPayslip.currency} {ded.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Taxes */}
          {selectedPayslip.taxes.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Taxes</h3>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {selectedPayslip.taxes.map((tax, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{tax.name}</span>
                    <span>
                      {selectedPayslip.currency} {tax.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Net Salary */}
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-lg font-bold bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
              <span>Net Salary</span>
              <span>
                {selectedPayslip.currency} {selectedPayslip.netSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Bank Account */}
          <div className="mb-8">
            <p className="text-sm text-slate-600 dark:text-slate-400">Transferred to</p>
            <p className="font-mono font-semibold">{selectedPayslip.bankAccount}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onDownload?.(selectedPayslip.id)}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium"
            >
              Download PDF
            </button>
            <button className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium">
              Print
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PayslipViewer;