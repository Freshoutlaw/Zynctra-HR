/**
 * /frontend/src/pages/EmployeeDirectory.tsx
 *
 * Employee directory with search, filter, and grid/list toggle.
 * Now fully wired to the employeeService.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import employeeService from '../services/api/employeeService';
import EmployeeCard, { type EmployeeCardData } from '../components/hr/EmployeeCard';
import EmployeeForm, { type EmployeeFormData } from '../components/hr/EmployeeForm';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import AppLayout from '../components/layout/AppLayout';

const DEPARTMENTS = ['All', 'Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Legal'];

const EmployeeDirectory: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCardData | null>(null);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees(
        filterDept !== 'All' ? { department: filterDept } : undefined
      );
      setEmployees(Array.isArray(data) ? (data as EmployeeCardData[]) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  }, [filterDept]);

  useEffect(() => { void loadEmployees(); }, [loadEmployees]);

  const filtered = employees.filter((e) =>
    [e.fullName, e.email, e.department, e.role]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleCreate = async (data: EmployeeFormData) => {
    setIsCreating(true);
    try {
      await employeeService.createEmployee(data);
      setShowCreateModal(false);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout showSidebar showFooter={false}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Employee Directory</h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {isLoading ? 'Loading…' : `${filtered.length} employee${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition text-sm"
          >
            + Add Employee
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className={`rounded-lg border p-4 mb-6 space-y-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role…"
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-slate-300 bg-slate-50 placeholder-slate-400'}`}
          />
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            {(['grid', 'list'] as const).map((v) => (
              <button key={v} onClick={() => setViewType(v)} className={`px-3 py-1.5 rounded text-sm font-medium transition capitalize ${viewType === v ? 'bg-white dark:bg-slate-800 shadow text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filterDept === dept ? 'bg-cyan-500 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={`p-4 rounded-lg border mb-6 text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" message="Loading employees…" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <div className="text-5xl mb-3">👥</div>
          <p className="font-medium mb-1">No employees found</p>
          <p className="text-sm">{search ? 'Try adjusting your search.' : 'Add your first employee to get started.'}</p>
        </div>
      ) : (
        <motion.div
          className={viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((emp, idx) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <EmployeeCard
                employee={emp}
                compact={viewType === 'list'}
                onClick={() => setSelectedEmployee(emp)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Employee"
        size="lg"
      >
        <EmployeeForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Detail modal */}
      <Modal
        isOpen={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee?.fullName ?? ''}
        description={`${selectedEmployee?.role} — ${selectedEmployee?.department}`}
        size="md"
      >
        {selectedEmployee && (
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
            <p><span className="font-medium">Status:</span> {selectedEmployee.status}</p>
            {selectedEmployee.location && (
              <p><span className="font-medium">Location:</span> {selectedEmployee.location}</p>
            )}
            {selectedEmployee.joinDate && (
              <p><span className="font-medium">Joined:</span> {new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default EmployeeDirectory;