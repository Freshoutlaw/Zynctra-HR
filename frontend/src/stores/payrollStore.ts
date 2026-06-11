import { create } from 'zustand';
import type { PayrollSummary } from '../types/payroll.types';

interface PayrollState {
  summary: PayrollSummary | null;
  history: PayrollSummary[];
  loading: boolean;
  setSummary: (summary: PayrollSummary) => void;
  setHistory: (history: PayrollSummary[]) => void;
  setLoading: (loading: boolean) => void;
}

export const usePayrollStore = create<PayrollState>((set) => ({
  summary: null,
  history: [],
  loading: false,
  setSummary: (summary) => set({ summary }),
  setHistory: (history) => set({ history }),
  setLoading: (loading) => set({ loading }),
}));
