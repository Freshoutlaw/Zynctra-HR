/**
 * /frontend/src/components/security/IncidentResponsePanel.tsx
 * 
 * Security incident response panel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface SecurityIncident {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo: string;
  actions: string[];
}

interface IncidentResponsePanelProps {
  incidents: SecurityIncident[];
  onUpdate: (incident: SecurityIncident) => void;
}

export const IncidentResponsePanel: React.FC<IncidentResponsePanelProps> = ({
  incidents,
  onUpdate,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(
    incidents[0] || null
  );
  const [newAction, setNewAction] = useState('');

  const handleAddAction = () => {
    if (selectedIncident && newAction.trim()) {
      const updated = {
        ...selectedIncident,
        actions: [...selectedIncident.actions, newAction],
      };
      onUpdate(updated);
      setNewAction('');
    }
  };

  const handleStatusChange = (status: SecurityIncident['status']) => {
    if (selectedIncident) {
      const updated = { ...selectedIncident, status };
      onUpdate(updated);
      setSelectedIncident(updated);
    }
  };

  const getSeverityColor = (severity: SecurityIncident['severity']) => {
    const colors = {
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    };
    return colors[severity];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Incidents List */}
      <div className="lg:col-span-1 space-y-2">
        {incidents.map((incident) => (
          <button
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedIncident?.id === incident.id
                ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{incident.type}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {incident.timestamp.toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>

      {/* Incident Details */}
      {selectedIncident && (
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{selectedIncident.type}</h3>
            <p className="text-slate-600 dark:text-slate-400">{selectedIncident.description}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="flex gap-2">
              {(['open', 'investigating', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedIncident.status === status
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-sm font-medium mb-2">Response Actions</label>
            <div className="space-y-2 mb-4">
              {selectedIncident.actions.map((action, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                  {action}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Add new response action..."
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              />
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium mb-2">Assigned To</label>
            <p className="text-slate-600 dark:text-slate-400">{selectedIncident.assignedTo}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IncidentResponsePanel;