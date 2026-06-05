/**
 * /frontend/src/hooks/useSecureSession.ts
 *
 * Hook for secure session management — monitors activity and
 * syncs with the AuthContext session state.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getStoredAccessToken, decodeJWT } from '../context/AuthContext';

export interface SecureSessionState {
  isValid: boolean;
  timeUntilExpireMs: number | null;
}

export const useSecureSession = (): SecureSessionState & {
  extendSession: () => void;
} => {
  const { isAuthenticated, logout, refreshToken } = useAuth();
  const [isValid, setIsValid] = useState(true);
  const [timeUntilExpireMs, setTimeUntilExpireMs] = useState<number | null>(null);

  const validate = useCallback(async () => {
    if (!isAuthenticated) {
      setIsValid(false);
      return;
    }
    const token = getStoredAccessToken();
    if (!token) {
      setIsValid(false);
      return;
    }
    const decoded = decodeJWT(token);
    const exp = decoded['exp'] as number | undefined;
    if (!exp) return;

    const nowSec = Date.now() / 1000;
    const remaining = (exp - nowSec) * 1000;

    if (remaining <= 0) {
      setIsValid(false);
      await logout();
      return;
    }

    // Proactively refresh when < 5 minutes remain
    if (remaining < 5 * 60 * 1000) {
      const success = await refreshToken();
      if (!success) {
        setIsValid(false);
        await logout();
        return;
      }
    }

    setIsValid(true);
    setTimeUntilExpireMs(remaining);
  }, [isAuthenticated, logout, refreshToken]);

  useEffect(() => {
    void validate();
    const interval = setInterval(() => void validate(), 60_000);
    return () => clearInterval(interval);
  }, [validate]);

  // Track user activity — reset any local idle timers
  const extendSession = useCallback(() => {
    void validate();
  }, [validate]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handler = () => extendSession();
    for (const ev of events) document.addEventListener(ev, handler, { passive: true });
    return () => {
      for (const ev of events) document.removeEventListener(ev, handler);
    };
  }, [extendSession]);

  return { isValid, timeUntilExpireMs, extendSession };
};

export default useSecureSession;