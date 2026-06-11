/**
 * /frontend/src/hooks/useApi.hook.ts
 *
 * Hook for making API calls with loading and error handling.
 * Fixed: uses the corrected apiClient with proper param support.
 */

import { useState, useCallback, useEffect } from 'react';
import apiClient, { type RequestOptions } from '../services/api/apiClient';

interface UseApiOptions extends RequestOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  fetch: () => Promise<T | null>;
  refetch: () => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T,>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const { onSuccess, onError, autoFetch = true, params, headers } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const requestOptions: RequestOptions = {};
      if (params) requestOptions.params = params;
      if (headers) requestOptions.headers = headers;
      const response = await apiClient.get<T>(url, requestOptions);
      if (response.data !== undefined) {
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      onError?.(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [url, params, headers, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) void fetchData();
  }, [autoFetch, fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, fetch: fetchData, refetch: fetchData, reset };
};

// ---------------------------------------------------------------------------
// Mutation hook (POST / PUT / PATCH / DELETE)
// ---------------------------------------------------------------------------

interface UseMutationOptions extends RequestOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

interface UseMutationReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (payload?: unknown) => Promise<T | null>;
  reset: () => void;
}

export const useMutation = <T,>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: UseMutationOptions = {}
): UseMutationReturn<T> => {
  const { onSuccess, onError, params, headers } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (payload?: unknown): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const requestOptions: RequestOptions = {};
        if (params) requestOptions.params = params;
        if (headers) requestOptions.headers = headers;
        const response =
          method === 'delete'
            ? await apiClient.delete<T>(url, requestOptions)
            : await apiClient[method]<T>(url, payload, requestOptions);
        if (response.data !== undefined) {
          setData(response.data);
          onSuccess?.(response.data);
          return response.data;
        }
        return null;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        onError?.(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [method, url, params, headers, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, mutate, reset };
};

export const usePostMutation = <T,>(url: string, opts?: UseMutationOptions) =>
  useMutation<T>('post', url, opts);
export const usePutMutation = <T,>(url: string, opts?: UseMutationOptions) =>
  useMutation<T>('put', url, opts);
export const usePatchMutation = <T,>(url: string, opts?: UseMutationOptions) =>
  useMutation<T>('patch', url, opts);
export const useDeleteMutation = <T,>(url: string, opts?: UseMutationOptions) =>
  useMutation<T>('delete', url, opts);

export default useApi;