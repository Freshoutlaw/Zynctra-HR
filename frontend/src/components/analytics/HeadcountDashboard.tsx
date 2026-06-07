/**
 * /frontend/src/components/analytics/HeadcountDashboard.tsx
 * 
 * Real-time headcount and workforce analytics dashboard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HeadcountData {
  total: number;
  active: number;
  onLeave: number;
  terminated: number;
  byDepartment: Record<string, number>;
  byLocation: Record<string, number>;
  trend: number[]; // Last 12 months
}

interface HeadcountDashboardProps {
  data?: HeadcountData;
  isLoading?: boolean;
}

const defaultData: HeadcountData = {
  total: 325,
  active: 312,
  onLeave: 8,
  terminated: 5,
  byDepartment: {
    Engineering: 95,
    Sales: 65,
    Marketing: 32,
    Operations: 48,
    Finance: 25,
    HR: 18,
    Legal: 12,
    Other: 30,
  },
  byLocation: {
    Lagos: 156,
    Abuja: 89,
    Remote: 80,
  },
  trend: [250, 260, 275, 285, 295, 305, 308, 312, 315, 318, 320, 325],
};

const StatCard: React.FC<{
  label: string;
  value: number;
  change?: number;
  icon?: string;
}> = ({ label, value, change, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      </div>
      {icon && <span className="text-3xl">{icon}</span>}
    </div>
    {change !== undefined && (
      <div
        className={`text-xs mt-2 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
      </div>
    )}
  </motion.div>
);

export const HeadcountDashboard: React.FC<HeadcountDashboardProps> = ({
  data = defaultData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">Loading headcount data...</div>
      </div>
    );
  }

  const deptEntries = Object.entries(data.byDepartment);
  const maxDeptCount = Math.max(...deptEntries.map(([, v]) => v));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Headcount"
          value={data.total}
          change={3}
          icon="👥"
        />
        <StatCard
          label="Active Employees"
          value={data.active}
          change={2.5}
          icon="✅"
        />
        <StatCard label="On Leave" value={data.onLeave} icon="📅" />
        <StatCard label="Terminated YTD" value={data.terminated} icon="📊" />
      </div>

      {/* Headcount Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold mb-4">Headcount Trend (12 Months)</h3>
        <div className="flex items-end gap-1 h-48">
          {data.trend.map((count, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${(count / 350) * 100}%` }}
              transition={{ delay: idx * 0.05 }}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t hover:opacity-80 cursor-pointer group relative"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                {count}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
          <span>Dec</span>
        </div>
      </div>

      {/* By Department */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold mb-4">Headcount by Department</h3>
        <div className="space-y-4">
          {deptEntries.map(([dept, count]) => (
            <motion.div
              key={dept}
              onMouseEnter={() => {}}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{dept}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {count} ({((count / data.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxDeptCount) * 100}%` }}
                  transition={{ delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400 transition-colors rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* By Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4">Headcount by Location</h3>
          <div className="space-y-3">
            {Object.entries(data.byLocation).map(([location, count]) => (
              <div
                key={location}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <span className="font-medium">{location}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Active', count: data.active, color: 'bg-green-500' },
              { label: 'On Leave', count: data.onLeave, color: 'bg-yellow-500' },
              { label: 'Terminated', count: data.terminated, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm">{label}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeadcountDashboard;