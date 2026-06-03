/**
 * /frontend/src/hooks/useApi.hook.ts
 * 
 * Hook for making API calls with loading and error handling
 */

import { useState, useCallback, useEffect } from 'react';
import apiClient from '../services/api/apiClient';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  fetch: () => Promise<T>;
  refetch: () => Promise<T>;
  reset: () => void;
}

/**
 * useApi Hook for GET requests
 */
export const useApi = <T,>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const { onSuccess, onError, autoFetch = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<T>(url);
      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetch: fetchData,
    refetch: fetchData,
    reset,
  };
};

interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseMutationReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (data?: any) => Promise<T>;
  reset: () => void;
}

/**
 * useMutation Hook for POST/PUT/DELETE requests
 */
export const useMutation = <T,>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: UseMutationOptions = {}
): UseMutationReturn<T> => {
  const { onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (payload?: any): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient[method]<T>(url, payload);
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [method, url, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    mutate,
    reset,
  };
};

/**
 * Shorthand hooks for common mutations
 */
export const usePostMutation = <T,>(
  url: string,
  options?: UseMutationOptions
): UseMutationReturn<T> => {
  return useMutation<T>('post', url, options);
};

export const usePutMutation = <T,>(
  url: string,
  options?: UseMutationOptions
): UseMutationReturn<T> => {
  return useMutation<T>('put', url, options);
};

export const usePatchMutation = <T,>(
  url: string,
  options?: UseMutationOptions
): UseMutationReturn<T> => {
  return useMutation<T>('patch', url, options);
};

export const useDeleteMutation = <T,>(
  url: string,
  options?: UseMutationOptions
): UseMutationReturn<T> => {
  return useMutation<T>('delete', url, options);
};

export default useApi;