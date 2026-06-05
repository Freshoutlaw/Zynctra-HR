/**
 * /frontend/src/components/connectors/IntegrationMarketplace.tsx
 *
 * Browseable marketplace of available integrations.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  connected: boolean;
  popular?: boolean;
  comingSoon?: boolean;
}

interface IntegrationMarketplaceProps {
  integrations: Integration[];
  onConnect: (integrationId: string) => void;
  onDisconnect: (integrationId: string) => void;
}

const IntegrationMarketplace: React.FC<IntegrationMarketplaceProps> = ({
  integrations,
  onConnect,
  onDisconnect,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(integrations.map((i) => i.category)))];

  const filtered = integrations.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search integrations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
              : 'border-slate-300 bg-white placeholder-slate-400'
          }`}
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((integration, idx) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`rounded-lg border p-4 ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200 shadow-sm'
            } ${integration.comingSoon ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{integration.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm truncate">{integration.name}</h3>
                  {integration.popular && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 flex-shrink-0">
                      ⭐ Popular
                    </span>
                  )}
                  {integration.comingSoon && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-400/50 flex-shrink-0">
                      Soon
                    </span>
                  )}
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>
                  {integration.category}
                </p>
              </div>
            </div>
            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
              {integration.description}
            </p>

            {integration.comingSoon ? (
              <button
                disabled
                className={`w-full py-1.5 text-xs rounded-lg font-medium ${
                  isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'
                } cursor-not-allowed`}
              >
                Coming Soon
              </button>
            ) : integration.connected ? (
              <button
                onClick={() => onDisconnect(integration.id)}
                className="w-full py-1.5 text-xs rounded-lg font-medium text-red-400 border border-red-500/50 hover:bg-red-500/10 transition"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => onConnect(integration.id)}
                className="w-full py-1.5 text-xs rounded-lg font-semibold bg-cyan-500 hover:bg-cyan-600 text-slate-900 transition"
              >
                Connect
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className={`text-center py-12 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          No integrations match your search.
        </div>
      )}
    </motion.div>
  );
};

export default IntegrationMarketplace;