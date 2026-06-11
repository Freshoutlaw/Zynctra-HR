/**
 * /frontend/src/components/terminal/RBACValidator.ts
 *
 * Terminal-specific RBAC validation layer.
 * Wraps the global rbacValidator with terminal-context checks and
 * provides a single entry-point used by SecureTerminalEmulator.
 */

import { UserRole } from '../../types/auth.types';
import {
  getWhitelistEntry,
  validateFullCommand,
  type WhitelistEntry,
  type RiskLevel,
} from './CommandWhitelist';

export interface TerminalAuthContext {
  userId: string;
  userRole: UserRole;
  tenantId: string;
  sessionId: string;
  ipAddress?: string;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  entry?: WhitelistEntry;
  riskLevel?: RiskLevel;
  requiresConfirmation?: boolean;
}

// Roles that may access the terminal at all
const TERMINAL_ALLOWED_ROLES: Set<UserRole> = new Set([
  UserRole.SUPER_ADMIN,
  UserRole.TENANT_ADMIN,
]);

// High-risk commands that display a confirmation prompt before execution
const CONFIRMATION_REQUIRED_RISK: Set<RiskLevel> = new Set(['HIGH', 'CRITICAL']);

/**
 * Returns true when the user's role grants terminal access.
 */
export const canAccessTerminal = (role: UserRole): boolean =>
  TERMINAL_ALLOWED_ROLES.has(role);

/**
 * Full terminal command validation.
 *
 * Checks (in order):
 * 1. User has terminal access
 * 2. Command is in the whitelist
 * 3. User's role satisfies the command's requiredRole
 * 4. Arguments pass blocked-pattern filters
 * 5. Flags whether a confirmation prompt is required
 */
export const validateTerminalCommand = (
  fullCommand: string,
  ctx: TerminalAuthContext
): ValidationResult => {
  // Step 1 – terminal access
  if (!canAccessTerminal(ctx.userRole)) {
    return {
      allowed: false,
      reason: 'Terminal access is restricted to administrators.',
    };
  }

  // Step 2 + 3 + 4 – whitelist & role & arg checks
  const result = validateFullCommand(fullCommand, ctx.userRole);
  if (!result.valid) {
    return {
      allowed: false,
      ...(result.reason ? { reason: result.reason } : {}),
    };
  }

  // Fetch whitelist metadata
  const base = fullCommand.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  const entry = getWhitelistEntry(base);

  // Step 5 – confirmation for high-risk commands
  const requiresConfirmation =
    entry ? CONFIRMATION_REQUIRED_RISK.has(entry.riskLevel) : false;

  const response: ValidationResult = {
    allowed: true,
    requiresConfirmation,
  };

  if (entry) {
    response.entry = entry;
    response.riskLevel = entry.riskLevel;
  }

  return response;
};

/**
 * Sanitise command input: strip dangerous shell constructs
 * (pipes to destructive commands, redirects, subshells, etc.)
 * Returns the sanitised string, or null if the command should be rejected.
 */
export const sanitiseCommandInput = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Block shell injection sequences
  const forbidden = [
    /&&\s*(rm|mkfs|dd|wget|curl\s+-X|chmod\s+777)/i,
    /\|\s*(sh|bash|zsh|python|node|perl)/i,
    />\s*\/etc\//i,
    /`[^`]*`/,            // backtick subshell
    /\$\([^)]*\)/,        // $(...) subshell
    /;\s*(rm|mkfs|dd)/i,
  ];

  for (const pattern of forbidden) {
    if (pattern.test(trimmed)) return null;
  }

  // Strip ANSI escape sequences to prevent log injection
  return trimmed.replace(/\x1b\[[0-9;]*m/g, '');
};

/**
 * Generates a minimal audit record for each executed command.
 */
export const buildAuditRecord = (
  command: string,
  ctx: TerminalAuthContext,
  result: ValidationResult,
  outcome: 'executed' | 'blocked' | 'error',
  exitCode?: number
) => ({
  timestamp: new Date().toISOString(),
  sessionId: ctx.sessionId,
  userId: ctx.userId,
  tenantId: ctx.tenantId,
  userRole: ctx.userRole,
  ipAddress: ctx.ipAddress ?? 'unknown',
  command: result.entry?.sensitiveOutput ? '[REDACTED]' : command,
  riskLevel: result.riskLevel ?? 'LOW',
  outcome,
  exitCode: exitCode ?? null,
});

export default {
  canAccessTerminal,
  validateTerminalCommand,
  sanitiseCommandInput,
  buildAuditRecord,
};