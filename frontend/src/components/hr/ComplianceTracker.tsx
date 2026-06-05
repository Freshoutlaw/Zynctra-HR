/**
 * /frontend/src/components/hr/ComplianceTracker.tsx
 *
 * Displays compliance tasks/requirements with status tracking.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: Date;
  status: 'compliant' | 'pending' | 'overdue' | 'not_applicable';
  assignedTo?: string;
  notes?: string;
}

interface ComplianceTrackerProps {
  items: ComplianceItem[];
  onUpdateStatus?: (id: string, status: ComplianceItem['status']) => void;
}

const statusConfig: Record<ComplianceItem['status'], { label: string; color: string; icon: string }> = {
  compliant: {
    label: 'Compliant',
    color: 'bg-green-500/20 text-green-300 border-green-400/50',
    icon: '✓',
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    icon: '⏳',
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-red-500/20 text-red-300 border-red-400/50',
    icon: '⚠',
  },
  not_applicable: {
    label: 'N/A',
    color: 'bg-slate-500/20 text-slate-300 border-slate-400/50',
    icon: '—',
  },
};

const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({
  items,
  onUpdateStatus,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [filterStatus, setFilterStatus] = useState<ComplianceItem['status'] | 'all'>('all');

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filtered =
    filterStatus === 'all'
      ? items
      : items.filter((i) => i.status === filterStatus);

  const compliantCount = items.filter((i) => i.status === 'compliant').length;
  const overdueCount = items.filter((i) => i.status === 'overdue').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(
          [
            { label: 'Total Items', value: items.length, color: 'text-white' },
            { label: 'Compliant', value: compliantCount, color: 'text-green-400' },
            { label: 'Overdue', value: overdueCount, color: 'text-red-400' },
            {
              label: 'Completion',
              value: `${items.length > 0 ? Math.round((compliantCount / items.length) * 100) : 0}%`,
              color: 'text-cyan-400',
            },
          ] as const
        ).map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <p
              className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              } mb-1`}
            >
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'compliant', 'pending', 'overdue', 'not_applicable'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterStatus === status
                  ? 'bg-cyan-500 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {status === 'all' ? 'All' : statusConfig[status].label}
            </button>
          )
        )}
      </div>

      {/* Items grouped by category */}
      {categories.map((cat) => {
        const catItems = filtered.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="font-semibold mb-3">{cat}</h3>
            <div className="space-y-3">
              {catItems.map((item) => {
                const cfg = statusConfig[item.status];
                const isOverdue = item.status !== 'compliant' && new Date() > item.dueDate;

                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}
                          >
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>
                        <p
                          className={`text-xs mb-2 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {item.description}
                        </p>
                        <div className="flex gap-4 text-xs">
                          <span
                            className={isOverdue ? 'text-red-400 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'}
                          >
                            Due: {item.dueDate.toLocaleDateString()}
                          </span>
                          {item.assignedTo && (
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                              👤 {item.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>

                      {onUpdateStatus && (
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              item.id,
                              e.target.value as ComplianceItem['status']
                            )
                          }
                          className={`text-xs px-2 py-1 rounded border ${
                            isDark
                              ? 'bg-slate-700 border-slate-600 text-slate-300'
                              : 'bg-slate-50 border-slate-300 text-slate-700'
                          } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                        >
                          {Object.entries(statusConfig).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div
          className={`text-center py-12 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          No compliance items found for this filter.
        </div>
      )}
    </motion.div>
  );
};

export default ComplianceTracker;