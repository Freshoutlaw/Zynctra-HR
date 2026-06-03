/**
 * /frontend/src/components/ai/PolicyDrafter.tsx
 * 
 * AI-powered HR policy generation and drafting
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PolicyTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  sections: PolicySection[];
}

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

interface PolicyDrafterProps {
  onDraft?: (policy: PolicyTemplate) => void;
  isLoading?: boolean;
}

const policyCategories = [
  { id: 'leave', name: 'Leave & Attendance', icon: '📅' },
  { id: 'conduct', name: 'Code of Conduct', icon: '⚖️' },
  { id: 'safety', name: 'Health & Safety', icon: '🏥' },
  { id: 'remote', name: 'Remote Work', icon: '🏠' },
  { id: 'benefits', name: 'Benefits', icon: '🎁' },
  { id: 'confidentiality', name: 'Confidentiality', icon: '🔒' },
  { id: 'anti-discrimination', name: 'Anti-Discrimination', icon: '⚡' },
  { id: 'performance', name: 'Performance Management', icon: '📊' },
];

export const PolicyDrafter: React.FC<PolicyDrafterProps> = ({ onDraft, isLoading = false }) => {
  const [step, setStep] = useState<'select' | 'customize' | 'review'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPolicyName('');
    setPolicyDescription('');
    setSections([]);
    setStep('customize');
  };

  const handleSectionEdit = (sectionId: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content } : s))
    );
  };

  const handleGenerateDraft = async () => {
    if (!policyName.trim() || !selectedCategory) {
      alert('Please fill in policy name and select a category');
      return;
    }

    // In real implementation, this would call the AI service
    const policy: PolicyTemplate = {
      id: Date.now().toString(),
      category: selectedCategory,
      name: policyName,
      description: policyDescription,
      sections: sections,
    };

    onDraft?.(policy);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {['select', 'customize', 'review'].map((s, idx) => (
          <React.Fragment key={s}>
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                step === s
                  ? 'bg-cyan-500 text-white'
                  : idx < ['select', 'customize', 'review'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              {idx + 1}
            </motion.div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  idx < ['select', 'customize', 'review'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Category */}
      {step === 'select' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Select Policy Category</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Choose a policy type to generate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(category.id)}
                className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors text-left"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Customize */}
      {step === 'customize' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Customize Policy</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fill in the details for your policy
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Policy Name *</label>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="e.g., Annual Leave Policy"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={policyDescription}
                onChange={(e) => setPolicyDescription(e.target.value)}
                placeholder="Brief description of the policy..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Policy Sections</label>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                AI will generate standard sections for this policy category
              </p>
              <button
                onClick={() => {
                  // In real app, this would fetch AI-generated sections
                  setSections([
                    {
                      id: '1',
                      title: 'Purpose',
                      content: 'To establish guidelines for [policy area]',
                      editable: true,
                    },
                    {
                      id: '2',
                      title: 'Scope',
                      content: 'This policy applies to all employees',
                      editable: true,
                    },
                    {
                      id: '3',
                      title: 'Responsibilities',
                      content: 'Department heads are responsible for implementation',
                      editable: true,
                    },
                  ]);
                  setStep('review');
                }}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Generating...' : 'Generate Policy Sections with AI'}
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button
              onClick={() => {
                setStep('select');
                setSelectedCategory(null);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Back
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Review & Finalize</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Review and edit the generated policy
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">{policyName}</h3>
              {policyDescription && (
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {policyDescription}
                </p>
              )}
            </div>

            {sections.map((section) => (
              <div
                key={section.id}
                className="border-t border-slate-200 dark:border-slate-700 pt-4"
              >
                <h4 className="font-semibold mb-2">{section.title}</h4>
                {editingSection === section.id ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionEdit(section.id, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                    {section.content}
                  </p>
                )}
                <button
                  onClick={() =>
                    setEditingSection(
                      editingSection === section.id ? null : section.id
                    )
                  }
                  className="mt-2 text-sm text-cyan-500 hover:text-cyan-600 font-medium"
                >
                  {editingSection === section.id ? 'Done' : 'Edit'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-between">
            <button
              onClick={() => setStep('customize')}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerateDraft}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
            >
              Save Policy
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PolicyDrafter;