import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { PayrollSummary } from '../../types/payroll.types';

const payrollService = {
  getPayrollSummary: async (): Promise<ApiResponse<PayrollSummary>> =>
    apiClient.get('/payroll/summary'),

  runPayroll: async (payrollPeriodId: string): Promise<ApiResponse<{ processed: boolean }>> =>
    apiClient.post(`/payroll/run`, { payrollPeriodId }),

  getPayrollHistory: async (): Promise<ApiResponse<PayrollSummary[]>> =>
    apiClient.get('/payroll/history'),
};

export default payrollService;
