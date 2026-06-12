/**
 * /src/types/auth.types.ts
 * Type definitions for authentication, authorization, and security contexts
 * Hardened: strict null checks, immutable interfaces, audit-ready types.
 */

export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly tenantId: string;
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
  readonly mfaEnabled: boolean;
  readonly lastLogin: Date;
  readonly isActive: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  ACCOUNTANT = 'ACCOUNTANT',
  READONLY = 'READONLY',
}

export interface Permission {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly resource: string;
  readonly action: PermissionAction;
  readonly conditions?: readonly PermissionCondition[];
}

export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
}

export interface PermissionCondition {
  readonly field: string;
  readonly operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
  readonly value: unknown;
}

/** Registration payload — validated server-side before storage */
export interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly company?: string;
  readonly tenantId?: string;
  readonly role?: UserRole;
}

/** Auth context contract — all methods return Promises for async safety */
export interface AuthContextType {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly mfaVerified: boolean;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly verifyMFA: (code: string) => Promise<void>;
  readonly refreshToken: () => Promise<boolean>;
  readonly register: (data: RegisterData) => Promise<void>;
}

export interface SessionToken {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer';
  readonly issuedAt: Date;
}

export interface MFASetup {
  readonly secret: string;
  readonly qrCode: string;
  readonly backupCodes: readonly string[];
}

export interface SecurityContext {
  readonly sessionId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly deviceId: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly mfaVerified: boolean;
}

export interface TenantContext {
  readonly tenantId: string;
  readonly tenantName: string;
  readonly subscriptionTier: SubscriptionTier;
  readonly features: readonly FeatureFlag[];
  readonly encryptionKey: string;
  readonly dataResidency: DataResidency;
}

export enum SubscriptionTier {
  STARTUP = 'STARTUP',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export enum DataResidency {
  US_EAST = 'US_EAST',
  EU_WEST = 'EU_WEST',
  APAC = 'APAC',
  CUSTOM = 'CUSTOM',
}

export interface FeatureFlag {
  readonly name: string;
  readonly enabled: boolean;
  readonly rolloutPercentage?: number;
  readonly config?: Readonly<Record<string, unknown>>;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly timestamp: Date;
  readonly traceId: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly statusCode: number;
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly value?: unknown;
}

export interface AuditLog {
  readonly id: string;
  readonly userId: string;
  readonly action: string;
  readonly resource: string;
  readonly resourceId: string;
  readonly changes: Readonly<Record<string, unknown>>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly timestamp: Date;
  readonly status: 'SUCCESS' | 'FAILURE';
  readonly errorMessage?: string;
}

export interface AuditChange {
  readonly oldValue: unknown;
  readonly newValue: unknown;
  readonly fieldName: string;
}

export interface SecurityEvent {
  readonly id: string;
  readonly eventType: SecurityEventType;
  readonly severity: EventSeverity;
  readonly userId?: string;
  readonly description: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly ipAddress: string;
  readonly timestamp: Date;
  readonly resolved: boolean;
  readonly resolvedAt?: Date;
}

export enum SecurityEventType {
  FAILED_LOGIN_ATTEMPT = 'FAILED_LOGIN_ATTEMPT',
  BRUTE_FORCE_DETECTED = 'BRUTE_FORCE_DETECTED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  ANOMALOUS_PAYROLL = 'ANOMALOUS_PAYROLL',
  SESSION_HIJACKING = 'SESSION_HIJACKING',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  MALWARE_DETECTED = 'MALWARE_DETECTED',
}

export enum EventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface TerminalCommand {
  readonly id: string;
  readonly command: string;
  readonly args: readonly string[];
  readonly executedBy: string;
  readonly executedAt: Date;
  readonly duration: number;
  readonly status: 'SUCCESS' | 'FAILURE';
  readonly output: string;
  readonly error?: string;
}

export interface CommandWhitelistEntry {
  readonly command: string;
  readonly description: string;
  readonly requiredRole: UserRole;
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly allowedArguments?: readonly string[];
}

export interface WebSocketMessage<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: Date;
  readonly requestId?: string;
  readonly sessionId: string;
}

export interface TerminalSession {
  readonly sessionId: string;
  readonly userId: string;
  readonly startedAt: Date;
  readonly lastActivityAt: Date;
  readonly isActive: boolean;
  readonly commandHistory: readonly TerminalCommand[];
}