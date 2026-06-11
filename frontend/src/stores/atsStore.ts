import { create } from 'zustand';
import type { CandidateProfile, JobPosting } from '../types/ats.types';

interface AtsState {
  jobs: JobPosting[];
  candidates: CandidateProfile[];
  selectedJob: JobPosting | null;
  setJobs: (jobs: JobPosting[]) => void;
  setCandidates: (candidates: CandidateProfile[]) => void;
  selectJob: (job: JobPosting | null) => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  jobs: [],
  candidates: [],
  selectedJob: null,
  setJobs: (jobs) => set({ jobs }),
  setCandidates: (candidates) => set({ candidates }),
  selectJob: (selectedJob) => set({ selectedJob }),
}));
