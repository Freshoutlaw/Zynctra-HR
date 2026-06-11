/**
 * /frontend/src/services/api/employeeService.ts
 *
 * Employee management API service
 */

import apiClient from './apiClient';

class EmployeeService {
  async getEmployees(filters?: Record<string, string | number | boolean>) {
    const res = await apiClient.get(
      '/employees',
      filters ? { params: filters } : undefined
    );
    return res.data ?? [];
  }

  async getEmployee(employeeId: string) {
    const res = await apiClient.get(`/employees/${employeeId}`);
    return res.data;
  }

  async createEmployee(employeeData: unknown) {
    const res = await apiClient.post('/employees', employeeData);
    return res.data;
  }

  async updateEmployee(employeeId: string, updates: unknown) {
    const res = await apiClient.patch(`/employees/${employeeId}`, updates);
    return res.data;
  }

  async deleteEmployee(employeeId: string) {
    const res = await apiClient.delete(`/employees/${employeeId}`);
    return res.data;
  }

  async getEmployeeDocuments(employeeId: string) {
    const res = await apiClient.get(`/employees/${employeeId}/documents`);
    return res.data ?? [];
  }

  async uploadDocument(employeeId: string, file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? ''}/employees/${employeeId}/documents`,
      { method: 'POST', credentials: 'include', body: formData }
    );
    if (!response.ok) throw new Error('Document upload failed');
    return response.json();
  }

  async getAttendance(
    employeeId: string,
    period?: string
  ) {
    const res = await apiClient.get(`/employees/${employeeId}/attendance`, {
      params: period ? { period } : {},
    });
    return res.data;
  }

  async getPerformance(employeeId: string) {
    const res = await apiClient.get(`/employees/${employeeId}/performance`);
    return res.data;
  }

  async getBenefits(employeeId: string) {
    const res = await apiClient.get(`/employees/${employeeId}/benefits`);
    return res.data;
  }
}

export default new EmployeeService();