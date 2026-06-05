/**
 * /frontend/src/services/security/contentSecurityPolicy.ts
 *
 * Content Security Policy configuration helper.
 */

class ContentSecurityPolicyManager {
  private policy: Record<string, string[]> = {
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
    return Object.entries(this.policy)
      .map(([key, values]) =>
        values.length === 0 ? key : `${key} ${values.join(' ')}`
      )
      .join('; ');
  }

  setPolicy(directive: string, sources: string[]): void {
    this.policy[directive] = sources;
  }

  addSource(directive: string, source: string): void {
    if (!this.policy[directive]) this.policy[directive] = [];
    if (!this.policy[directive]!.includes(source)) {
      this.policy[directive]!.push(source);
    }
  }

  removeSource(directive: string, source: string): void {
    if (this.policy[directive]) {
      this.policy[directive] = this.policy[directive]!.filter((s) => s !== source);
    }
  }

  /** Apply the CSP as a <meta> tag in the document head */
  applyAsMetaTag(): void {
    const existing = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const meta = existing ?? document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', this.getPolicy());
    if (!existing) document.head.appendChild(meta);
  }
}

export default new ContentSecurityPolicyManager();