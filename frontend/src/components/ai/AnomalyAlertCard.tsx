/**
 * /frontend/src/components/ai/AnomalyAlertCard.tsx
 *
 * Real-time anomaly alert card for HR platform security monitoring.
 * Displays detected anomalies with severity, actions, and dismiss controls.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface AnomalyAlert {
  id: string;
  type: string;
  severity: AnomalySeverity;
  title: string;
  description: string;
  affectedUser?: string;
  affectedResource?: string;
  detectedAt: Date;
  confidence: number; // 0-100
  suggestedActions?: string[];
}

interface AnomalyAlertCardProps {
  alert: AnomalyAlert;
  onDismiss?: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  onInvestigate?: (id: string) => void;
  compact?: boolean;
}

const severityConfig: Record<AnomalySeverity, {
  bg: string;
  border: string;
  badge: string;
  text: string;
  icon: string;
  pulse: string;
}> = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/60',
    badge: 'bg-red-500/20 text-red-300 border-red-400/50',
    text: 'text-red-400',
    icon: '🚨',
    pulse: 'bg-red-500',
  },
  high: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-400/50',
    text: 'text-orange-400',
    icon: '⚠️',
    pulse: 'bg-orange-500',
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    text: 'text-yellow-400',
    icon: '⚡',
    pulse: 'bg-yellow-500',
  },
  low: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
    text: 'text-blue-400',
    icon: 'ℹ️',
    pulse: 'bg-blue-500',
  },
};

export const AnomalyAlertCard: React.FC<AnomalyAlertCardProps> = ({
  alert,
  onDismiss,
  onAcknowledge,
  onInvestigate,
  compact = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const cfg = severityConfig[alert.severity];

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss?.(alert.id), 300);
  };

  const timeAgo = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={`rounded-lg border-2 ${cfg.bg} ${cfg.border} overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`h-0.5 ${cfg.pulse} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-start gap-3">
              {/* Pulse indicator */}
              <div className="relative flex-shrink-0 mt-0.5">
                <span className="text-xl">{cfg.icon}</span>
                {alert.severity === 'critical' && (
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${cfg.pulse} rounded-full animate-ping`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${cfg.badge}`}>
                    {alert.severity}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {alert.type}
                  </span>
                  <span className={`text-xs ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {timeAgo(alert.detectedAt)}
                  </span>
                </div>

                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>

                {!compact && (
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {alert.description}
                  </p>
                )}

                {/* Affected targets */}
                {(alert.affectedUser || alert.affectedResource) && !compact && (
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {alert.affectedUser && (
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        👤 {alert.affectedUser}
                      </span>
                    )}
                    {alert.affectedResource && (
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        📁 {alert.affectedResource}
                      </span>
                    )}
                  </div>
                )}

                {/* Confidence bar */}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Confidence:
                  </span>
                  <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${alert.confidence}%` }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className={`h-full rounded-full ${cfg.pulse}`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${cfg.text}`}>{alert.confidence}%</span>
                </div>
              </div>

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className={`flex-shrink-0 p-1 rounded transition ${
                  isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            {/* Suggested actions (expandable) */}
            {!compact && alert.suggestedActions && alert.suggestedActions.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`mt-3 text-xs font-medium flex items-center gap-1 ${cfg.text} hover:opacity-80 transition`}
                >
                  <span>{expanded ? '▼' : '▶'}</span>
                  {expanded ? 'Hide' : 'Show'} suggested actions ({alert.suggestedActions.length})
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1"
                    >
                      {alert.suggestedActions.map((action, idx) => (
                        <li key={idx} className={`text-xs flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className={cfg.text}>→</span>
                          {action}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Action buttons */}
            {!compact && (onAcknowledge || onInvestigate) && (
              <div className="flex gap-2 mt-3">
                {onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${cfg.badge}`}
                  >
                    Acknowledge
                  </button>
                )}
                {onInvestigate && (
                  <button
                    onClick={() => onInvestigate(alert.id)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-900 transition"
                  >
                    Investigate →
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * AnomalyAlertFeed — renders a stack of alert cards with a summary header.
 */
interface AnomalyAlertFeedProps {
  alerts: AnomalyAlert[];
  onDismiss?: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  onInvestigate?: (id: string) => void;
  maxVisible?: number;
}

export const AnomalyAlertFeed: React.FC<AnomalyAlertFeedProps> = ({
  alerts,
  onDismiss,
  onAcknowledge,
  onInvestigate,
  maxVisible = 5,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [showAll, setShowAll] = useState(false);

  const critical = alerts.filter((a) => a.severity === 'critical').length;
  const high = alerts.filter((a) => a.severity === 'high').length;
  const visible = showAll ? alerts : alerts.slice(0, maxVisible);

  if (alerts.length === 0) {
    return (
      <div className={`rounded-lg border p-6 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="text-3xl mb-2">✅</div>
        <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No anomalies detected</p>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>All systems operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{alerts.length} anomalies</span>
          {critical > 0 && <span className="text-red-400 font-medium">{critical} critical</span>}
          {high > 0 && <span className="text-orange-400 font-medium">{high} high</span>}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition"
        >
          {showAll ? 'Collapse' : `Show all ${alerts.length}`}
        </button>
      </div>

      {/* Cards */}
      {visible.map((alert) => (
        <AnomalyAlertCard
          key={alert.id}
          alert={alert}
          {...(onDismiss ? { onDismiss } : {})}
          {...(onAcknowledge ? { onAcknowledge } : {})}
          {...(onInvestigate ? { onInvestigate } : {})}
        />
      ))}

      {!showAll && alerts.length > maxVisible && (
        <button
          onClick={() => setShowAll(true)}
          className={`w-full py-2 text-xs font-medium rounded-lg border transition ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
          + {alerts.length - maxVisible} more alerts
        </button>
      )}
    </div>
  );
};

export default AnomalyAlertCard;