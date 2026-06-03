/**
 * /frontend/src/hooks/useSecureSession.ts
 * 
 * Hook for secure session management
 */

import { useState, useEffect, useCallback } from 'react';
import sessionManager, { Session } from '../services/security/sessionManager';

export const useSecureSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentSession = sessionManager.getSession();
    setSession(currentSession);
    setIsAuthenticated(sessionManager.isSessionValid());

    // Monitor activity
    const handleActivity = () => {
      sessionManager.updateActivity();
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
    };
  }, []);

  const logout = useCallback(() => {
    sessionManager.clearSession();
    setSession(null);
    setIsAuthenticated(false);
  }, []);

  return {
    session,
    isAuthenticated,
    logout,
  };
};

export default useSecureSession;