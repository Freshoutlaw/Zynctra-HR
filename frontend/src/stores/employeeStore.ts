import { create } from 'zustand';
import type { EmployeeRecord } from '../types/employee.types';

interface EmployeeState {
  employees: EmployeeRecord[];
  selectedEmployee: EmployeeRecord | null;
  setEmployees: (employees: EmployeeRecord[]) => void;
  selectEmployee: (employee: EmployeeRecord | null) => void;
  updateEmployee: (employee: EmployeeRecord) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  selectedEmployee: null,
  setEmployees: (employees) => set({ employees }),
  selectEmployee: (selectedEmployee) => set({ selectedEmployee }),
  updateEmployee: (employee) =>
    set((state) => ({
      employees: state.employees.map((item) =>
        item.id === employee.id ? employee : item
      ),
      selectedEmployee:
        state.selectedEmployee?.id === employee.id ? employee : state.selectedEmployee,
    })),
}));
