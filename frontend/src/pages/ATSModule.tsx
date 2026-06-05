/**
 * /frontend/src/pages/ATSModule.tsx
 *
 * Complete Applicant Tracking System module.
 * Now wired to real components and atsService.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import atsService from '../services/api/atsService';
import { JobPostingForm, type JobPosting } from '../components/ats/JobPostingForm';
import { CandidatePipeline, type PipelineStage } from '../components/ats/CandidatePipeline';
import { ResumeParser, type ParsedResume } from '../components/ats/ResumeParser';
import { OfferLetterGenerator, type OfferLetterData } from '../components/ats/OfferLetterGenerator';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import AppLayout from '../components/layout/AppLayout';

type ATSTab = 'jobs' | 'pipeline' | 'resume' | 'offers';

const DEFAULT_STAGES: PipelineStage[] = [
  { id: 'applied', name: 'Applied', color: '#6b7280', candidates: [] },
  { id: 'screening', name: 'Screening', color: '#f59e0b', candidates: [] },
  { id: 'interview', name: 'Interview', color: '#3b82f6', candidates: [] },
  { id: 'offer', name: 'Offer', color: '#8b5cf6', candidates: [] },
  { id: 'hired', name: 'Hired', color: '#10b981', candidates: [] },
];

const ATSModule: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [tab, setTab] = useState<ATSTab>('jobs');
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadPipeline = useCallback(async () => {
    setIsLoading(true);
    try {
      const candidates = (await atsService.getCandidates()) as {
        id: string;
        name: string;
        position: string;
        stage: string;
        appliedDate: string;
        score?: number;
        tags?: string[];
      }[];

      const updatedStages = DEFAULT_STAGES.map((stage) => ({
        ...stage,
        candidates: candidates
          .filter((c) => c.stage === stage.id)
          .map((c) => ({
            id: c.id,
            name: c.name,
            position: c.position,
            stage: c.stage,
            appliedDate: new Date(c.appliedDate),
            score: c.score,
            tags: c.tags ?? [],
          })),
      }));
      setStages(updatedStages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pipeline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'pipeline') void loadPipeline();
  }, [tab, loadPipeline]);

  const handlePostJob = async (posting: JobPosting) => {
    setIsSaving(true);
    try {
      await atsService.postJob(posting);
      setShowJobForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveCandidate = async (
    candidateId: string,
    fromStage: string,
    toStage: string
  ) => {
    try {
      await atsService.movePipeline(candidateId, toStage);
      setStages((prev) => {
        const candidate = prev
          .find((s) => s.id === fromStage)
          ?.candidates.find((c) => c.id === candidateId);
        if (!candidate) return prev;
        return prev.map((stage) => {
          if (stage.id === fromStage) {
            return { ...stage, candidates: stage.candidates.filter((c) => c.id !== candidateId) };
          }
          if (stage.id === toStage) {
            return { ...stage, candidates: [...stage.candidates, { ...candidate, stage: toStage }] };
          }
          return stage;
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move candidate');
    }
  };

  const handleResumeParsed = (resume: ParsedResume) => {
    console.log('Resume parsed:', resume);
    // Would typically create a candidate profile here
  };

  const handleOfferGenerated = async (data: OfferLetterData) => {
    setIsSaving(true);
    try {
      await atsService.generateOfferLetter('new', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate offer letter');
    } finally {
      setIsSaving(false);
    }
  };

  const TABS: { id: ATSTab; label: string; icon: string }[] = [
    { id: 'jobs', label: 'Job Postings', icon: '📋' },
    { id: 'pipeline', label: 'Pipeline', icon: '🔄' },
    { id: 'resume', label: 'Resume Parser', icon: '📄' },
    { id: 'offers', label: 'Offer Letters', icon: '✉️' },
  ];

  return (
    <AppLayout showSidebar showFooter={false}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Applicant Tracking System</h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Manage job postings, candidates, and hiring pipeline.
            </p>
          </div>
          {tab === 'jobs' && (
            <button onClick={() => setShowJobForm(true)} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition text-sm">
              + Post New Job
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
              tab === t.id ? 'bg-cyan-500 text-slate-900' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className={`p-4 rounded-lg border mb-6 text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
          {error}
        </div>
      )}

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {tab === 'jobs' && (
          <div className={`rounded-lg border p-8 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold mb-1">Job Postings</p>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Click "Post New Job" to create your first posting.
            </p>
          </div>
        )}

        {tab === 'pipeline' && (
          isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" message="Loading pipeline…" />
            </div>
          ) : (
            <CandidatePipeline
              stages={stages}
              onMoveCandidate={handleMoveCandidate}
              onSelectCandidate={(id) => console.log('Selected:', id)}
            />
          )
        )}

        {tab === 'resume' && (
          <ResumeParser onParsed={handleResumeParsed} isLoading={isSaving} />
        )}

        {tab === 'offers' && (
          <OfferLetterGenerator
            onGenerate={handleOfferGenerated}
            isLoading={isSaving}
          />
        )}
      </motion.div>

      {/* Job posting modal */}
      <Modal
        isOpen={showJobForm}
        onClose={() => setShowJobForm(false)}
        title="Post New Job"
        size="xl"
      >
        <JobPostingForm onSave={handlePostJob} isLoading={isSaving} />
      </Modal>
    </AppLayout>
  );
};

export default ATSModule;