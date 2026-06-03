/**
 * /frontend/src/hooks/useForm.hook.ts
 * 
 * Hook for managing form state and validation
 */

import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

interface FormErrors {
  [key: string]: string;
}

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => FormErrors;
}

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  touched: { [key: string]: boolean };
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setValues: (values: T) => void;
  resetForm: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setTouched: (field: string) => void;
}

/**
 * useForm Hook
 */
export const useForm = <T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> => {
  const { initialValues, onSubmit, validate } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const setTouchedField = useCallback((field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const isChecked = (e.target as HTMLInputElement).checked;
        setFieldValue(name, isChecked);
      } else if (type === 'number') {
        setFieldValue(name, Number(value));
      } else {
        setFieldValue(name, value);
      }

      setTouchedField(name);
    },
    [setFieldValue, setTouchedField]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate
      if (validate) {
        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    touched,
    setFieldValue,
    setFieldError,
    setValues,
    resetForm,
    handleChange,
    handleSubmit,
    setTouched: setTouchedField,
  };
};

export default useForm;