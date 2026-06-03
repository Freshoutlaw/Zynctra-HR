/**
 * /frontend/src/components/security/AuditLogViewer.tsx
 * 
 * Audit log viewer and filter
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  changes: Record<string, any>;
  ipAddress: string;
  status: 'success' | 'failure';
}

interface AuditLogViewerProps {
  logs: AuditLog[];
  onFiltered: (filtered: AuditLog[]) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs, onFiltered }) => {
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    status: 'all' as 'all' | 'success' | 'failure',
    startDate: '',
    endDate: '',
  });

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filters.action && !log.action.includes(filters.action)) return false;
      if (filters.resource && !log.resource.includes(filters.resource)) return false;
      if (filters.status !== 'all' && log.status !== filters.status) return false;
      if (
        filters.startDate &&
        log.timestamp < new Date(filters.startDate)
      )
        return false;
      if (filters.endDate && log.timestamp > new Date(filters.endDate)) return false;
      return true;
    });
  }, [logs, filters]);

  React.useEffect(() => {
    onFiltered(filteredLogs);
  }, [filteredLogs, onFiltered]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h3 className="font-semibold">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Action"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          />
          <input
            type="text"
            placeholder="Resource"
            value={filters.resource}
            onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as 'all' | 'success' | 'failure',
              })
            }
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Resource</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-3 text-sm">{log.timestamp.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm">{log.userId}</td>
                  <td className="px-6 py-3 text-sm">{log.action}</td>
                  <td className="px-6 py-3 text-sm">{log.resource}</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing {filteredLogs.length} of {logs.length} logs
      </p>
    </motion.div>
  );
};

export default AuditLogViewer;