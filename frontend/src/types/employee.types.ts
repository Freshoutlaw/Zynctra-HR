export interface EmployeeRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  startDate: string;
  managerId?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  completed: boolean;
}
