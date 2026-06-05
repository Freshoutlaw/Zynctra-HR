/**
 * /frontend/src/services/api/aiAssistantService.ts
 *
 * AI Assistant API integration service
 */

import apiClient from './apiClient';

export interface AIQuery {
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
}

export interface AIResponse {
  id: string;
  response: string;
  actions?: Array<{ type: string; label: string; data?: unknown }>;
  confidence?: number;
}

class AIAssistantService {
  async askQuestion(query: AIQuery): Promise<AIResponse> {
    const res = await apiClient.post<AIResponse>('/ai/assistant/ask', query);
    return res.data as AIResponse;
  }

  async getRecommendations(context?: Record<string, unknown>): Promise<unknown[]> {
    const res = await apiClient.get('/ai/recommendations', { params: context as Record<string, string> });
    return (res.data as unknown[]) ?? [];
  }

  async generateReport(type: string, filters?: Record<string, unknown>): Promise<unknown> {
    const res = await apiClient.post('/ai/reports/generate', { type, filters });
    return res.data;
  }

  async analyzeTrends(metric: string, period?: string): Promise<unknown> {
    const res = await apiClient.post('/ai/analytics/trends', { metric, period });
    return res.data;
  }

  async getInsights(category: string): Promise<unknown[]> {
    const res = await apiClient.get(`/ai/insights/${category}`);
    return (res.data as unknown[]) ?? [];
  }

  async scoreCandidate(candidateId: string): Promise<unknown> {
    const res = await apiClient.post(`/ai/ats/score/${candidateId}`);
    return res.data;
  }

  async detectAnomalies(type?: string): Promise<unknown[]> {
    const res = await apiClient.get('/ai/anomalies', {
      params: type ? { type } : undefined,
    });
    return (res.data as unknown[]) ?? [];
  }

  async predictAttrition(department?: string): Promise<unknown[]> {
    const res = await apiClient.post('/ai/analytics/predict-attrition', { department });
    return (res.data as unknown[]) ?? [];
  }

  async draftPolicy(category: string, parameters?: Record<string, unknown>): Promise<unknown> {
    const res = await apiClient.post('/ai/policies/draft', { category, parameters });
    return res.data;
  }
}

export default new AIAssistantService();