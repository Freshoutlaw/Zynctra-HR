/**
 * /frontend/src/components/security/AnomalyDetectionDashboard.tsx
 *
 * Real-time anomaly detection dashboard.
 * Fixed: removed stray comment prefix; unused import removed.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface DetectedAnomaly {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: Date;
  description: string;
  affectedUser?: string;
  affectedResource?: string;
  acknowledged: boolean;
}

interface AnomalyDetectionDashboardProps {
  anomalies: DetectedAnomaly[];
  onAcknowledge: (anomalyId: string) => void;
  realTimeStats?: {
    totalDetected: number;
    resolved: number;
    pending: number;
    criticalCount: number;
  };
}

export const AnomalyDetectionDashboard: React.FC<AnomalyDetectionDashboardProps> = ({ anomalies, onAcknowledge, realTimeStats }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'pending'>('pending');

  const filteredAnomalies = anomalies.filter((a) => {
    if (filter === 'pending') return !a.acknowledged;
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'high') return a.severity === 'high';
    return true;
  });

  const getSeverityIcon = (severity: DetectedAnomaly['severity']): string => {
    const icons: Record<DetectedAnomaly['severity'], string> = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
    };
    return icons[severity];
  };

  const statCards = realTimeStats
    ? [
        { label: 'Total Detected', value: realTimeStats.totalDetected, color: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Resolved', value: realTimeStats.resolved, color: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'Pending', value: realTimeStats.pending, color: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { label: 'Critical', value: realTimeStats.criticalCount, color: 'bg-red-100 dark:bg-red-900/30' },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.color} rounded-lg p-4`}
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
        {(['all', 'pending', 'high', 'critical'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              filter === f
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Anomaly list */}
      <div className="space-y-3">
        {filteredAnomalies.map((anomaly, idx) => (
          <motion.div
            key={anomaly.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-lg border ${
              anomaly.acknowledged
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getSeverityIcon(anomaly.severity)}</span>
                  <div>
                    <p className="font-semibold">{anomaly.type}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Confidence: {Math.round(anomaly.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  {anomaly.description}
                </p>
                {anomaly.affectedUser && (
                  <p className="text-xs text-slate-500">User: {anomaly.affectedUser}</p>
                )}
                {anomaly.affectedResource && (
                  <p className="text-xs text-slate-500">
                    Resource: {anomaly.affectedResource}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(anomaly.timestamp).toLocaleString()}
                </p>
              </div>
              {!anomaly.acknowledged && (
                <button
                  onClick={() => onAcknowledge(anomaly.id)}
                  className="ml-4 px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 whitespace-nowrap"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {filteredAnomalies.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No anomalies detected for this filter
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnomalyDetectionDashboard;