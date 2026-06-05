/**
 * /frontend/src/services/security/sessionManager.ts
 *
 * Session management and security (pure service — no React hooks).
 */

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
}

class SessionManager {
  private readonly SESSION_KEY = 'zynctra_session';
  private readonly TOKEN_KEY = 'zynctra_token';
  private readonly REFRESH_KEY = 'zynctra_refresh_token';
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 min
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;

  createSession(
    token: string,
    refreshToken: string,
    expiresIn: number
  ): Session {
    const session: Session = {
      id: `session_${Date.now()}`,
      userId: this.extractUserIdFromToken(token),
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.REFRESH_KEY, refreshToken);
    this.setupInactivityTimer();
    return session;
  }

  getSession(): Session | null {
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }

  updateActivity(): void {
    const session = this.getSession();
    if (!session) return;
    session.lastActivity = new Date();
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.resetInactivityTimer();
  }

  isSessionValid(): boolean {
    const session = this.getSession();
    if (!session) return false;
    return new Date() < new Date(session.expiresAt);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    this.clearInactivityTimer();
  }

  private setupInactivityTimer(): void {
    this.resetInactivityTimer();
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.clearSession();
      window.location.href = '/login';
    }, this.INACTIVITY_TIMEOUT);
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimer !== null) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]!)) as {
        sub?: string;
        userId?: string;
      };
      return payload.sub ?? payload.userId ?? '';
    } catch {
      return '';
    }
  }
}

export default new SessionManager();