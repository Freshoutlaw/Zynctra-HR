/**
 * /frontend/src/components/ats/OfferLetterGenerator.tsx
 * 
 * Generate and customize offer letters
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface OfferLetterData {
  candidateName: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  currency: string;
  reportingTo: string;
  benefits: string[];
  conditions: string[];
  letterContent: string;
}

interface OfferLetterGeneratorProps {
  onGenerate?: (data: OfferLetterData) => void;
  isLoading?: boolean;
}

export const OfferLetterGenerator: React.FC<OfferLetterGeneratorProps> = ({
  onGenerate,
  isLoading = false,
}) => {
  const [step, setStep] = useState<'details' | 'preview' | 'send'>('details');
  const [formData, setFormData] = useState<Partial<OfferLetterData>>({
    currency: 'NGN',
    benefits: [],
    conditions: [],
  });
  const [newBenefit, setNewBenefit] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit],
      }));
      setNewBenefit('');
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        conditions: [...(prev.conditions || []), newCondition],
      }));
      setNewCondition('');
    }
  };

  const generateLetter = () => {
    const template = `OFFER OF EMPLOYMENT

Dear ${formData.candidateName},

We are pleased to extend this formal offer of employment for the position of ${formData.position} in our ${formData.department} Department.

POSITION DETAILS:
- Position: ${formData.position}
- Department: ${formData.department}
- Start Date: ${formData.startDate}
- Reporting To: ${formData.reportingTo}

COMPENSATION:
- Base Salary: ${formData.currency} ${formData.salary?.toLocaleString()}

BENEFITS:
${(formData.benefits || []).map((b) => `- ${b}`).join('\n')}

CONDITIONS OF EMPLOYMENT:
${(formData.conditions || []).map((c) => `- ${c}`).join('\n')}

We look forward to a successful working relationship.

Best regards,
Human Resources Department`;

    setFormData((prev) => ({
      ...prev,
      letterContent: template,
    }));
    setStep('preview');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {['details', 'preview', 'send'].map((s, idx) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                step === s
                  ? 'bg-cyan-500 text-white'
                  : idx < ['details', 'preview', 'send'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  idx < ['details', 'preview', 'send'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === 'details' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-xl font-bold">Offer Letter Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Candidate Name *</label>
                <input
                  type="text"
                  value={formData.candidateName || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      candidateName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position *</label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, position: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salary *</label>
                <input
                  type="number"
                  value={formData.salary || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reporting To *</label>
                <input
                  type="text"
                  value={formData.reportingTo || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reportingTo: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold">Benefits</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
                placeholder="Add benefit..."
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <button
                onClick={handleAddBenefit}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {(formData.benefits || []).map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded"
                >
                  <span className="text-sm">{benefit}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        benefits: prev.benefits?.filter((_, i) => i !== idx) ?? [],
                      }))
                    }
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold">Employment Conditions</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                placeholder="Add condition..."
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <button
                onClick={handleAddCondition}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {(formData.conditions || []).map((condition, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded"
                >
                  <span className="text-sm">{condition}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: prev.conditions?.filter((_, i) => i !== idx) ?? [],
                      }))
                    }
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              Cancel
            </button>
            <button
              onClick={generateLetter}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
            >
              Generate Letter
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                {formData.letterContent}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setStep('details')}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep('send')}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
            >
              Continue to Send
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Send */}
      {step === 'send' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4">Send Offer Letter</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Ready to send offer letter to {formData.candidateName}?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('preview')}
                className="flex-1 px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => onGenerate?.(formData as OfferLetterData)}
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white rounded-lg font-medium"
              >
                {isLoading ? 'Sending...' : 'Send Offer'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OfferLetterGenerator;