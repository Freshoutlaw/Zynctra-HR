/**
 * /frontend/src/hooks/useLoading.hook.ts
 * 
 * Hook for managing loading states
 */

import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  error: Error | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
  reset: () => void;
  wrap: <T,>(promise: Promise<T>) => Promise<T>;
}

/**
 * useLoading Hook
 */
export const useLoading = (initialState = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const wrap = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await promise;
        stopLoading();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        stopLoading();
        throw error;
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    reset,
    wrap,
  };
};

export default useLoading;/**
 * /frontend/src/hooks/useLoading.hook.ts
 *
 * Hook for managing loading states with error tracking.
 */

import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  error: Error | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
  reset: () => void;
  wrap: <T>(promise: Promise<T>) => Promise<T>;
}

export const useLoading = (initialState = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setErrorState] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setErrorState(null);
  }, []);

  const stopLoading = useCallback(() => setIsLoading(false), []);

  const setError = useCallback((e: Error | null) => {
    setErrorState(e);
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setErrorState(null);
  }, []);

  const wrap = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await promise;
        stopLoading();
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      }
    },
    [startLoading, stopLoading, setError]
  );

  return { isLoading, error, startLoading, stopLoading, setError, reset, wrap };
};

export default useLoading;