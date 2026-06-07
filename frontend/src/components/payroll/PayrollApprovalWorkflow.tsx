/**
 * /frontend/src/components/payroll/PayrollApprovalWorkflow.tsx
 * Payroll approval workflow and process
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PayrollApproval {
  id: string;
  payrollId: string;
  payPeriod: string;
  totalAmount: number;
  currency: string;
  employeeCount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'processed';
  submittedBy: string;
  submittedDate: Date;
  approvers: Array<{
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    date?: Date;
  }>;
}

interface PayrollApprovalWorkflowProps {
  approvals: PayrollApproval[];
  currentUserRole: string;
  onApprove: (approvalId: string, comments: string) => void;
  onReject: (approvalId: string, reason: string) => void;
}

export const PayrollApprovalWorkflow: React.FC<PayrollApprovalWorkflowProps> = ({
  approvals,
  currentUserRole,
  onApprove,
  onReject,
}) => {
  const [selectedApproval, setSelectedApproval] = useState<PayrollApproval | null>(null);
  const [approvalComments, setApprovalComments] = useState('');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      processed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    };
    return colors[status] || colors.draft;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Payroll List */}
      <div className="lg:col-span-1 space-y-2">
        <h3 className="font-semibold text-sm mb-4">Payroll Batches</h3>
        {approvals.map((approval) => (
          <button
            key={approval.id}
            onClick={() => setSelectedApproval(approval)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedApproval?.id === approval.id
                ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{approval.payPeriod}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(approval.status)}`}>
                {approval.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {approval.employeeCount} employees
            </p>
            <p className="text-sm font-semibold mt-2">
              {approval.currency} {approval.totalAmount.toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      {/* Approval Details */}
      {selectedApproval && (
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{selectedApproval.payPeriod}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount</p>
                <p className="text-2xl font-bold">
                  {selectedApproval.currency} {selectedApproval.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Employee Count</p>
                <p className="text-2xl font-bold">{selectedApproval.employeeCount}</p>
              </div>
            </div>
          </div>

          {/* Approval Chain */}
          <div>
            <h4 className="font-semibold mb-4">Approval Chain</h4>
            <div className="space-y-3">
              {selectedApproval.approvers.map((approver, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{approver.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{approver.role}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        approver.status === 'approved'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : approver.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                      }`}
                    >
                      {approver.status}
                    </span>
                  </div>
                  {approver.comments && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{approver.comments}</p>
                  )}
                  {approver.date && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {approver.date.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(currentUserRole === 'admin' || currentUserRole === 'finance') &&
            selectedApproval.status === 'pending' && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium mb-2">Comments</label>
                  <textarea
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    placeholder="Add approval comments..."
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(selectedApproval.id, approvalComments)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(selectedApproval.id, approvalComments)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </motion.div>
  );
};

export default PayrollApprovalWorkflow;