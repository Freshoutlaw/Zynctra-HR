/**
 * /frontend/src/components/ats/ResumeParser.tsx
 * 
 * Parse resumes and extract candidate information
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface ResumeParserProps {
  onParsed?: (resume: ParsedResume) => void;
  isLoading?: boolean;
}

export const ResumeParser: React.FC<ResumeParserProps> = ({
  onParsed,
  isLoading = false,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [step, setStep] = useState<'upload' | 'parsing' | 'review'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      handleParse(file);
    }
  };

  const handleParse = async (file: File) => {
    setStep('parsing');
    console.debug('Parsing resume file', file.name);
    // In real app, this would call AI parsing service
    setTimeout(() => {
      // Simulate parsed data structure
      setParsedData({
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
      });
      setStep('review');
    }, 2000);
  };

  const handleSubmit = () => {
    if (parsedData) {
      onParsed?.(parsedData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {step === 'upload' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-bold mb-2">Upload Resume</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Upload a PDF or Word document to extract candidate information
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium cursor-pointer inline-block transition-colors">
                Choose File
              </span>
            </label>

            {uploadedFile && (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Selected: {uploadedFile.name}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Supported formats:</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '📕', name: 'PDF' },
                { icon: '📗', name: 'Word' },
                { icon: '📘', name: 'RTF' },
              ].map((format) => (
                <div
                  key={format.name}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center"
                >
                  <div className="text-2xl mb-1">{format.icon}</div>
                  <p className="text-sm font-medium">{format.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {step === 'parsing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">Parsing Resume</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            AI is extracting information from the resume...
          </p>
        </motion.div>
      )}

      {step === 'review' && parsedData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-xl font-bold">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={parsedData.name}
                  onChange={(e) =>
                    setParsedData((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={parsedData.email}
                  onChange={(e) =>
                    setParsedData((prev) => ({
                      ...prev!,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={parsedData.phone}
                  onChange={(e) =>
                    setParsedData((prev) => ({
                      ...prev!,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={parsedData.location}
                  onChange={(e) =>
                    setParsedData((prev) => ({
                      ...prev!,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Professional Summary</label>
              <textarea
                value={parsedData.summary}
                onChange={(e) =>
                  setParsedData((prev) => ({
                    ...prev!,
                    summary: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          {parsedData.skills.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Skills ({parsedData.skills.length})</h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setStep('upload');
                setParsedData(null);
                setUploadedFile(null);
              }}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Upload Another
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white rounded-lg font-medium"
            >
              {isLoading ? 'Processing...' : 'Create Candidate Profile'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResumeParser;