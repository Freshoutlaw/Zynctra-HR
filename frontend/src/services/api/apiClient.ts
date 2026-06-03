/**
 * /src/services/api/apiClient.ts
 * 
 * Secure API client with:
 * - JWT authentication
 * - Automatic token refresh
 * - Security headers (CSRF, CSP)
 * - Request/response interceptors
 * - Rate limiting
 * - Error handling
 * - Tenant isolation
 */

import { getCsrfToken, getStoredAccessToken, refreshAccessToken } from '../../hooks/useAuth';
import { ApiResponse, ApiError, ValidationError } from '../../types/auth.types';

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * Rate limiter to prevent abuse
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number = 100;
  private windowMs: number = 60000; // 1 minute

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      console.warn(`Rate limit exceeded for ${key}`);
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter();

/**
 * Main API client class
 */
class ApiClient {
  private config: ApiClientConfig;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(null);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Build request headers with security measures
   */
  private buildHeaders(
    method: string,
    contentType: string = 'application/json'
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': getCsrfToken(),
      'X-Tenant-ID': this.getTenantId(),
    };

    // Add authorization header
    const token = getStoredAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add security headers
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';

    return headers;
  }

  /**
   * Get tenant ID from session or context
   */
  private getTenantId(): string {
    // In production, get from auth context or session
    return sessionStorage.getItem('__zynctra__tenant_id') || '';
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryRequest<T>(
    request: () => Promise<Response>,
    attempt: number = 0
  ): Promise<T> {
    try {
      const response = await request();
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        const delay = this.config.retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryRequest(request, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Handle API response with error checking
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized - refresh token
    if (response.status === 401 && !this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const success = await refreshAccessToken();

        if (!success) {
          throw new Error('Token refresh failed');
        }

        this.processQueue();
        this.isRefreshing = false;

        // Retry original request
        throw new Error('RETRY_REQUEST');
      } catch (error) {
        this.processQueue(error);
        this.isRefreshing = false;

        // Redirect to login
        window.location.href = '/login';
        throw error;
      }
    }

    // Queue failed requests during token refresh
    if (response.status === 401 && this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => {
        // Retry with new token
        throw new Error('RETRY_REQUEST');
      });
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const error: ApiError = {
        code: data?.code || 'UNKNOWN_ERROR',
        message: data?.message || response.statusText,
        statusCode: response.status,
        details: data?.details,
      };

      throw new ApiClientError(error.message, error);
    }

    // Return data
    return data as T;
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Rate limiting check
    if (!rateLimiter.isAllowed('GET')) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.config.baseURL}${endpoint}`;
    const headers = this.buildHeaders('GET');

    const request = () =>
      fetch(url, {
        ...options,
        method: 'GET',
        headers: { ...headers, ...options.headers },
        credentials: 'include',
      });

    try {
      const data = await this.retryRequest<T>(request);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body: any = {},
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Rate limiting check
    if (!rateLimiter.isAllowed('POST')) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.config.baseURL}${endpoint}`;
    const headers = this.buildHeaders('POST');

    // Validate request payload
    if (body && typeof body === 'object') {
      this.validatePayload(body);
    }

    const request = () =>
      fetch(url, {
        ...options,
        method: 'POST',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(body),
        credentials: 'include',
      });

    try {
      const data = await this.retryRequest<T>(request);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body: any = {},
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = this.buildHeaders('PUT');

    this.validatePayload(body);

    const request = () =>
      fetch(url, {
        ...options,
        method: 'PUT',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(body),
        credentials: 'include',
      });

    try {
      const data = await this.retryRequest<T>(request);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = this.buildHeaders('DELETE');

    const request = () =>
      fetch(url, {
        ...options,
        method: 'DELETE',
        headers: { ...headers, ...options.headers },
        credentials: 'include',
      });

    try {
      const data = await this.retryRequest<T>(request);
      return { success: true, data, timestamp: new Date(), traceId: this.generateTraceId() };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate request payload for security issues
   */
  private validatePayload(payload: any): void {
    const payload_str = JSON.stringify(payload);

    // Check for potential SQL injection patterns
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b)/i,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(payload_str)) {
        console.warn('Potential SQL injection detected in payload');
      }
    }

    // Check payload size (max 10MB)
    if (payload_str.length > 10 * 1024 * 1024) {
      throw new Error('Payload exceeds maximum size (10MB)');
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): ApiResponse<never> {
    let apiError: ApiError;

    if (error instanceof ApiClientError) {
      apiError = error.error;
    } else if (error instanceof Error) {
      apiError = {
        code: 'CLIENT_ERROR',
        message: error.message,
        statusCode: 0,
      };
    } else {
      apiError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
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

  /**
   * Generate unique trace ID for logging
   */
  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Custom error class for API errors
 */
class ApiClientError extends Error {
  constructor(message: string, public error: ApiError) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;