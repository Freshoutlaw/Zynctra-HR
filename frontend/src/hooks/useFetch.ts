/**
 * /frontend/src/hooks/useFetch.ts
 * 
 * Generic fetch hook for any API endpoint
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  autoFetch?: boolean;
  body?: any;
  headers?: Record<string, string>;
}

export const useFetch = <T,>(url: string, options: UseFetchOptions = {}) => {
  const { method = 'GET', autoFetch = true, body, headers } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (method === 'GET') {
        response = await apiClient.get<T>(url);
      } else if (method === 'POST') {
        response = await apiClient.post<T>(url, body);
      } else if (method === 'PUT') {
        response = await apiClient.put<T>(url, body);
      } else if (method === 'PATCH') {
        response = await apiClient.patch<T>(url, body);
      } else if (method === 'DELETE') {
        response = await apiClient.delete<T>(url);
      }
      setData(response?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fetch failed'));
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return { data, isLoading, error, refetch: fetch };
};

export default useFetch;