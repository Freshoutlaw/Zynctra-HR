/**
 * /frontend/src/hooks/useToast.hook.ts
 *
 * Hook for triggering toast notifications.
 */

import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      duration = 5000,
      action?: Toast['action']
    ): string => {
      const id = `toast-${counter.current++}`;
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
          duration,
          ...(action ? { action } : {}),
        },
      ]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string, duration?: number, action?: Toast['action']) =>
      addToast(msg, 'success', duration, action),
    [addToast]
  );
  const error = useCallback(
    (msg: string, duration?: number, action?: Toast['action']) =>
      addToast(msg, 'error', duration, action),
    [addToast]
  );
  const warning = useCallback(
    (msg: string, duration?: number, action?: Toast['action']) =>
      addToast(msg, 'warning', duration, action),
    [addToast]
  );
  const info = useCallback(
    (msg: string, duration?: number, action?: Toast['action']) =>
      addToast(msg, 'info', duration, action),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, warning, info };
};

export default useToast;