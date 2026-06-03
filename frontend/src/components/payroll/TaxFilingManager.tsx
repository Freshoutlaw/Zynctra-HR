/**
 * /frontend/src/components/payroll/TaxFilingManager.tsx
 * Tax filing and compliance management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TaxFiling {
  id: string;
  taxType: string;
  filingPeriod: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'approved' | 'failed';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  filedDate?: Date;
  referenceNumber?: string;
}

interface TaxFilingManagerProps {
  filings: TaxFiling[];
  onSubmit: (filingId: string) => void;
  onRetry: (filingId: string) => void;
}

export const TaxFilingManager: React.FC<TaxFilingManagerProps> = ({
  filings,
  onSubmit,
  onRetry,
}) => {
  const [selectedFiling, setSelectedFiling] = useState<TaxFiling | null>(filings[0] || null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      submitted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const isOverdue = (dueDate: Date) => new Date() > dueDate;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Tax Filings List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tax Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Period</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filings.map((filing) => (
                <tr
                  key={filing.id}
                  onClick={() => setSelectedFiling(filing)}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-medium">{filing.taxType}</td>
                  <td className="px-6 py-3 text-sm">{filing.filingPeriod}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={isOverdue(filing.dueDate) ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                      {filing.dueDate.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold">
                    {filing.currency} {filing.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(filing.status)}`}>
                      {filing.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {filing.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubmit(filing.id);
                        }}
                        className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                      >
                        Submit
                      </button>
                    )}
                    {filing.status === 'failed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetry(filing.id);
                        }}
                        className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filing Details */}
      {selectedFiling && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold mb-4">{selectedFiling.taxType}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Period</p>
                <p className="font-semibold">{selectedFiling.filingPeriod}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Due Date</p>
                <p className={`font-semibold ${isOverdue(selectedFiling.dueDate) ? 'text-red-600 dark:text-red-400' : ''}`}>
                  {selectedFiling.dueDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount</p>
                <p className="font-semibold">
                  {selectedFiling.currency} {selectedFiling.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Paid</p>
                <p className="font-semibold">
                  {selectedFiling.currency} {selectedFiling.paidAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {selectedFiling.filedDate && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">Filed on</p>
              <p className="font-semibold">{selectedFiling.filedDate.toLocaleString()}</p>
              {selectedFiling.referenceNumber && (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Reference Number</p>
                  <p className="font-mono font-semibold">{selectedFiling.referenceNumber}</p>
                </>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaxFilingManager;