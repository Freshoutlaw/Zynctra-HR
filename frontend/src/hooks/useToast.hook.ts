/**
 * /frontend/src/hooks/useToast.hook.ts
 * 
 * Hook for triggering toast notifications
 */

import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * useToast Hook
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounterRef = useRef(0);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      duration: number = 5000,
      action?: Toast['action']
    ) => {
      const id = `toast-${toastCounterRef.current++}`;

      const newToast: Toast = {
        id,
        message,
        type,
        duration,
        action,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number, action?: Toast['action']) => {
      return addToast(message, 'success', duration, action);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number, action?: Toast['action']) => {
      return addToast(message, 'error', duration, action);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number, action?: Toast['action']) => {
      return addToast(message, 'warning', duration, action);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number, action?: Toast['action']) => {
      return addToast(message, 'info', duration, action);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;