/**
 * /frontend/src/components/connectors/SyncStatusMonitor.tsx
 *
 * Real-time sync status for connected integrations.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface SyncStatus {
  connectorId: string;
  connectorName: string;
  icon: string;
  status: 'syncing' | 'success' | 'error' | 'idle';
  lastSync?: Date;
  recordsSynced?: number;
  errorMessage?: string;
  nextSync?: Date;
}

interface SyncStatusMonitorProps {
  statuses: SyncStatus[];
  onTriggerSync?: (connectorId: string) => void;
}

const statusConfig = {
  syncing: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/20 border-blue-400/50',
    label: 'Syncing…',
    icon: '🔄',
  },
  success: {
    color: 'text-green-400',
    bg: 'bg-green-500/20 border-green-400/50',
    label: 'Success',
    icon: '✓',
  },
  error: {
    color: 'text-red-400',
    bg: 'bg-red-500/20 border-red-400/50',
    label: 'Error',
    icon: '✕',
  },
  idle: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/20 border-slate-400/50',
    label: 'Idle',
    icon: '⏸',
  },
};

const SyncStatusMonitor: React.FC<SyncStatusMonitorProps> = ({
  statuses,
  onTriggerSync,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {statuses.map((s, idx) => {
        const cfg = statusConfig[s.status];
        return (
          <motion.div
            key={s.connectorId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-lg border p-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm">{s.connectorName}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                    {s.status === 'syncing' && (
                      <motion.span
                        className="text-blue-400 text-sm"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        ⟳
                      </motion.span>
                    )}
                  </div>

                  <div className={`flex gap-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {s.lastSync && (
                      <span>Last: {s.lastSync.toLocaleString()}</span>
                    )}
                    {s.recordsSynced !== undefined && (
                      <span>{s.recordsSynced.toLocaleString()} records</span>
                    )}
                    {s.nextSync && (
                      <span>Next: {s.nextSync.toLocaleString()}</span>
                    )}
                  </div>

                  {s.errorMessage && (
                    <p className="text-xs text-red-400 mt-1 truncate">
                      {s.errorMessage}
                    </p>
                  )}
                </div>
              </div>

              {onTriggerSync && s.status !== 'syncing' && (
                <button
                  onClick={() => onTriggerSync(s.connectorId)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0 transition ${
                    isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ↺ Sync Now
                </button>
              )}
            </div>
          </motion.div>
        );
      })}

      {statuses.length === 0 && (
        <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No connected integrations to monitor.
        </div>
      )}
    </motion.div>
  );
};

export default SyncStatusMonitor;