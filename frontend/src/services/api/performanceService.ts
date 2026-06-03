/**
 * /frontend/src/services/api/performanceService.ts
 * Performance management and review service
 */

import apiClient from './apiClient';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  rating: number;
  comments: string;
  goals: string[];
  competencies: Record<string, number>;
  createdAt: Date;
  status: 'draft' | 'submitted' | 'completed';
}

export interface GoalTracking {
  id: string;
  employeeId: string;
  goal: string;
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'on_track' | 'at_risk' | 'completed';
  notes: string[];
}

class PerformanceService {
  async getPerformanceReviews(employeeId: string): Promise<PerformanceReview[]> {
    const response = await apiClient.get<PerformanceReview[]>(
      `/performance/reviews/${employeeId}`
    );
    return response?.data || [];
  }

  async createPerformanceReview(review: Omit<PerformanceReview, 'id' | 'createdAt'>): Promise<PerformanceReview> {
    const response = await apiClient.post<PerformanceReview>(
      '/performance/reviews',
      review
    );
    return response?.data || ({} as PerformanceReview);
  }

  async updatePerformanceReview(reviewId: string, updates: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const response = await apiClient.put<PerformanceReview>(
      `/performance/reviews/${reviewId}`,
      updates
    );
    return response?.data || ({} as PerformanceReview);
  }

  async submitReview(reviewId: string): Promise<PerformanceReview> {
    return this.updatePerformanceReview(reviewId, { status: 'submitted' });
  }

  async getGoals(employeeId: string): Promise<GoalTracking[]> {
    const response = await apiClient.get<GoalTracking[]>(
      `/performance/goals/${employeeId}`
    );
    return response?.data || [];
  }

  async createGoal(goal: Omit<GoalTracking, 'id'>): Promise<GoalTracking> {
    const response = await apiClient.post<GoalTracking>(
      '/performance/goals',
      goal
    );
    return response?.data || ({} as GoalTracking);
  }

  async updateGoalProgress(goalId: string, progress: number): Promise<GoalTracking> {
    const response = await apiClient.patch<GoalTracking>(
      `/performance/goals/${goalId}`,
      { progress }
    );
    return response?.data || ({} as GoalTracking);
  }

  async getTeamPerformance(managerId: string): Promise<PerformanceReview[]> {
    const response = await apiClient.get<PerformanceReview[]>(
      `/performance/team/${managerId}`
    );
    return response?.data || [];
  }
}

export default new PerformanceService();