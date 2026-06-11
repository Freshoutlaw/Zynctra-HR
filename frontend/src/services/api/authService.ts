import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { User } from '../../types/auth.types';

const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> =>
    apiClient.post('/auth/login', { email, password }),

  logout: async (): Promise<ApiResponse<null>> => apiClient.post('/auth/logout'),

  refreshSession: async (): Promise<ApiResponse<{ user: User; token: string }>> =>
    apiClient.post('/auth/refresh'),

  getCurrentUser: async (): Promise<ApiResponse<User>> => apiClient.get('/auth/me'),

  requestPasswordReset: async (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/password-reset', { email }),

  verifyOtp: async (email: string, otp: string): Promise<ApiResponse<{ token: string }>> =>
    apiClient.post('/auth/verify', { email, otp }),
};

export default authService;
