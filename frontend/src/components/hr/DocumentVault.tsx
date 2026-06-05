/**
 * /frontend/src/components/hr/DocumentVault.tsx
 *
 * Secure document storage and retrieval UI.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface VaultDocument {
  id: string;
  name: string;
  type: string;
  size: number; // bytes
  uploadedAt: Date;
  uploadedBy: string;
  category: string;
  tags?: string[];
  url?: string;
}

interface DocumentVaultProps {
  documents: VaultDocument[];
  onUpload?: (file: File) => void | Promise<void>;
  onDownload?: (doc: VaultDocument) => void;
  onDelete?: (docId: string) => void;
  isLoading?: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const fileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
  return '📁';
};

const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onUpload,
  onDownload,
  onDelete,
  isLoading = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void onUpload?.(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void onUpload?.(file);
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header + search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search documents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full sm:w-80 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
              : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
          }`}
        />

        {onUpload && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition text-sm">
              ↑ Upload Document
            </span>
          </label>
        )}
      </div>

      {/* Drop zone */}
      {onUpload && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragOver
              ? isDark
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-cyan-400 bg-cyan-50'
              : isDark
                ? 'border-slate-700 bg-slate-800/30'
                : 'border-slate-300 bg-slate-50'
          }`}
        >
          <div className="text-3xl mb-2">📂</div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Drag & drop files here, or click Upload above
          </p>
        </div>
      )}

      {/* Document list */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catDocs = filtered.filter((d) => d.category === cat);
            if (catDocs.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="font-semibold text-sm mb-3 uppercase tracking-wide">
                  {cat}
                </h3>
                <div className="space-y-2">
                  {catDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      } transition`}
                    >
                      <span className="text-2xl">{fileIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatBytes(doc.size)} •{' '}
                          {doc.uploadedAt.toLocaleDateString()} •{' '}
                          {doc.uploadedBy}
                        </p>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {onDownload && (
                          <button
                            onClick={() => onDownload(doc)}
                            className={`text-xs px-2 py-1 rounded transition ${
                              isDark
                                ? 'text-cyan-400 hover:bg-slate-700'
                                : 'text-cyan-600 hover:bg-slate-100'
                            }`}
                          >
                            ↓
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(doc.id)}
                            className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div
              className={`text-center py-12 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {search ? 'No documents match your search.' : 'No documents uploaded yet.'}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentVault;