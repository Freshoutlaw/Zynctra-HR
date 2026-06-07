/**
 * /frontend/src/components/connectors/ConnectorConfig.tsx
 *
 * Configuration UI for a single integration connector.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface ConnectorField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

export interface ConnectorDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: ConnectorField[];
  connected?: boolean;
  lastSynced?: Date;
}

interface ConnectorConfigProps {
  connector: ConnectorDefinition;
  onSave: (connectorId: string, config: Record<string, string>) => void | Promise<void>;
  onDisconnect?: (connectorId: string) => void;
  isLoading?: boolean;
}

const ConnectorConfig: React.FC<ConnectorConfigProps> = ({
  connector,
  onSave,
  onDisconnect,
  isLoading = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [config, setConfig] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const inputClass = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm ${
    isDark
      ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
  }`;

  const handleSave = async () => {
    setError(null);
    const missing = connector.fields
      .filter((f) => f.required && !config[f.key]?.trim())
      .map((f) => f.label);
    if (missing.length > 0) {
      setError(`Required fields missing: ${missing.join(', ')}`);
      return;
    }
    await onSave(connector.id, config);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-6 space-y-5 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="text-4xl">{connector.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg">{connector.name}</h3>
            {connector.connected && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/50 font-medium">
                ✓ Connected
              </span>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {connector.description}
          </p>
          {connector.lastSynced && (
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Last synced: {connector.lastSynced.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm p-3 rounded-lg border ${
            isDark
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-red-50 border-red-300 text-red-700'
          }`}
        >
          {error}
        </motion.div>
      )}

      {/* Fields */}
      <div className="space-y-4">
        {connector.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                value={config[field.key] ?? ''}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className={inputClass}
              >
                <option value="">Select…</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={
                    field.type === 'password' && !showValues[field.key]
                      ? 'password'
                      : 'text'
                  }
                  value={config[field.key] ?? ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className={`${inputClass} ${field.type === 'password' ? 'pr-10' : ''}`}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowValues((prev) => ({
                        ...prev,
                        [field.key]: !prev[field.key],
                      }))
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                    tabIndex={-1}
                  >
                    {showValues[field.key] ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
            )}
            {field.hint && (
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {field.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          whileHover={!isLoading  ? { scale: 1.02 } : {}}
          whileTap={!isLoading  ? { scale: 0.98 } : {}}
        >
          {isLoading ? 'Saving…' : connector.connected ? 'Update' : 'Connect'}
        </motion.button>

        {connector.connected && onDisconnect && (
          <button
            onClick={() => onDisconnect(connector.id)}
            className="px-4 py-2 rounded-lg text-sm text-red-400 border border-red-500/50 hover:bg-red-500/10 transition"
          >
            Disconnect
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ConnectorConfig;