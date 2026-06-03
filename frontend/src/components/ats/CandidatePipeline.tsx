/**
 * /frontend/src/components/ats/CandidatePipeline.tsx
 * 
 * Kanban-style candidate pipeline visualization
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PipelineCandidate {
  id: string;
  name: string;
  position: string;
  stage: string;
  appliedDate: Date;
  score?: number;
  tags: string[];
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  candidates: PipelineCandidate[];
}

interface CandidatePipelineProps {
  stages?: PipelineStage[];
  isLoading?: boolean;
  onMoveCandidate?: (candidateId: string, fromStage: string, toStage: string) => void;
  onSelectCandidate?: (candidateId: string) => void;
}

export const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
  stages = [],
  isLoading = false,
  onMoveCandidate,
  onSelectCandidate,
}) => {
  const [draggedCandidate, setDraggedCandidate] = useState<{
    candidateId: string;
    fromStage: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500 dark:text-slate-400">
          Loading pipeline...
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No pipeline data available
      </div>
    );
  }

  const handleDragStart = (candidateId: string, stageId: string) => {
    setDraggedCandidate({ candidateId, fromStage: stageId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toStageId: string) => {
    if (!draggedCandidate) return;
    if (draggedCandidate.fromStage !== toStageId) {
      onMoveCandidate?.(
        draggedCandidate.candidateId,
        draggedCandidate.fromStage,
        toStageId
      );
    }
    setDraggedCandidate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map((stage) => (
          <motion.div
            key={stage.id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {stage.name}
            </p>
            <p className="text-2xl font-bold" style={{ color: stage.color }}>
              {stage.candidates.length}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <motion.div
            key={stage.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
            className="bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 min-h-96"
          >
            {/* Stage Header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <h3 className="font-semibold text-sm">{stage.name}</h3>
              <span className="ml-auto text-xs font-bold text-slate-600 dark:text-slate-400">
                {stage.candidates.length}
              </span>
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              {stage.candidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  draggable
                  onDragStart={() => handleDragStart(candidate.id, stage.id)}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelectCandidate?.(candidate.id)}
                  className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-sm mb-1">{candidate.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {candidate.position}
                  </p>

                  {candidate.score !== undefined && (
                    <div className="mb-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${candidate.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Score: {candidate.score}%
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {candidate.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {candidate.tags.length > 2 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{candidate.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}

              {stage.candidates.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                  No candidates
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="text-lg">👆</div>
          <span>Drag to move between stages</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg">🖱️</div>
          <span>Click to view details</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidatePipeline;