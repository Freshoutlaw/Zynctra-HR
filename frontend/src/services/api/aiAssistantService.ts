// cat > /mnt/user-data/outputs/aiAssistantService.ts << 'EOF'
/**
 * /frontend/src/services/api/aiAssistantService.ts
 * 
 * AI Assistant API integration service
 */

import apiClient from './apiClient';

export interface AIQuery {
  message: string;
  context?: Record<string, any>;
  userId?: string;
}

export interface AIResponse {
  id: string;
  response: string;
  actions?: Array<{
    type: string;
    label: string;
    data?: any;
  }>;
  confidence?: number;
}

class AIAssistantService {
  async askQuestion(query: AIQuery): Promise<AIResponse> {
    const response = await apiClient.post<AIResponse>(
      '/ai/assistant/ask',
      query
    );
    return response.data;
  }

  async getRecommendations(context?: Record<string, any>): Promise<any[]> {
    const response = await apiClient.get('/ai/recommendations', {
      params: context,
    });
    return response.data;
  }

  async generateReport(type: string, filters?: Record<string, any>): Promise<any> {
    const response = await apiClient.post('/ai/reports/generate', {
      type,
      filters,
    });
    return response.data;
  }

  async analyzeTrends(metric: string, period?: string): Promise<any> {
    const response = await apiClient.post('/ai/analytics/trends', {
      metric,
      period,
    });
    return response.data;
  }

  async getInsights(category: string): Promise<any[]> {
    const response = await apiClient.get(`/ai/insights/${category}`);
    return response.data;
  }

  async scoreCandidate(candidateId: string): Promise<any> {
    const response = await apiClient.post(`/ai/ats/score/${candidateId}`);
    return response.data;
  }

  async detectAnomalies(type?: string): Promise<any[]> {
    const response = await apiClient.get('/ai/anomalies', {
      params: { type },
    });
    return response.data;
  }

  async predictAttrition(department?: string): Promise<any[]> {
    const response = await apiClient.post('/ai/analytics/predict-attrition', {
      department,
    });
    return response.data;
  }

  async draftPolicy(category: string, parameters?: Record<string, any>): Promise<any> {
    const response = await apiClient.post('/ai/policies/draft', {
      category,
      parameters,
    });
    return response.data;
  }
}

export default new AIAssistantService();
// EOF