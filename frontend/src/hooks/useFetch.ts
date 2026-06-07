/**
 * /frontend/src/hooks/useFetch.ts
 *
 * Generic fetch hook for any API endpoint.
 * Fixed: uses apiClient.patch(); handles all HTTP verbs correctly.
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  autoFetch?: boolean;
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
}

export const useFetch = <T,>(url: string, options: UseFetchOptions = {}) => {
  const { method = 'GET', autoFetch = true, body, params } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requestOptions = {
        ...(params !== undefined ? { params } : {}),
      };
      let response;
      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(url, requestOptions);
          break;
        case 'POST':
          response = await apiClient.post<T>(url, body, requestOptions);
          break;
        case 'PUT':
          response = await apiClient.put<T>(url, body, requestOptions);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(url, body, requestOptions);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(url, requestOptions);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      setData(response.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fetch failed'));
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body, params]);

  useEffect(() => {
    if (autoFetch) void fetchData();
  }, [autoFetch, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;