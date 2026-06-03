/**
 * /frontend/src/components/ai/SmartRecommendations.tsx
 * 
 * AI-powered smart recommendations for HR decisions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  actions: RecommendationAction[];
}

export interface RecommendationAction {
  label: string;
  type: 'primary' | 'secondary';
}

interface SmartRecommendationsProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
  onAction?: (recommendationId: string, actionLabel: string) => void;
}

const impactColors = {
  high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
};

const effortColors = {
  low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

const categoryIcons: Record<string, string> = {
  retention: '👥',
  engagement: '😊',
  performance: '📊',
  compensation: '💰',
  hiring: '🎯',
  training: '📚',
  culture: '🎭',
  compliance: '⚖️',
};

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations = [],
  isLoading = false,
  onAction,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'effort' | 'confidence'>('impact');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 dark:text-slate-400">
          Loading recommendations...
        </div>
      </div>
    );
  }

  const categories = Array.from(
    new Set(recommendations.map((r) => r.category))
  );

  let filtered = recommendations;
  if (filterCategory !== 'all') {
    filtered = filtered.filter((r) => r.category === filterCategory);
  }

  // Sort recommendations
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'impact') {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    }
    if (sortBy === 'effort') {
      const effortOrder = { low: 0, medium: 1, high: 2 };
      return effortOrder[a.effort] - effortOrder[b.effort];
    }
    return b.confidence - a.confidence;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Total Recommendations
          </p>
          <p className="text-2xl font-bold">{recommendations.length}</p>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            High Impact
          </p>
          <p className="text-2xl font-bold text-red-600">
            {recommendations.filter((r) => r.impact === 'high').length}
          </p>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Avg Confidence
          </p>
          <p className="text-2xl font-bold">
            {recommendations.length > 0
              ? Math.round(
                  recommendations.reduce((sum, r) => sum + r.confidence, 0) /
                    recommendations.length
                )
              : 0}
            %
          </p>
        </motion.div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
        >
          <option value="impact">Sort by Impact</option>
          <option value="effort">Sort by Effort</option>
          <option value="confidence">Sort by Confidence</option>
        </select>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((recommendation) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setExpandedId(
                  expandedId === recommendation.id ? null : recommendation.id
                )
              }
              className={`rounded-lg border-2 border-slate-200 dark:border-slate-700 p-4 cursor-pointer transition-all hover:border-cyan-400 dark:hover:border-cyan-500`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {categoryIcons[recommendation.category]}
                    </span>
                    <h3 className="font-semibold">{recommendation.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {recommendation.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      impactColors[recommendation.impact]
                    }`}
                  >
                    {recommendation.impact.toUpperCase()} IMPACT
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Confidence
                    </div>
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                      {recommendation.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Effort Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    effortColors[recommendation.effort]
                  }`}
                >
                  Effort: {recommendation.effort}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {expandedId === recommendation.id ? '▼' : '▶'}
                </span>
              </div>

              {/* Expanded Actions */}
              <AnimatePresence>
                {expandedId === recommendation.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex gap-2 flex-wrap">
                      {recommendation.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction?.(recommendation.id, action.label);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            action.type === 'primary'
                              ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No recommendations found for this filter
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SmartRecommendations;