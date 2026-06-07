/**
 * /frontend/src/components/ats/JobPostingForm.tsx
 * 
 * Job posting creation and publication
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface JobPosting {
  id?: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: { min: number; max: number };
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  urgency: 'low' | 'medium' | 'high';
  publishedAt?: Date;
  status: 'draft' | 'published' | 'closed';
}

interface JobPostingFormProps {
  onSave?: (posting: JobPosting) => void;
  isLoading?: boolean;
  initialData?: JobPosting;
}

export const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSave,
  isLoading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<JobPosting>(
    initialData || {
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: [],
      responsibilities: [],
      type: 'full_time',
      urgency: 'medium',
      status: 'draft',
    }
  );

  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement],
      }));
      setNewRequirement('');
    }
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility],
      }));
      setNewResponsibility('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!formData.title.trim() || !formData.department || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const payload: JobPosting = {
      ...formData,
      status,
      ...(status === 'published' ? { publishedAt: new Date() } : {}),
    };

    onSave?.(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h2 className="text-xl font-bold">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Senior Engineer"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department *</label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Lagos, Nigeria"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Employment Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Job description..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Salary Range (Optional)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={formData.salary?.min || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: {
                      min: Number(e.target.value),
                      max: prev.salary?.max || 0,
                    },
                  }))
                }
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={formData.salary?.max || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: {
                      min: prev.salary?.min || 0,
                      max: Number(e.target.value),
                    },
                  }))
                }
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Urgency</label>
            <select
              value={formData.urgency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  urgency: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-bold">Requirements</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
            placeholder="Add a requirement..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <button
            onClick={handleAddRequirement}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {formData.requirements.map((req, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <span className="text-sm">{req}</span>
              <button
                onClick={() => handleRemoveRequirement(idx)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-bold">Responsibilities</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
            placeholder="Add a responsibility..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <button
            onClick={handleAddResponsibility}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {formData.responsibilities.map((resp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <span className="text-sm">{resp}</span>
              <button
                onClick={() => handleRemoveResponsibility(idx)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Cancel
        </button>
        <button
          onClick={() => handleSave('draft')}
          disabled={isLoading}
          className="px-6 py-2 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={isLoading}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Publishing...' : 'Publish Now'}
        </button>
      </div>
    </motion.div>
  );
};

export default JobPostingForm;