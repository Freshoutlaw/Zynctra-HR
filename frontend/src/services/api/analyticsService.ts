// cat > /mnt/user-data/outputs/analyticsService.ts << 'EOF'
/**
 * /frontend/src/services/api/analyticsService.ts
 * 
 * Analytics and reporting API service
 */

import apiClient from './apiClient';

class AnalyticsService {
  async getHeadcountData(period?: string) {
    const response = await apiClient.get('/analytics/headcount', {
      params: { period },
    });
    return response.data;
  }

  async getTurnoverData(period?: string) {
    const response = await apiClient.get('/analytics/turnover', {
      params: { period },
    });
    return response.data;
  }

  async getPayrollAnalysis(period?: string) {
    const response = await apiClient.get('/analytics/payroll', {
      params: { period },
    });
    return response.data;
  }

  async getPerformanceMetrics(department?: string) {
    const response = await apiClient.get('/analytics/performance', {
      params: { department },
    });
    return response.data;
  }

  async getEngagementScores() {
    const response = await apiClient.get('/analytics/engagement');
    return response.data;
  }

  async getDashboardData() {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  }

  async generateCustomReport(config: any) {
    const response = await apiClient.post('/analytics/reports/custom', config);
    return response.data;
  }

  async exportData(format: 'csv' | 'excel' | 'pdf', reportId?: string) {
    const response = await apiClient.post(`/analytics/export/${format}`, {
      reportId,
    });
    return response.data;
  }

  async getComparisonData(metric: string, compareBy?: string) {
    const response = await apiClient.get(`/analytics/compare/${metric}`, {
      params: { compareBy },
    });
    return response.data;
  }
}

export default new AnalyticsService();
// EOF