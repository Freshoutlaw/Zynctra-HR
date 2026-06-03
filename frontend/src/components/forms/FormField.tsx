/**
 * /frontend/src/components/forms/FormField.tsx
 * 
 * Reusable form field wrapper with validation
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

/**
 * FormField Component
 */
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
    <div className={`form-group ${className}`}>
      {label && (
        <label className={`form-label ${required ? 'required' : ''} ${error ? 'text-red-400' : ''}`}>
          {label}
          {hint && <span className="form-label-hint">{hint}</span>}
        </label>
      )}

      {/* Input/Select/Textarea wrapper */}
      <div className="relative">
        {children}
      </div>

      {/* Error message */}
      {error && <div className="form-error">✕ {error}</div>}

      {/* Help text */}
      {!error && hint && (
        <div className={`form-help text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          {hint}
        </div>
      )}
    </div>
  );
};

export default FormField;