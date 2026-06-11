/**
 * /frontend/src/services/api/securityService.ts
 *
 * Security and compliance API service
 */

import apiClient from './apiClient';

class SecurityService {
  async getAuditLogs(filters?: Record<string, string | number | boolean>) {
    const res = await apiClient.get(
      '/security/audit-logs',
      filters ? { params: filters } : undefined
    );
    return res.data ?? [];
  }

  async getAnomalies(type?: string) {
    const res = await apiClient.get(
      '/security/anomalies',
      type ? { params: { type } } : undefined
    );
    return res.data ?? [];
  }

  async reportAnomaly(anomalyId: string, action: string) {
    const res = await apiClient.post(`/security/anomalies/${anomalyId}/${action}`);
    return res.data;
  }

  async getMFAStatus(userId: string) {
    const res = await apiClient.get(`/security/users/${userId}/mfa`);
    return res.data;
  }

  async updateMFA(userId: string, config: unknown) {
    const res = await apiClient.post(`/security/users/${userId}/mfa`, config);
    return res.data;
  }

  async getIPWhitelist() {
    const res = await apiClient.get('/security/ip-whitelist');
    return res.data ?? [];
  }

  async addIPWhitelist(ip: string, description?: string) {
    const res = await apiClient.post('/security/ip-whitelist', { ip, description });
    return res.data;
  }

  async removeIPWhitelist(id: string) {
    const res = await apiClient.delete(`/security/ip-whitelist/${id}`);
    return res.data;
  }

  async getAccessLogs(userId?: string) {
    const res = await apiClient.get('/security/access-logs', {
      params: userId ? { userId } : {},
    });
    return res.data ?? [];
  }

  async getComplianceStatus() {
    const res = await apiClient.get('/security/compliance');
    return res.data;
  }
}

export default new SecurityService();