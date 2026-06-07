/**
 * /frontend/src/services/api/apiClient.ts
 *
 * Secure API client with:
 * - JWT authentication (reads token from sessionStorage via pure helpers)
 * - Automatic token refresh
 * - CSRF headers
 * - Request/response interceptors
 * - Rate limiting
 * - Error handling
 * - Tenant isolation
 */

import type { ApiResponse, ApiError } from '../../types/auth.types';
import {
  getCsrfToken,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeTokenSecurely,
  clearStoredTokens,
} from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------

class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly maxRequests = 100;
  private readonly windowMs = 60_000;

  isAllowed(key: string): boolean {
    const now = Date.now();
    const recent = (this.requests.get(key) ?? []).filter(
      (t) => now - t < this.windowMs
    );
    if (recent.length >= this.maxRequests) return false;
    recent.push(now);
    this.requests.set(key, recent);
    return true;
  }
}

const rateLimiter = new RateLimiter();

// ---------------------------------------------------------------------------
// Custom error
// ---------------------------------------------------------------------------

class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly apiError: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// ---------------------------------------------------------------------------
// Options accepted by every request method
// ---------------------------------------------------------------------------

export interface RequestOptions {
  /** URL query parameters — serialised to ?key=value */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Extra headers merged on top of defaults */
  headers?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------

const BASE_URL =
  (import.meta.env['VITE_API_URL'] as string | undefined) ??
  (import.meta.env['REACT_APP_API_URL'] as string | undefined) ??
  'http://localhost:8080/api';

class ApiClient {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private processQueue(error: unknown = null): void {
    for (const prom of this.failedQueue) {
      error ? prom.reject(error) : prom.resolve(null);
    }
    this.failedQueue = [];
  }

  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private buildHeaders(
    extra: Record<string, string> = {}
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': getCsrfToken(),
      ...extra,
    };
    const token = getStoredAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const tenantId = sessionStorage.getItem('__zynctra__tenant_id');
    if (tenantId) headers['X-Tenant-ID'] = tenantId;
    return headers;
  }

  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  private validatePayload(payload: unknown): void {
    const str = JSON.stringify(payload);
    if (str.length > 10 * 1024 * 1024)
      throw new Error('Payload exceeds maximum size (10 MB)');
  }

  // -------------------------------------------------------------------------
  // Response handler (handles 401 → refresh flow)
  // -------------------------------------------------------------------------

  private async handleResponse<T>(
    response: Response,
    retry: () => Promise<Response>
  ): Promise<T> {
    if (response.status === 401) {
      if (this.isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          this.failedQueue.push({
            resolve: (v) => resolve(v as T),
            reject,
          });
        }).then(async () => {
          const retried = await retry();
          return this.parseResponse<T>(retried);
        });
      }

      this.isRefreshing = true;
      const refreshed = await this.attemptRefresh();
      this.isRefreshing = false;

      if (refreshed) {
        this.processQueue();
        const retried = await retry();
        return this.parseResponse<T>(retried);
      } else {
        this.processQueue(new Error('Session expired'));
        clearStoredTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }

    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const ct = response.headers.get('content-type') ?? '';
    const data = ct.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const err: ApiError = {
        code: (data as { code?: string }).code ?? 'UNKNOWN_ERROR',
        message: (data as { message?: string }).message ?? response.statusText,
        statusCode: response.status,
        details: (data as { details?: Record<string, any> }).details,
      };
      throw new ApiClientError(err.message, err);
    }
    return data as T;
  }

  private async attemptRefresh(): Promise<boolean> {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const d = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      storeTokenSecurely(d.accessToken, d.refreshToken, d.expiresIn);
      return true;
    } catch {
      return false;
    }
  }

  // -------------------------------------------------------------------------
  // Public request helpers
  // -------------------------------------------------------------------------

  async get<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    if (!rateLimiter.isAllowed('GET')) throw new Error('Rate limit exceeded');
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    const makeRequest = () =>
      fetch(url, { method: 'GET', headers, credentials: 'include' });
    try {
      const res = await makeRequest();
      const data = await this.handleResponse<T>(res, makeRequest);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (err) {
      return this.wrapError(err);
    }
  }

  async post<T = unknown>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    if (!rateLimiter.isAllowed('POST')) throw new Error('Rate limit exceeded');
    this.validatePayload(body);
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    const makeRequest = () =>
      fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
      });
    try {
      const res = await makeRequest();
      const data = await this.handleResponse<T>(res, makeRequest);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (err) {
      return this.wrapError(err);
    }
  }

  async put<T = unknown>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.validatePayload(body);
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    const makeRequest = () =>
      fetch(url, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
      });
    try {
      const res = await makeRequest();
      const data = await this.handleResponse<T>(res, makeRequest);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (err) {
      return this.wrapError(err);
    }
  }

  async patch<T = unknown>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.validatePayload(body);
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    const makeRequest = () =>
      fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
      });
    try {
      const res = await makeRequest();
      const data = await this.handleResponse<T>(res, makeRequest);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (err) {
      return this.wrapError(err);
    }
  }

  async delete<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    const makeRequest = () =>
      fetch(url, { method: 'DELETE', headers, credentials: 'include' });
    try {
      const res = await makeRequest();
      const data = await this.handleResponse<T>(res, makeRequest);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (err) {
      return this.wrapError(err);
    }
  }

  // -------------------------------------------------------------------------
  // Error wrapper
  // -------------------------------------------------------------------------

  private wrapError<T>(err: unknown): ApiResponse<T> {
    let apiError: ApiError;
    if (err instanceof ApiClientError) {
      apiError = err.apiError;
    } else {
      apiError = {
        code: 'CLIENT_ERROR',
        message: err instanceof Error ? err.message : 'Unexpected error',
        statusCode: 0,
      };
    }
    console.error('[API Error]', apiError);
    return {
      success: false,
      error: apiError,
      timestamp: new Date(),
      traceId: this.generateTraceId(),
    };
  }
}

export const apiClient = new ApiClient();
export default apiClient;