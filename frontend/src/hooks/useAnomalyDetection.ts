/**
 * /frontend/src/hooks/useAnomalyDetection.ts
 * 
 * Hook for monitoring and reacting to anomaly detection
 */

import { useState, useEffect, useCallback } from 'react';
import securityService from '../services/api/securityService';

export interface Anomaly {
  id: string;
  type: string;
  severity: string;
  message: string;
}

export const useAnomalyDetection = (autoFetch = true) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnomalies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await securityService.getAnomalies();
      setAnomalies(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch anomalies'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAetch();
      const interval = setInterval(fetchAnomalies, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoFetch, fetchAnomalies]);

  const acknowledgeAnomaly = useCallback(
    async (anomalyId: string) => {
      await securityService.reportAnomaly(anomalyId, 'acknowledge');
      setAnomalies((prev) => prev.filter((a) => a.id !== anomalyId));
    },
    []
  );

  return {
    anomalies,
    isLoading,
    error,
    refetch: fetchAnomalies,
    acknowledge: acknowledgeAnomaly,
  };
};

export default useAnomalyDetection;