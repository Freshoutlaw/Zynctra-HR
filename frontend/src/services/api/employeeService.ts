// cat > /mnt/user-data/outputs/employeeService.ts << 'EOF'
/**
 * /frontend/src/services/api/employeeService.ts
 * 
 * Employee management API service
 */

import apiClient from './apiClient';

class EmployeeService {
  async getEmployees(filters?: any) {
    const response = await apiClient.get('/employees', { params: filters });
    return response.data;
  }

  async getEmployee(employeeId: string) {
    const response = await apiClient.get(`/employees/${employeeId}`);
    return response.data;
  }

  async createEmployee(employeeData: any) {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  }

  async updateEmployee(employeeId: string, updates: any) {
    const response = await apiClient.patch(`/employees/${employeeId}`, updates);
    return response.data;
  }

  async deleteEmployee(employeeId: string) {
    const response = await apiClient.delete(`/employees/${employeeId}`);
    return response.data;
  }

  async getEmployeeDocuments(employeeId: string) {
    const response = await apiClient.get(`/employees/${employeeId}/documents`);
    return response.data;
  }

  async uploadDocument(employeeId: string, file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await apiClient.post(
      `/employees/${employeeId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async getAttendance(employeeId: string, period?: string) {
    const response = await apiClient.get(`/employees/${employeeId}/attendance`, {
      params: { period },
    });
    return response.data;
  }

  async getPerformance(employeeId: string) {
    const response = await apiClient.get(`/employees/${employeeId}/performance`);
    return response.data;
  }

  async getBenefits(employeeId: string) {
    const response = await apiClient.get(`/employees/${employeeId}/benefits`);
    return response.data;
  }
}

export default new EmployeeService();
// EOF