/**
 * /frontend/src/pages/EmployeeDirectory.tsx
 * 
 * Employee directory and search
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const EmployeeDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Employee Directory</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Search and manage employee information
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
          </select>
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
              onClick={() => setViewType('grid')}
              className={`px-4 py-2 rounded ${
                viewType === 'grid'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-4 py-2 rounded ${
                viewType === 'list'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-lg font-medium mb-2">Employee Directory</p>
        <p>
          {viewType === 'grid'
            ? 'Employee profiles would display in grid view here'
            : 'Employee list would display here'}
        </p>
      </div>
    </motion.div>
  );
};

export default EmployeeDirectory;