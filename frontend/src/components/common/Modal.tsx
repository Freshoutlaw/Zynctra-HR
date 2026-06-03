// Placeholder: Modal.tsx
import React from 'react';

const Modal: React.FC = () => {
  return <div>Placeholder Component</div>;
};

export default Modal;
/**
 * /frontend/src/components/common/Modal.tsx
 * 
 * Dialog/modal component with animations
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  showBackdrop?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

/**
 * Modal Component
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeButton = true,
  showBackdrop = true,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={`
                rounded-lg border w-full
                ${sizeClasses[size]}
                ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
                shadow-2xl
              `}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`flex items-start justify-between p-6 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  {title && <h2 className="text-lg font-semibold">{title}</h2>}
                  {description && (
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>
                {closeButton && (
                  <motion.button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✕
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {children && <div className="mb-6">{children}</div>}
              </div>

              {/* Footer */}
              {onConfirm && (
                <div
                  className={`flex gap-3 p-6 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  } justify-end`}
                >
                  <Button variant="ghost" onClick={onClose}>
                    {cancelText}
                  </Button>
                  <Button
                    variant={isDestructive ? 'danger' : 'primary'}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmText}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;