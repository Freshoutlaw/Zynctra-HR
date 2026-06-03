/**
 * /frontend/src/components/ats/AIcandidateScoring.tsx
 * 
 * Machine learning candidate evaluation and scoring
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CandidateScore {
  candidateId: string;
  name: string;
  position: string;
  overallScore: number;
  criteria: ScoringCriteria[];
  recommendation: 'strong_match' | 'good_match' | 'consider' | 'pass';
  reasoning: string;
}

export interface ScoringCriteria {
  name: string;
  weight: number;
  score: number;
  feedback: string;
}

interface AICandidateScoringProps {
  candidates?: CandidateScore[];
  isLoading?: boolean;
  onSelectCandidate?: (candidateId: string) => void;
}

const recommendationConfig = {
  strong_match: {
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    icon: '✅',
  },
  good_match: {
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    icon: '👍',
  },
  consider: {
    color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    icon: '⚠️',
  },
  pass: {
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    icon: '❌',
  },
};

export const AIcandidateScoring: React.FC<AICandidateScoringProps> = ({
  candidates = [],
  isLoading = false,
  onSelectCandidate,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'recommendation' | 'name'>('score');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 dark:text-slate-400">
          Scoring candidates with AI...
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No candidates to score
      </div>
    );
  }

  let sorted = [...candidates];
  if (sortBy === 'score') {
    sorted.sort((a, b) => b.overallScore - a.overallScore);
  } else if (sortBy === 'recommendation') {
    const order = { strong_match: 0, good_match: 1, consider: 2, pass: 3 };
    sorted.sort(
      (a, b) => order[a.recommendation] - order[b.recommendation]
    );
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  const selectedCandidate = candidates.find((c) => c.candidateId === selectedCandidateId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['strong_match', 'good_match', 'consider', 'pass'] as const).map((rec) => (
          <motion.div
            key={rec}
            className={`rounded-lg p-4 border ${
              recommendationConfig[rec].color
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                recommendationConfig[rec].textColor
              }`}
            >
              {rec.replace('_', ' ')}
            </p>
            <p className="text-2xl font-bold">
              {candidates.filter((c) => c.recommendation === rec).length}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
        >
          <option value="score">Sort by Score</option>
          <option value="recommendation">Sort by Fit</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {sorted.map((candidate) => {
            const config = recommendationConfig[candidate.recommendation];
            const isSelected = selectedCandidateId === candidate.candidateId;

            return (
              <motion.button
                key={candidate.candidateId}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedCandidateId(candidate.candidateId);
                  onSelectCandidate?.(candidate.candidateId);
                }}
                className={`w-full text-left rounded-lg border-2 p-3 transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                    : `border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 ${config.color}`
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{candidate.name}</h4>
                  <span className={`text-lg ${config.icon}`} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {candidate.position}
                </p>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mr-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.overallScore}%` }}
                      transition={{ delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">
                    {candidate.overallScore}%
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Details Panel */}
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedCandidate.position}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  recommendationConfig[selectedCandidate.recommendation].badge
                }`}
              >
                {recommendationConfig[selectedCandidate.recommendation].icon}{' '}
                {selectedCandidate.recommendation.replace('_', ' ')}
              </span>
            </div>

            {/* Overall Score */}
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Overall Score
              </p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center bg-white dark:bg-slate-800">
                  <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {selectedCandidate.overallScore}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-3">Scoring Criteria:</p>
                  <div className="space-y-2">
                    {selectedCandidate.criteria.slice(0, 3).map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {c.score}% (weight: {c.weight}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scoring */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Detailed Scoring</h3>
              <div className="space-y-4">
                {selectedCandidate.criteria.map((criterion, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{criterion.name}</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        {criterion.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${criterion.score}%` }}
                        className="h-full bg-cyan-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {criterion.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                AI Recommendation:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedCandidate.reasoning}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                Proceed to Interview
              </button>
              <button className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                View Full Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIcandidateScoring;