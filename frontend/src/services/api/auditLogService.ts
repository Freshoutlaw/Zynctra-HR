import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { AccessLogEntry } from '../../types/security.types';

const auditLogService = {
  getLogs: async (
    params: Record<string, string | number | boolean> = {},
    limit = 50
  ): Promise<ApiResponse<AccessLogEntry[]>> =>
    apiClient.get('/audit/logs', { params: { ...params, limit } }),

  searchLogs: async (
    query: string,
    limit = 50
  ): Promise<ApiResponse<AccessLogEntry[]>> =>
    apiClient.get('/audit/logs/search', { params: { q: query, limit } }),
};

export default auditLogService;
