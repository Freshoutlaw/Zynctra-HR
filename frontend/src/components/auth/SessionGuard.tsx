/**
 * /frontend/src/components/auth/SessionGuard.tsx
 *
 * Monitors session validity and auto-redirects on expiry.
 * Wrap around authenticated content inside AppLayout.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureSession } from '../../hooks/useSecureSession';
import { useAuth } from '../../hooks/useAuth';

interface SessionGuardProps {
  children: React.ReactNode;
  /** Warn the user this many milliseconds before expiry (default: 2 min) */
  warnBeforeMs?: number;
}

const SessionGuard: React.FC<SessionGuardProps> = ({
  children,
  warnBeforeMs = 2 * 60 * 1000,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isValid, timeUntilExpireMs } = useSecureSession();

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!isValid) {
      navigate('/login', { replace: true });
      return;
    }

    if (
      timeUntilExpireMs !== null &&
      timeUntilExpireMs > 0 &&
      timeUntilExpireMs <= warnBeforeMs
    ) {
      // Could show a toast here — keeping simple for now
      console.warn(
        `[SessionGuard] Session expires in ${Math.round(timeUntilExpireMs / 1000)}s`
      );
    }
  }, [isValid, timeUntilExpireMs, isAuthenticated, navigate, warnBeforeMs]);

  return <>{children}</>;
};

export default SessionGuard;