/**
 * /frontend/src/components/hr/OrgChart.tsx
 *
 * Simple hierarchical org-chart rendered with SVG lines.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  children?: OrgNode[];
}

interface OrgChartProps {
  root: OrgNode;
  onNodeClick?: ((node: OrgNode) => void) | undefined;
}

interface NodeCardProps {
  node: OrgNode;
  onNodeClick?: ((node: OrgNode) => void) | undefined;
  depth: number;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, onNodeClick, depth }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const initial = node.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          onNodeClick?.(node);
          if (hasChildren) setExpanded((e) => !e);
        }}
        className={`relative w-40 rounded-lg border p-3 text-center cursor-pointer transition-all ${
          isDark
            ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50'
            : 'bg-white border-slate-200 shadow hover:shadow-md hover:border-cyan-300'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold mx-auto mb-2 select-none">
          {initial}
        </div>
        <p className="font-semibold text-xs truncate">{node.name}</p>
        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {node.role}
        </p>
        {node.department && (
          <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {node.department}
          </p>
        )}
        {hasChildren && (
          <div
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
              isDark
                ? 'bg-slate-900 border-slate-600 text-slate-300'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
          >
            {expanded ? '−' : '+'}
          </div>
        )}
      </motion.div>

      {/* Connector line down */}
      {hasChildren && expanded && (
        <div
          className={`w-px h-6 mt-3 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}
        />
      )}

      {/* Children row */}
      {hasChildren && expanded && (
        <div className="flex gap-6 items-start relative">
          {/* Horizontal connector */}
          {node.children!.length > 1 && (
            <div
              className={`absolute top-0 left-0 right-0 h-px ${
                isDark ? 'bg-slate-600' : 'bg-slate-300'
              }`}
            />
          )}
          {node.children!.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* Vertical line from parent to child */}
              <div
                className={`w-px h-6 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}
              />
              <NodeCard
                node={child}
                onNodeClick={onNodeClick}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC<OrgChartProps> = ({ root, onNodeClick }) => {
  return (
    <div className="overflow-auto p-8 flex justify-center">
      <NodeCard node={root} onNodeClick={onNodeClick} depth={0} />
    </div>
  );
};

export default OrgChart;