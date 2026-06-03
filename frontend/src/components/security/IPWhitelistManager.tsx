/**
 * /frontend/src/components/security/IPWhitelistManager.tsx
 * 
 * IP whitelist management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface WhitelistedIP {
  id: string;
  ip: string;
  description: string;
  addedAt: Date;
  addedBy: string;
  enabled: boolean;
}

interface IPWhitelistManagerProps {
  ips: WhitelistedIP[];
  onAdd: (ip: WhitelistedIP) => void;
  onRemove: (ipId: string) => void;
  onToggle: (ipId: string) => void;
}

export const IPWhitelistManager: React.FC<IPWhitelistManagerProps> = ({
  ips,
  onAdd,
  onRemove,
  onToggle,
}) => {
  const [newIP, setNewIP] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState('');

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const parts = ip.split('.');
    return ipRegex.test(ip) && parts.every((part) => parseInt(part) <= 255);
  };

  const handleAdd = () => {
    setError('');

    if (!newIP.trim()) {
      setError('IP address is required');
      return;
    }

    if (!validateIP(newIP)) {
      setError('Invalid IP address format');
      return;
    }

    if (ips.some((item) => item.ip === newIP)) {
      setError('This IP is already whitelisted');
      return;
    }

    const whitelistedIP: WhitelistedIP = {
      id: `ip_${Date.now()}`,
      ip: newIP,
      description: newDescription,
      addedAt: new Date(),
      addedBy: 'Current User',
      enabled: true,
    };

    onAdd(whitelistedIP);
    setNewIP('');
    setNewDescription('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Add IP Form */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h3 className="font-semibold">Add IP to Whitelist</h3>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">IP Address</label>
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="192.168.1.1"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Office location, VPN gateway, etc."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium"
          >
            Add to Whitelist
          </button>
        </div>
      </div>

      {/* IP List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">IP Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Added By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ips.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-3 text-sm font-mono">{item.ip}</td>
                  <td className="px-6 py-3 text-sm">{item.description}</td>
                  <td className="px-6 py-3 text-sm">{item.addedBy}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => onToggle(item.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        item.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {ips.length} IP address{ips.length !== 1 ? 'es' : ''} whitelisted
      </p>
    </motion.div>
  );
};

export default IPWhitelistManager;