from pathlib import Path

files = {
    'src/components/ui/Button.tsx': '''import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-400',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300',
  ghost: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-base',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      loading = false,
      disabled,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : 'inline-flex'}`;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${className}`.trim()}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="animate-pulse">Loading…</span> : null}
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
''',
    'src/components/ui/Card.tsx': '''import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'shadow' | 'outline' | 'solid';
  accent?: boolean;
}

const variantClassMap: Record<NonNullable<CardProps['variant']>, string> = {
  shadow: 'shadow-sm border border-slate-200 dark:border-slate-700',
  outline: 'border border-slate-200 dark:border-slate-700',
  solid: 'border-transparent',
};

const Card: React.FC<CardProps> = ({
  variant = 'shadow',
  accent = false,
  className = '',
  children,
  ...props
}) => {
  const accentClass = accent ? 'ring-1 ring-cyan-400/20 dark:ring-cyan-500/25' : '';

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-900 p-6 transition-colors ${variantClassMap[variant]} ${accentClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
''',
    'src/components/ui/Badge.tsx': '''import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const toneMap: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
};

const Badge: React.FC<BadgeProps> = ({
  tone = 'default',
  className = '',
  children,
  ...props
}) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneMap[tone]} ${className}`.trim()}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
''',
    'src/components/ui/Toast.tsx': '''import React from 'react';

export interface ToastProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const toneClasses: Record<NonNullable<ToastProps['type']>, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-rose-50 border-rose-200 text-rose-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-cyan-50 border-cyan-200 text-cyan-900',
};

const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  onClose,
}) => (
  <div className={`rounded-2xl border p-4 shadow-sm transition ${toneClasses[type]}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p className="mt-1 text-sm leading-6">{message}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label="Dismiss toast"
          onClick={onClose}
          className="rounded-full p-2 text-sm font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ×
        </button>
      ) : null}
    </div>
  </div>
);

export default Toast;
''',
    'src/components/analytics/TurnoverChart.tsx': '''import React from 'react';

interface TurnoverPoint {
  month: string;
  turnover: number;
}

const data: TurnoverPoint[] = [
  { month: 'Jan', turnover: 4.1 },
  { month: 'Feb', turnover: 3.8 },
  { month: 'Mar', turnover: 4.5 },
  { month: 'Apr', turnover: 4.0 },
  { month: 'May', turnover: 3.7 },
];

const TurnoverChart: React.FC = () => {
  const max = Math.max(...data.map((item) => item.turnover));

  return (
    <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Employee Turnover</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly turnover rate for the current fiscal quarter.</p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">Trend</span>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>{item.month}</span>
              <span>{item.turnover.toFixed(1)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{ width: `${(item.turnover / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TurnoverChart;
''',
    'src/components/terminal/TerminalInput.tsx': '''import React from 'react';

export interface TerminalInputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  placeholder = 'Enter command...',
  disabled = false,
  onChange,
  onSubmit,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">$</span>
      <input
        type="text"
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TerminalInput;
''',
    'src/components/terminal/TerminalOutput.tsx': '''import React from 'react';

export type TerminalLineType = 'stdout' | 'stderr' | 'info';

export interface TerminalOutputItem {
  id: string;
  timestamp: string;
  text: string;
  type?: TerminalLineType;
}

export interface TerminalOutputProps {
  lines: TerminalOutputItem[];
}

const typeMap: Record<TerminalLineType, string> = {
  stdout: 'text-slate-900 dark:text-slate-100',
  stderr: 'text-rose-600 dark:text-rose-300',
  info: 'text-slate-500 dark:text-slate-400',
};

const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => (
  <div className="space-y-3 overflow-y-auto px-3 py-4 text-sm leading-6 text-slate-800 dark:text-slate-200">
    {lines.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Waiting for terminal output...
      </div>
    ) : (
      lines.map((line) => (
        <div key={line.id} className="space-y-1 rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-950/70">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            <span>{line.type ?? 'stdout'}</span>
            <span>{line.timestamp}</span>
          </div>
          <pre className={`whitespace-pre-wrap break-words text-sm ${typeMap[line.type ?? 'stdout']}`}>{line.text}</pre>
        </div>
      ))
    )}
  </div>
);

export default TerminalOutput;
''',
    'src/services/api/authService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { User } from '../../types/auth.types';

const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> =>
    apiClient.post('/auth/login', { email, password }),

  logout: async (): Promise<ApiResponse<null>> => apiClient.post('/auth/logout'),

  refreshSession: async (): Promise<ApiResponse<{ user: User; token: string }>> =>
    apiClient.post('/auth/refresh'),

  getCurrentUser: async (): Promise<ApiResponse<User>> => apiClient.get('/auth/me'),

  requestPasswordReset: async (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/password-reset', { email }),

  verifyOtp: async (email: string, otp: string): Promise<ApiResponse<{ token: string }>> =>
    apiClient.post('/auth/verify', { email, otp }),
};

export default authService;
''',
    'src/services/api/auditLogService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { AccessLogEntry } from '../../types/security.types';

const auditLogService = {
  getLogs: async (
    params: Record<string, string | number | boolean> = {},
    limit = 50
  ): Promise<ApiResponse<AccessLogEntry[]>> =>
    apiClient.get('/audit/logs', { params: { ...params, limit } }),

  searchLogs: async (
    query: string,
    limit = 50
  ): Promise<ApiResponse<AccessLogEntry[]>> =>
    apiClient.get('/audit/logs/search', { params: { q: query, limit } }),
};

export default auditLogService;
''',
    'src/services/api/benefitsService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { BenefitPlan } from '../../types/payroll.types';

const benefitsService = {
  listBenefits: async (): Promise<ApiResponse<BenefitPlan[]>> => apiClient.get('/benefits/plans'),

  enrollBenefit: async (
    employeeId: string,
    benefitId: string
  ): Promise<ApiResponse<{ success: boolean }>> =>
    apiClient.post(`/benefits/enroll`, { employeeId, benefitId }),

  getEmployeeBenefits: async (employeeId: string): Promise<ApiResponse<BenefitPlan[]>> =>
    apiClient.get(`/benefits/employees/${employeeId}`),
};

export default benefitsService;
''',
    'src/services/api/connectorService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { ConnectorIntegration } from '../../types/api.types';

const connectorService = {
  listIntegrations: async (): Promise<ApiResponse<ConnectorIntegration[]>> =>
    apiClient.get('/connectors'),

  testConnectivity: async (connectorId: string): Promise<ApiResponse<{ healthy: boolean }>> =>
    apiClient.get(`/connectors/${connectorId}/test`),

  refreshConnector: async (connectorId: string): Promise<ApiResponse<{ refreshed: boolean }>> =>
    apiClient.post(`/connectors/${connectorId}/refresh`),
};

export default connectorService;
''',
    'src/services/api/complianceService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { CompliancePolicy, ComplianceStatus } from '../../types/security.types';

const complianceService = {
  getPolicies: async (): Promise<ApiResponse<CompliancePolicy[]>> => apiClient.get('/compliance/policies'),

  getComplianceStatus: async (): Promise<ApiResponse<ComplianceStatus>> =>
    apiClient.get('/compliance/status'),

  submitAuditReport: async (
    report: Record<string, unknown>
  ): Promise<ApiResponse<{ submitted: boolean }>> =>
    apiClient.post('/compliance/reports', report),
};

export default complianceService;
''',
    'src/services/api/incidentResponseService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { IncidentRecord } from '../../types/security.types';

const incidentResponseService = {
  listIncidents: async (): Promise<ApiResponse<IncidentRecord[]>> =>
    apiClient.get('/security/incidents'),

  resolveIncident: async (
    incidentId: string,
    resolution: string
  ): Promise<ApiResponse<{ resolved: boolean }>> =>
    apiClient.post(`/security/incidents/${incidentId}/resolve`, { resolution }),

  createIncident: async (
    payload: Partial<IncidentRecord>
  ): Promise<ApiResponse<IncidentRecord>> =>
    apiClient.post('/security/incidents', payload),
};

export default incidentResponseService;
''',
    'src/services/api/learningService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { LearningCourse } from '../../types/employee.types';

const learningService = {
  getCourses: async (): Promise<ApiResponse<LearningCourse[]>> =>
    apiClient.get('/learning/courses'),

  enrollInCourse: async (
    courseId: string,
    employeeId: string
  ): Promise<ApiResponse<{ enrolled: boolean }>> =>
    apiClient.post('/learning/enroll', { courseId, employeeId }),

  getProgress: async (employeeId: string): Promise<ApiResponse<{ completed: number; total: number }>> =>
    apiClient.get(`/learning/progress/${employeeId}`),
};

export default learningService;
''',
    'src/services/api/payrollService.ts': '''import apiClient from './apiClient';
import type { ApiResponse } from '../../types/api.types';
import type { PayrollSummary } from '../../types/payroll.types';

const payrollService = {
  getPayrollSummary: async (): Promise<ApiResponse<PayrollSummary>> =>
    apiClient.get('/payroll/summary'),

  runPayroll: async (payrollPeriodId: string): Promise<ApiResponse<{ processed: boolean }>> =>
    apiClient.post(`/payroll/run`, { payrollPeriodId }),

  getPayrollHistory: async (): Promise<ApiResponse<PayrollSummary[]>> =>
    apiClient.get('/payroll/history'),
};

export default payrollService;
''',
    'src/types/api.types.ts': '''export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
  traceId: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export interface ConnectorIntegration {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
  lastSync?: string;
}
''',
    'src/types/terminal.types.ts': '''export interface TerminalCommand {
  id: string;
  command: string;
  executedAt: string;
  status: 'pending' | 'success' | 'failed';
  userId: string;
}

export interface TerminalSessionState {
  sessionId: string;
  connected: boolean;
  startedAt: string;
  lastActiveAt?: string;
}

export interface TerminalOutputLine {
  id: string;
  text: string;
  type: 'stdout' | 'stderr' | 'info';
  timestamp: string;
}
''',
    'src/types/security.types.ts': '''export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AccessLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  outcome: 'success' | 'failure';
  ipAddress?: string;
}

export interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
  lastReviewedAt?: string;
}

export interface ComplianceStatus {
  passed: boolean;
  lastCheckedAt: string;
  outstandingIssues: number;
}

export interface IncidentRecord {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}
''',
    'src/types/payroll.types.ts': '''export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'PROCESSING' | 'COMPLETED';
}

export interface PayrollSummary {
  payrollPeriodId: string;
  totalPay: number;
  taxes: number;
  netTotal: number;
  processedAt?: string;
}

export interface BenefitPlan {
  id: string;
  name: string;
  description: string;
  enrollmentDeadline: string;
  active: boolean;
}
''',
    'src/types/employee.types.ts': '''export interface EmployeeRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  startDate: string;
  managerId?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  completed: boolean;
}
''',
    'src/types/ats.types.ts': '''export interface JobPosting {
  id: string;
  title: string;
  location: string;
  department: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  postedAt: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  appliedAt: string;
  status: 'NEW' | 'REVIEW' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
}

export interface InterviewSchedule {
  id: string;
  candidateId: string;
  scheduledAt: string;
  interviewer: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}
''',
    'src/stores/authStore.ts': '''import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ loading }),
}));
''',
    'src/stores/notificationStore.ts': '''import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
''',
    'src/stores/employeeStore.ts': '''import { create } from 'zustand';
import type { EmployeeRecord } from '../types/employee.types';

interface EmployeeState {
  employees: EmployeeRecord[];
  selectedEmployee: EmployeeRecord | null;
  setEmployees: (employees: EmployeeRecord[]) => void;
  selectEmployee: (employee: EmployeeRecord | null) => void;
  updateEmployee: (employee: EmployeeRecord) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  selectedEmployee: null,
  setEmployees: (employees) => set({ employees }),
  selectEmployee: (selectedEmployee) => set({ selectedEmployee }),
  updateEmployee: (employee) =>
    set((state) => ({
      employees: state.employees.map((item) =>
        item.id === employee.id ? employee : item
      ),
      selectedEmployee:
        state.selectedEmployee?.id === employee.id ? employee : state.selectedEmployee,
    })),
}));
''',
    'src/stores/payrollStore.ts': '''import { create } from 'zustand';
import type { PayrollSummary } from '../types/payroll.types';

interface PayrollState {
  summary: PayrollSummary | null;
  history: PayrollSummary[];
  loading: boolean;
  setSummary: (summary: PayrollSummary) => void;
  setHistory: (history: PayrollSummary[]) => void;
  setLoading: (loading: boolean) => void;
}

export const usePayrollStore = create<PayrollState>((set) => ({
  summary: null,
  history: [],
  loading: false,
  setSummary: (summary) => set({ summary }),
  setHistory: (history) => set({ history }),
  setLoading: (loading) => set({ loading }),
}));
''',
    'src/stores/securityStore.ts': '''import { create } from 'zustand';
import type { IncidentRecord } from '../types/security.types';

interface SecurityState {
  incidents: IncidentRecord[];
  selectedIncident: IncidentRecord | null;
  setIncidents: (incidents: IncidentRecord[]) => void;
  selectIncident: (incident: IncidentRecord | null) => void;
  resolveIncident: (incidentId: string) => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  incidents: [],
  selectedIncident: null,
  setIncidents: (incidents) => set({ incidents }),
  selectIncident: (selectedIncident) => set({ selectedIncident }),
  resolveIncident: (incidentId) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, resolved: true, resolvedAt: new Date().toISOString() }
          : incident
      ),
      selectedIncident:
        state.selectedIncident?.id === incidentId
          ? { ...state.selectedIncident, resolved: true, resolvedAt: new Date().toISOString() }
          : state.selectedIncident,
    })),
}));
''',
    'src/stores/atsStore.ts': '''import { create } from 'zustand';
import type { CandidateProfile, JobPosting } from '../types/ats.types';

interface AtsState {
  jobs: JobPosting[];
  candidates: CandidateProfile[];
  selectedJob: JobPosting | null;
  setJobs: (jobs: JobPosting[]) => void;
  setCandidates: (candidates: CandidateProfile[]) => void;
  selectJob: (job: JobPosting | null) => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  jobs: [],
  candidates: [],
  selectedJob: null,
  setJobs: (jobs) => set({ jobs }),
  setCandidates: (candidates) => set({ candidates }),
  selectJob: (selectedJob) => set({ selectedJob }),
}));
''',
    'src/stores/aiStore.ts': '''import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAt: string;
}

interface AiState {
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  setProcessing: (isProcessing: boolean) => void;
  appendMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  clearChat: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  chatHistory: [],
  isProcessing: false,
  setProcessing: (isProcessing) => set({ isProcessing }),
  appendMessage: (message) =>
    set((state) => ({
      chatHistory: [
        {
          ...message,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
        ...state.chatHistory,
      ],
    })),
  clearChat: () => set({ chatHistory: [] }),
}));
''',
    'src/styles/variables.css': '''/* Zynctra design tokens and CSS variables */
:root {
  --font-family-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  --color-primary: #06b6d4;
  --color-primary-dark: #0891b2;
  --color-secondary: #22c55e;
  --color-surface: #ffffff;
  --color-surface-alt: #f8fafc;
  --color-border: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-bg-primary: #f8fafc;
  --color-bg-secondary: #f1f5f9;
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #0ea5e9;

  --shadow-soft: 0 18px 60px rgba(15, 23, 42, 0.08);
  --shadow-card: 0 10px 30px rgba(15, 23, 42, 0.08);
  --transition-smooth: 200ms ease;
  --border-radius-lg: 1rem;
}

.dark {
  --color-surface: #0f172a;
  --color-surface-alt: #111827;
  --color-border: #1f2937;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-bg-primary: #020617;
  --color-bg-secondary: #111827;
}
''',
    'src/styles/responsive.css': '''/* Responsive utilities for Zynctra */

@media (max-width: 1200px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 900px) {
  .grid-responsive {
    gap: 1rem;
  }

  .hide-desktop {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }

  .responsive-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .text-responsive {
    font-size: 0.95rem;
  }
}
''',
    'src/styles/globals.css': '''/* Global CSS entrypoint for Zynctra UI */

@import './reset.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@import './themes.css';
@import './forms.css';
@import './animations.css';
@import './utilities.css';

html {
  scroll-behavior: smooth;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

::selection {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
}

body {
  transition: background-color var(--transition-smooth), color var(--transition-smooth);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-smooth);
}

a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

code {
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: var(--font-family-mono);
}

pre {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875em;
  line-height: 1.5;
  border: 1px solid var(--color-border);
}

main {
  flex: 1;
  width: 100%;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}

@media (min-width: 1536px) {
  .container {
    max-width: 1280px;
  }
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.2);
}

:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media print {
  body {
    background-color: white;
    color: black;
  }

  a {
    color: black;
    text-decoration: underline;
  }

  .no-print {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (prefers-contrast: more) {
  :root {
    --color-primary: rgb(0, 100, 200);
  }

  .dark {
    --color-primary: rgb(0, 200, 255);
  }
}

@media (forced-colors: active) {
  a {
    text-decoration: underline;
  }

  button {
    border: 1px solid;
  }
}
''',
}

root = Path('.')
for relative_path, content in files.items():
    path = root / relative_path
    path.write_text(content, encoding='utf-8')
    print(f'Wrote {path}')
