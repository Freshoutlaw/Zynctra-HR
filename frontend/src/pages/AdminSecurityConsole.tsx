/**
 * /frontend/src/pages/AdminSecurityConsole.tsx
 *
 * Security administration console.
 * Fixed: imports wired to real components; useAuth used correctly.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth.types';
import securityService from '../services/api/securityService';
import { AnomalyDetectionDashboard, type DetectedAnomaly } from '../components/security/AnomalyDetectionDashboard';
import { AuditLogViewer, type AuditLog } from '../components/security/AuditLogViewer';
import { IPWhitelistManager, type WhitelistedIP } from '../components/security/IPWhitelistManager';
import AppLayout from '../components/layout/AppLayout';
import Spinner from '../components/common/Spinner';

type ConsoleTab = 'audit' | 'anomalies' | 'access' | 'settings';

const AdminSecurityConsole: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const { user } = useAuth();
  const isDark = effectiveTheme === 'dark';
  const [tab, setTab] = useState<ConsoleTab>('anomalies');
  const [anomalies, setAnomalies] = useState<DetectedAnomaly[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ipWhitelist, setIpWhitelist] = useState<WhitelistedIP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.TENANT_ADMIN;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tab === 'anomalies') {
        const data = await securityService.getAnomalies();
        setAnomalies(data as DetectedAnomaly[]);
      } else if (tab === 'audit') {
        const data = await securityService.getAuditLogs();
        setAuditLogs(data as AuditLog[]);
      } else if (tab === 'access') {
        const data = await securityService.getIPWhitelist();
        setIpWhitelist(data as WhitelistedIP[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (isAdmin) void loadData();
  }, [isAdmin, loadData]);

  const handleAcknowledge = async (id: string) => {
    await securityService.reportAnomaly(id, 'acknowledge');
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAddIP = (ip: WhitelistedIP) =>
    setIpWhitelist((prev) => [...prev, ip]);

  const handleRemoveIP = async (id: string) => {
    await securityService.removeIPWhitelist(id);
    setIpWhitelist((prev) => prev.filter((ip) => ip.id !== id));
  };

  const handleToggleIP = (id: string) =>
    setIpWhitelist((prev) =>
      prev.map((ip) => (ip.id === id ? { ...ip, enabled: !ip.enabled } : ip))
    );

  if (!isAdmin) {
    return (
      <AppLayout showSidebar>
        <div className={`text-center py-16 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            You need administrator privileges to access the security console.
          </p>
        </div>
      </AppLayout>
    );
  }

  const TABS: { id: ConsoleTab; label: string }[] = [
    { id: 'anomalies', label: '🔴 Anomalies' },
    { id: 'audit', label: '📋 Audit Logs' },
    { id: 'access', label: '🌐 IP Whitelist' },
    { id: 'settings', label: '⚙️ Security Settings' },
  ];

  return (
    <AppLayout showSidebar showFooter={false}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Security Console</h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Monitor security events, anomalies, and access control.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
              tab === t.id ? 'bg-cyan-500 text-slate-900' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className={`p-4 rounded-lg border mb-6 text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" message="Loading security data…" />
        </div>
      ) : (
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'anomalies' && (
            <AnomalyDetectionDashboard
              anomalies={anomalies}
              onAcknowledge={handleAcknowledge}
              realTimeStats={{
                totalDetected: anomalies.length,
                resolved: anomalies.filter((a) => a.acknowledged).length,
                pending: anomalies.filter((a) => !a.acknowledged).length,
                criticalCount: anomalies.filter((a) => a.severity === 'critical').length,
              }}
            />
          )}

          {tab === 'audit' && (
            <AuditLogViewer
              logs={auditLogs}
              onFiltered={(filtered) => console.log(`Filtered to ${filtered.length} logs`)}
            />
          )}

          {tab === 'access' && (
            <IPWhitelistManager
              ips={ipWhitelist}
              onAdd={handleAddIP}
              onRemove={(id) => void handleRemoveIP(id)}
              onToggle={handleToggleIP}
            />
          )}

          {tab === 'settings' && (
            <div className={`rounded-lg border p-8 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className="text-4xl mb-3">⚙️</p>
              <p className="font-semibold mb-1">Security Settings</p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                MFA enforcement, session policies, and compliance settings.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AppLayout>
  );
};

export default AdminSecurityConsole;