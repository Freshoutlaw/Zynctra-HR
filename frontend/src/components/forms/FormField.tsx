/**
 * /frontend/src/components/forms/FormField.tsx
 *
 * Reusable form field wrapper with label, hint, and error display.
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          className={`block text-sm font-semibold mb-2 ${
            error ? 'text-red-400' : isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {hint && !error && (
            <span
              className={`ml-2 text-xs font-normal ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {hint}
            </span>
          )}
        </label>
      )}

      <div className="relative">{children}</div>

      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          ✕ {error}
        </p>
      )}

      {!error && hint && label && (
        <p
          className={`mt-1 text-xs ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default FormField;