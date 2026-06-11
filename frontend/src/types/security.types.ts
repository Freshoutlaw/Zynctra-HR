export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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
