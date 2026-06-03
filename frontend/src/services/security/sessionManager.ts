/**
 * /frontend/src/services/security/sessionManager.ts
 * 
 * Session management and security
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
  private SESSION_KEY = 'zynctra_session';
  private TOKEN_KEY = 'zynctra_token';
  private REFRESH_KEY = 'zynctra_refresh_token';
  private INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private inactivityTimer: NodeJS.Timeout | null = null;

  createSession(token: string, refreshToken: string, expiresIn: number): Session {
    const session: Session = {
      id: `session_${Date.now()}`,
      userId: this.extractUserIdFromToken(token),
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);

    this.setupInactivityTimer();
    return session;
  }

  getSession(): Session | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  updateActivity() {
    const session = this.getSession();
    if (session) {
      session.lastActivity = new Date();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      this.resetInactivityTimer();
    }
  }

  isSessionValid(): boolean {
    const session = this.getSession();
    if (!session) return false;
    return new Date() < new Date(session.expiresAt);
  }

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.clearInactivityTimer();
  }

  private setupInactivityTimer() {
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.clearSession();
      window.location.href = '/login';
    }, this.INACTIVITY_TIMEOUT);
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId || '';
    } catch {
      return '';
    }
  }
}

export default new SessionManager();