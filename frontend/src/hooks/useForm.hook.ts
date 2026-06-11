/**
 * /frontend/src/hooks/useForm.hook.ts
 *
 * Hook for managing form state and validation.
 */

import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react';

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
  touched: Record<string, boolean>;
  setFieldValue: (field: keyof T & string, value: unknown) => void;
  setFieldError: (field: string, error: string) => void;
  setValues: (values: T) => void;
  resetForm: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setTouched: (field: string) => void;
}

export const useForm = <T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T> => {
  const { initialValues, onSubmit, validate } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [touched, setTouchedMap] = useState<Record<string, boolean>>({});

  const setFieldValue = useCallback(
    (field: keyof T & string, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setTouched = useCallback((field: string) => {
    setTouchedMap((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value;
      setFieldValue(name as keyof T & string, finalValue);
      setTouched(name);
    },
    [setFieldValue, setTouched]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (validate) {
        const errs = validate(values);
        if (Object.keys(errs).length > 0) {
          setErrors(errs);
          return;
        }
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        console.error('[useForm] submit error:', err);
        setErrors({
          submit: err instanceof Error ? err.message : 'An error occurred',
        });
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
    setTouchedMap({});
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
    setTouched,
  };
};

export default useForm;