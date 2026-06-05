/**
 * /frontend/src/components/hr/EmployeeCard.tsx
 *
 * Card displaying employee summary information.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface EmployeeCardData {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'on_leave' | 'terminated';
  avatarUrl?: string;
  joinDate?: string;
  location?: string;
}

interface EmployeeCardProps {
  employee: EmployeeCardData;
  onClick?: (id: string) => void;
  compact?: boolean;
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-500/20 text-green-300 border-green-400/50' },
  on_leave: { label: 'On Leave', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50' },
  terminated: { label: 'Terminated', color: 'bg-red-500/20 text-red-300 border-red-400/50' },
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onClick,
  compact = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const status = statusConfig[employee.status];
  const initial = employee.fullName.charAt(0).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(employee.id)}
      className={`rounded-lg border p-4 cursor-pointer transition-all ${
        isDark
          ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50'
          : 'bg-white border-slate-200 shadow hover:shadow-md hover:border-cyan-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.fullName}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg select-none">
              {initial}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate">{employee.fullName}</h3>
            <span
              className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>
          <p
            className={`text-xs mt-0.5 truncate ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {employee.role}
          </p>
          <p
            className={`text-xs truncate ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            {employee.department}
          </p>

          {!compact && (
            <>
              <p
                className={`text-xs truncate mt-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
                {employee.email}
              </p>
              {employee.location && (
                <p
                  className={`text-xs truncate ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}
                >
                  📍 {employee.location}
                </p>
              )}
              {employee.joinDate && (
                <p
                  className={`text-xs mt-1 ${
                    isDark ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  Joined {new Date(employee.joinDate).toLocaleDateString()}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;