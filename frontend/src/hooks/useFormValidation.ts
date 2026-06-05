/**
 * /frontend/src/hooks/useFormValidation.ts
 *
 * Form validation hook with per-field rules.
 */

import { useState, useCallback } from 'react';

export interface ValidationRule {
  pattern?: RegExp;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: (value: unknown) => boolean | string;
}

export const useFormValidation = (
  initialValues: Record<string, unknown>,
  rules: Record<string, ValidationRule>
) => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (fieldName: string, value: unknown): string | null => {
      const rule = rules[fieldName];
      if (!rule) return null;

      if (rule.required && !value) return `${fieldName} is required`;

      if (typeof value === 'string') {
        if (rule.pattern && !rule.pattern.test(value))
          return `${fieldName} format is invalid`;
        if (rule.min !== undefined && value.length < rule.min)
          return `${fieldName} must be at least ${rule.min} characters`;
        if (rule.max !== undefined && value.length > rule.max)
          return `${fieldName} must be at most ${rule.max} characters`;
      }

      if (rule.custom) {
        const result = rule.custom(value);
        if (typeof result === 'string') return result;
        if (!result) return `${fieldName} is invalid`;
      }

      return null;
    },
    [rules]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value;

      setValues((prev) => ({ ...prev, [name]: finalValue }));

      if (touched[name]) {
        const error = validate(name, finalValue);
        setErrors((prev) => ({ ...prev, [name]: error ?? '' }));
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: error ?? '' }));
    },
    [validate]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    for (const key of Object.keys(values)) {
      const error = validate(key, values[key]);
      if (error) newErrors[key] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    handleBlur,
    validateAll,
    reset,
  };
};

export default useFormValidation;