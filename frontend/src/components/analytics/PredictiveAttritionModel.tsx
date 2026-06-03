/**
 * /frontend/src/components/analytics/PredictiveAttritionModel.tsx
 * 
 * Machine learning powered attrition prediction and risk assessment
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EmployeeRisk {
  id: string;
  name: string;
  department: string;
  riskScore: number; // 0-100
  riskFactors: string[];
  tenure: number;
  lastReviewScore: number;
  salary: number;
  marketValue: number;
}

interface PredictiveAttritionModelProps {
  employees?: EmployeeRisk[];
  isLoading?: boolean;
}

const defaultEmployees: EmployeeRisk[] = [
  {
    id: '1',
    name: 'John Doe',
    department: 'Engineering',
    riskScore: 78,
    riskFactors: ['High market value', 'Low engagement score', 'No promotion in 2 years'],
    tenure: 3,
    lastReviewScore: 3.2,
    salary: 8500,
    marketValue: 12000,
  },
  {
    id: '2',
    name: 'Jane Smith',
    department: 'Sales',
    riskScore: 45,
    riskFactors: ['Missed quota (1 month)'],
    tenure: 5,
    lastReviewScore: 3.8,
    salary: 7000,
    marketValue: 8500,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    department: 'Engineering',
    riskScore: 92,
    riskFactors: ['Very high market value', 'Declining engagement', 'Interviewing elsewhere?'],
    tenure: 2,
    lastReviewScore: 2.9,
    salary: 9200,
    marketValue: 14000,
  },
  {
    id: '4',
    name: 'Alice Williams',
    department: 'Marketing',
    riskScore: 28,
    riskFactors: [],
    tenure: 6,
    lastReviewScore: 4.1,
    salary: 6500,
    marketValue: 7200,
  },
];

const getRiskColor = (score: number) => {
  if (score >= 70) return 'text-red-600 dark:text-red-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
};

const getRiskBgColor = (score: number) => {
  if (score >= 70) return 'bg-red-50 dark:bg-red-900/20';
  if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20';
  return 'bg-green-50 dark:bg-green-900/20';
};

const RiskCard: React.FC<{ employee: EmployeeRisk }> = ({ employee }) => {
  const [expanded, setExpanded] = useState(false);
  const costOfReplacement = employee.salary * 1.5; // Industry standard: 1.5x salary
  const potentialRetention = Math.min(employee.marketValue * 0.85, employee.salary * 1.3);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className={`rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer transition-colors ${getRiskBgColor(
        employee.riskScore
      )}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{employee.name}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {employee.department} • {employee.tenure}yr tenure
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getRiskColor(employee.riskScore)}`}>
            {employee.riskScore}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Risk Score</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="bg-white dark:bg-slate-800 rounded p-2">
          <p className="text-slate-600 dark:text-slate-400">Review Score</p>
          <p className="font-semibold">{employee.lastReviewScore}/5.0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded p-2">
          <p className="text-slate-600 dark:text-slate-400">Current Salary</p>
          <p className="font-semibold">${employee.salary}k/yr</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded p-2">
          <p className="text-slate-600 dark:text-slate-400">Market Value</p>
          <p className="font-semibold">${employee.marketValue}k/yr</p>
        </div>
      </div>

      {/* Risk Factors */}
      {employee.riskFactors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold mb-1">Risk Factors:</p>
          <div className="flex flex-wrap gap-1">
            {employee.riskFactors.slice(0, expanded ? undefined : 1).map((factor, idx) => (
              <span
                key={idx}
                className="inline-block bg-white dark:bg-slate-800 text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600"
              >
                ⚠️ {factor}
              </span>
            ))}
            {!expanded && employee.riskFactors.length > 1 && (
              <span className="text-xs text-slate-600 dark:text-slate-400 self-center">
                +{employee.riskFactors.length - 1} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 space-y-3"
        >
          <div className="bg-white dark:bg-slate-800 rounded p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Replacement Cost:</span>
              <span className="font-semibold">${costOfReplacement.toFixed(0)}k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Retention Budget:</span>
              <span className="font-semibold text-green-600">
                ${potentialRetention.toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Savings Potential:</span>
              <span className="font-semibold text-green-600">
                ${(costOfReplacement - potentialRetention).toFixed(0)}k
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors">
              Retain Interview
            </button>
            <button className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-xs rounded-lg transition-colors">
              Schedule 1:1
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const PredictiveAttritionModel: React.FC<PredictiveAttritionModelProps> = ({
  employees = defaultEmployees,
  isLoading = false,
}) => {
  const [filterDept, setFilterDept] = useState<string>('all');

  const highRiskCount = employees.filter((e) => e.riskScore >= 70).length;
  const mediumRiskCount = employees.filter((e) => e.riskScore >= 40 && e.riskScore < 70).length;

  const filtered = filterDept === 'all'
    ? employees
    : employees.filter((e) => e.department === filterDept);

  const depts = Array.from(new Set(employees.map((e) => e.department)));

  if (isLoading) {
    return <div className="text-center py-8">Loading attrition model...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1">High Risk</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">{highRiskCount}</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Likely to leave</p>
        </motion.div>

        <motion.div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Medium Risk</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{mediumRiskCount}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Monitor closely</p>
        </motion.div>

        <motion.div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">Low Risk</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">
            {employees.length - highRiskCount - mediumRiskCount}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Stable retention</p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterDept('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterDept === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          All Departments
        </button>
        {depts.map((dept) => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterDept === dept
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((employee) => (
          <RiskCard key={employee.id} employee={employee} />
        ))}
      </div>
    </motion.div>
  );
};

export default PredictiveAttritionModel;