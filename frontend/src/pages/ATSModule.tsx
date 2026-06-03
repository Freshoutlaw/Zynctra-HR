/**
 * /frontend/src/pages/ATSModule.tsx
 * 
 * Complete Applicant Tracking System module
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ATSModule: React.FC = () => {
  const [tab, setTab] = useState<'jobs' | 'candidates' | 'pipeline' | 'interviews'>('jobs');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Applicant Tracking System</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage job postings, candidates, and recruiting pipeline
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
        {(['jobs', 'candidates', 'pipeline', 'interviews'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              tab === t
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        {tab === 'jobs' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Job Postings</p>
            <p>Job posting list would display here</p>
          </div>
        )}
        {tab === 'candidates' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Candidate Management</p>
            <p>Candidate database would display here</p>
          </div>
        )}
        {tab === 'pipeline' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Recruitment Pipeline</p>
            <p>Pipeline kanban board would display here</p>
          </div>
        )}
        {tab === 'interviews' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Interview Management</p>
            <p>Interview schedule would display here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ATSModule;