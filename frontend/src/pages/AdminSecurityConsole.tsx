/**
 * /frontend/src/pages/AdminSecurityConsole.tsx
 * 
 * Security administration console
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const AdminSecurityConsole: React.FC = () => {
  const [tab, setTab] = useState<'audit' | 'anomalies' | 'access' | 'settings'>('audit');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Console</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Monitor security events, anomalies, and access logs
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
        {(['audit', 'anomalies', 'access', 'settings'] as const).map((t) => (
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
        {tab === 'audit' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Audit Logs</p>
            <p>Audit trail and security events would display here</p>
          </div>
        )}
        {tab === 'anomalies' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Anomaly Detection</p>
            <p>Detected anomalies and alerts would display here</p>
          </div>
        )}
        {tab === 'access' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Access Logs</p>
            <p>User access and login history would display here</p>
          </div>
        )}
        {tab === 'settings' && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium mb-2">Security Settings</p>
            <p>MFA, IP whitelist, and policies would configure here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSecurityConsole;