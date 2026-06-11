import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { IncidentRecord } from '../../types/security.types';

const incidentResponseService = {
  listIncidents: async (): Promise<ApiResponse<IncidentRecord[]>> =>
    apiClient.get('/security/incidents'),

  resolveIncident: async (
    incidentId: string,
    resolution: string
  ): Promise<ApiResponse<{ resolved: boolean }>> =>
    apiClient.post(`/security/incidents/${incidentId}/resolve`, { resolution }),

  createIncident: async (
    payload: Partial<IncidentRecord>
  ): Promise<ApiResponse<IncidentRecord>> =>
    apiClient.post('/security/incidents', payload),
};

export default incidentResponseService;
