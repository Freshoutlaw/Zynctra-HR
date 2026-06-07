/**
 * /frontend/src/components/hr/EmployeeForm.tsx
 *
 * Form for creating / editing employee records.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  location: string;
  employmentType: 'full_time' | 'part_time' | 'contract';
  startDate: string;
  salary: number;
  managerId?: string;
}

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Legal'];
const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
] as const;

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    department: initialData?.department ?? '',
    role: initialData?.role ?? '',
    location: initialData?.location ?? '',
    employmentType: initialData?.employmentType ?? 'full_time',
    startDate: initialData?.startDate ?? '',
    salary: initialData?.salary ?? 0,
    managerId: initialData?.managerId,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const inputClass = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
    isDark
      ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
  }`;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Personal Info */}
      <div className={`rounded-lg border p-6 space-y-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className="font-semibold text-lg">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="John" />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Doe" />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@company.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+234 800 000 0000" />
          </div>
        </div>
      </div>

      {/* Employment Info */}
      <div className={`rounded-lg border p-6 space-y-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className="font-semibold text-lg">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} className={inputClass}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role / Title *</label>
            <input name="role" type="text" value={formData.role} onChange={handleChange} className={inputClass} placeholder="Senior Engineer" />
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employment Type</label>
            <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={inputClass}>
              {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input name="location" type="text" value={formData.location} onChange={handleChange} className={inputClass} placeholder="Lagos, Nigeria" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date *</label>
            <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className={inputClass} />
            {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Annual Salary</label>
            <input name="salary" type="number" value={formData.salary || ''} onChange={handleChange} className={inputClass} placeholder="0" min="0" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg border font-medium transition ${
              isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create Employee'
              : 'Save Changes'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EmployeeForm;