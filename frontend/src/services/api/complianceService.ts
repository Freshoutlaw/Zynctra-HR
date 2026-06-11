import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { CompliancePolicy, ComplianceStatus } from '../../types/security.types';

const complianceService = {
  getPolicies: async (): Promise<ApiResponse<CompliancePolicy[]>> => apiClient.get('/compliance/policies'),

  getComplianceStatus: async (): Promise<ApiResponse<ComplianceStatus>> =>
    apiClient.get('/compliance/status'),

  submitAuditReport: async (
    report: Record<string, unknown>
  ): Promise<ApiResponse<{ submitted: boolean }>> =>
    apiClient.post('/compliance/reports', report),
};

export default complianceService;
