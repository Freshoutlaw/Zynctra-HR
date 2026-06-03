// cat > /mnt/user-data/outputs/securityService.ts << 'EOF'
/**
 * /frontend/src/services/api/securityService.ts
 * 
 * Security and compliance API service
 */

import apiClient from './apiClient';

class SecurityService {
  async getAuditLogs(filters?: any) {
    const response = await apiClient.get('/security/audit-logs', {
      params: filters,
    });
    return response.data;
  }

  async getAnomalies(type?: string) {
    const response = await apiClient.get('/security/anomalies', {
      params: { type },
    });
    return response.data;
  }

  async reportAnomaly(anomalyId: string, action: string) {
    const response = await apiClient.post(
      `/security/anomalies/${anomalyId}/${action}`
    );
    return response.data;
  }

  async getMFAStatus(userId: string) {
    const response = await apiClient.get(`/security/users/${userId}/mfa`);
    return response.data;
  }

  async updateMFA(userId: string, config: any) {
    const response = await apiClient.post(
      `/security/users/${userId}/mfa`,
      config
    );
    return response.data;
  }

  async getIPWhitelist() {
    const response = await apiClient.get('/security/ip-whitelist');
    return response.data;
  }

  async addIPWhitelist(ip: string, description?: string) {
    const response = await apiClient.post('/security/ip-whitelist', {
      ip,
      description,
    });
    return response.data;
  }

  async removeIPWhitelist(id: string) {
    const response = await apiClient.delete(`/security/ip-whitelist/${id}`);
    return response.data;
  }

  async getAccessLogs(userId?: string) {
    const response = await apiClient.get('/security/access-logs', {
      params: { userId },
    });
    return response.data;
  }

  async getComplianceStatus() {
    const response = await apiClient.get('/security/compliance');
    return response.data;
  }
}

export default new SecurityService();
// EOF