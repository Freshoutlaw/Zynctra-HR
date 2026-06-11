/**
 * /frontend/src/components/analytics/CustomReportBuilder.tsx
 * 
 * Advanced custom report builder with drag-and-drop metrics
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricField {
  id: string;
  name: string;
  type: 'number' | 'percentage' | 'currency' | 'date';
}

interface ReportConfig {
  name: string;
  description: string;
  metrics: MetricField[];
  groupBy?: string;
  filters: Record<string, any>;
  schedule?: 'daily' | 'weekly' | 'monthly';
}

interface CustomReportBuilderProps {
  onSave?: (config: ReportConfig) => void;
  template?: ReportConfig;
}

const availableMetrics: MetricField[] = [
  { id: 'headcount', name: 'Headcount', type: 'number' },
  { id: 'turnover', name: 'Turnover Rate', type: 'percentage' },
  { id: 'payroll', name: 'Payroll Spend', type: 'currency' },
  { id: 'avgSalary', name: 'Average Salary', type: 'currency' },
  { id: 'hireDate', name: 'Hire Date', type: 'date' },
  { id: 'retention', name: 'Retention Rate', type: 'percentage' },
  { id: 'productivity', name: 'Productivity Index', type: 'number' },
  { id: 'engagement', name: 'Engagement Score', type: 'percentage' },
];

export const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({
  onSave,
  template,
}) => {
  const [reportName, setReportName] = useState(template?.name || '');
  const [reportDesc, setReportDesc] = useState(template?.description || '');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricField[]>(
    template?.metrics || []
  );
  const [groupBy, setGroupBy] = useState(template?.groupBy || '');
  const [schedule, setSchedule] = useState<'daily' | 'weekly' | 'monthly'>(
    template?.schedule || 'weekly'
  );

  const handleAddMetric = useCallback((metric: MetricField) => {
    setSelectedMetrics((prev) =>
      prev.find((m) => m.id === metric.id) ? prev : [...prev, metric]
    );
  }, []);

  const handleRemoveMetric = useCallback((metricId: string) => {
    setSelectedMetrics((prev) => prev.filter((m) => m.id !== metricId));
  }, []);

  const handleSave = useCallback(() => {
    if (!reportName.trim()) {
      alert('Report name is required');
      return;
    }

    const config: ReportConfig = {
      name: reportName,
      description: reportDesc,
      metrics: selectedMetrics,
      ...(groupBy ? { groupBy } : {}),
      filters: {},
      schedule,
    };

    onSave?.(config);
  }, [reportName, reportDesc, selectedMetrics, groupBy, schedule, onSave]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Report Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Report Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Report Name *
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., Monthly HR Summary"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule
            </label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={reportDesc}
            onChange={(e) => setReportDesc(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
      </div>

      {/* Metrics Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-semibold mb-4">Available Metrics</h4>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <motion.button
                key={metric.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddMetric(metric)}
                disabled={selectedMetrics.some((m) => m.id === metric.id)}
                className="w-full text-left p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="font-medium text-sm">{metric.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.type}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-semibold mb-4">
            Selected Metrics ({selectedMetrics.length})
          </h4>
          <AnimatePresence>
            {selectedMetrics.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select metrics to include in report
              </p>
            ) : (
              <div className="space-y-2">
                {selectedMetrics.map((metric, idx) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-slate-700 border border-cyan-200 dark:border-slate-600 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">{metric.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {idx + 1}. {metric.type}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMetric(metric.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Group By */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <label className="block text-sm font-medium mb-3">Group By (Optional)</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="">None</option>
          <option value="department">Department</option>
          <option value="location">Location</option>
          <option value="team">Team</option>
          <option value="manager">Manager</option>
          <option value="role">Role</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={selectedMetrics.length === 0 || !reportName}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
        >
          Save Report
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CustomReportBuilder;