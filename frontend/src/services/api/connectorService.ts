import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { ConnectorIntegration } from '../../types/api.types';

const connectorService = {
  listIntegrations: async (): Promise<ApiResponse<ConnectorIntegration[]>> =>
    apiClient.get('/connectors'),

  testConnectivity: async (connectorId: string): Promise<ApiResponse<{ healthy: boolean }>> =>
    apiClient.get(`/connectors/${connectorId}/test`),

  refreshConnector: async (connectorId: string): Promise<ApiResponse<{ refreshed: boolean }>> =>
    apiClient.post(`/connectors/${connectorId}/refresh`),
};

export default connectorService;
