/**
 * /frontend/src/services/security/contentSecurityPolicy.ts
 * 
 * Content Security Policy configuration
 */

class ContentSecurityPolicyManager {
  private cspPolicy: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    'connect-src': ["'self'", 'https:', 'wss:', 'ws:'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  };

  getPolicy(): string {
    return Object.entries(this.cspPolicy)
      .map(([key, values]) => {
        if (values.length === 0) return key;
        return `${key} ${values.join(' ')}`;
      })
      .join('; ');
  }

  setPolicy(directive: string, sources: string[]): void {
    this.cspPolicy[directive] = sources;
  }

  addSource(directive: string, source: string): void {
    if (!this.cspPolicy[directive]) {
      this.cspPolicy[directive] = [];
    }
    if (!this.cspPolicy[directive].includes(source)) {
      this.cspPolicy[directive].push(source);
    }
  }

  removeSource(directive: string, source: string): void {
    if (this.cspPolicy[directive]) {
      this.cspPolicy[directive] = this.cspPolicy[directive].filter((s) => s !== source);
    }
  }

  validateScriptSource(source: string): boolean {
    const scriptSources = this.cspPolicy['script-src'] || [];
    return (
      scriptSources.includes("'self'") ||
      scriptSources.some((s) => this.matchesPattern(source, s))
    );
  }

  private matchesPattern(url: string, pattern: string): boolean {
    if (pattern === '*') return true;
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return url.startsWith(prefix);
    }
    return url === pattern;
  }
}

export default new ContentSecurityPolicyManager();