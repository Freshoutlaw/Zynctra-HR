/**
 * /frontend/src/components/common/ToastContainer.tsx
 *
 * Container for displaying toast notifications.
 * Fixed: imports useToast from its correct hook file.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useToast, type Toast } from '../../hooks/useToast.hook';

const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors: Record<Toast['type'], string> = {
    success: 'bg-green-500/20 border-green-500/50 text-green-300',
    error: 'bg-red-500/20 border-red-500/50 text-red-300',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  };

  return (
    <motion.div
      className={`min-w-[300px] max-w-[500px] px-6 py-4 rounded-lg border flex items-start gap-3 ${
        colors[toast.type]
      } shadow-lg`}
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-lg font-bold mt-0.5 flex-shrink-0">
        {icons[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              onClose(toast.id);
            }}
            className="text-xs font-semibold mt-2 hover:opacity-80 transition underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <motion.button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Dismiss"
      >
        ✕
      </motion.button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  // Keep theme for potential future theming of toast background
  useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.length > 0 && (
          <div className="flex flex-col gap-3 pointer-events-auto">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;