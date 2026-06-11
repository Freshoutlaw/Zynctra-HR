import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { LearningCourse } from '../../types/employee.types';

const learningService = {
  getCourses: async (): Promise<ApiResponse<LearningCourse[]>> =>
    apiClient.get('/learning/courses'),

  enrollInCourse: async (
    courseId: string,
    employeeId: string
  ): Promise<ApiResponse<{ enrolled: boolean }>> =>
    apiClient.post('/learning/enroll', { courseId, employeeId }),

  getProgress: async (employeeId: string): Promise<ApiResponse<{ completed: number; total: number }>> =>
    apiClient.get(`/learning/progress/${employeeId}`),
};

export default learningService;
