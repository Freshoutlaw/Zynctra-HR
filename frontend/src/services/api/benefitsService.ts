import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { BenefitPlan } from '../../types/payroll.types';

const benefitsService = {
  listBenefits: async (): Promise<ApiResponse<BenefitPlan[]>> => apiClient.get('/benefits/plans'),

  enrollBenefit: async (
    employeeId: string,
    benefitId: string
  ): Promise<ApiResponse<{ success: boolean }>> =>
    apiClient.post(`/benefits/enroll`, { employeeId, benefitId }),

  getEmployeeBenefits: async (employeeId: string): Promise<ApiResponse<BenefitPlan[]>> =>
    apiClient.get(`/benefits/employees/${employeeId}`),
};

export default benefitsService;
