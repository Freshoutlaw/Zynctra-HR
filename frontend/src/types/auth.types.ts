/**
 * /src/types/auth.types.ts
 * Type definitions for authentication, authorization, and security contexts
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role: UserRole;
  permissions: Permission[];
  mfaEnabled: boolean;
  lastLogin: Date;
  isActive: boolean;
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
  id: string;
  name: string;
  description: string;
  resource: string;
  action: PermissionAction;
  conditions?: PermissionCondition[];
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
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
  value: any;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyMFA: (code: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export interface SessionToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  issuedAt: Date;
}

export interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface SecurityContext {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  issuedAt: Date;
  expiresAt: Date;
  mfaVerified: boolean;
}

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  subscriptionTier: SubscriptionTier;
  features: FeatureFlag[];
  encryptionKey: string;
  dataResidency: DataResidency;
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
  name: string;
  enabled: boolean;
  rolloutPercentage?: number;
  config?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
  traceId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, AuditChange>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
}

export interface AuditChange {
  oldValue: any;
  newValue: any;
  fieldName: string;
}

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  severity: EventSeverity;
  userId?: string;
  description: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
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
  id: string;
  command: string;
  args: string[];
  executedBy: string;
  executedAt: Date;
  duration: number;
  status: 'SUCCESS' | 'FAILURE';
  output: string;
  error?: string;
}

export interface CommandWhitelistEntry {
  command: string;
  description: string;
  requiredRole: UserRole;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  allowedArguments?: string[];
}

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  requestId?: string;
  sessionId: string;
}

export interface TerminalSession {
  sessionId: string;
  userId: string;
  startedAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
  commandHistory: TerminalCommand[];
}