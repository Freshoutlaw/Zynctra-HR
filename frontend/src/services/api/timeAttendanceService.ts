/**
 * /frontend/src/services/api/timeAttendanceService.ts
 * Time tracking and attendance service
 */

import apiClient from './apiClient';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
}

export interface AttendanceSummary {
  employeeId: string;
  period: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  averageHours: number;
  leaveBalance: Record<string, number>;
}

class TimeAttendanceService {
  async clockIn(employeeId: string): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>(
      '/attendance/clock-in',
      { employeeId, clockIn: new Date() }
    );
    return response?.data || ({} as AttendanceRecord);
  }

  async clockOut(employeeId: string): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>(
      '/attendance/clock-out',
      { employeeId, clockOut: new Date() }
    );
    return response?.data || ({} as AttendanceRecord);
  }

  async getAttendanceRecords(employeeId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<AttendanceRecord[]>(
      `/attendance/records/${employeeId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    return response?.data || [];
  }

  async requestLeave(request: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>(
      '/attendance/leave-request',
      request
    );
    return response?.data || ({} as LeaveRequest);
  }

  async getLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    const response = await apiClient.get<LeaveRequest[]>(
      `/attendance/leave-requests/${employeeId}`
    );
    return response?.data || [];
  }

  async approveLeaveRequest(leaveId: string, approvedBy: string): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>(
      `/attendance/leave-requests/${leaveId}/approve`,
      { approvedBy }
    );
    return response?.data || ({} as LeaveRequest);
  }

  async rejectLeaveRequest(leaveId: string): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>(
      `/attendance/leave-requests/${leaveId}/reject`,
      {}
    );
    return response?.data || ({} as LeaveRequest);
  }

  async getAttendanceSummary(employeeId: string, period: string): Promise<AttendanceSummary> {
    const response = await apiClient.get<AttendanceSummary>(
      `/attendance/summary/${employeeId}?period=${period}`
    );
    return response?.data || ({} as AttendanceSummary);
  }

  async getTeamAttendance(managerId: string, date: Date): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<AttendanceRecord[]>(
      `/attendance/team/${managerId}?date=${date.toISOString()}`
    );
    return response?.data || [];
  }
}

export default new TimeAttendanceService();