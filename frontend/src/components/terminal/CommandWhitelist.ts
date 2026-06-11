/**
 * /frontend/src/components/terminal/CommandWhitelist.ts
 *
 * Defines the allowed commands for the secure terminal emulator.
 * Each entry specifies the command, description, risk level, and
 * any argument restrictions.
 */

import { UserRole } from '../../types/auth.types';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WhitelistEntry {
  command: string;
  description: string;
  riskLevel: RiskLevel;
  /** Minimum role required to execute */
  requiredRole: UserRole;
  /** Regex patterns that argument strings must NOT match */
  blockedArgPatterns?: RegExp[];
  /** If true, the command output is always redacted in logs */
  sensitiveOutput?: boolean;
  /** Max allowed args count (undefined = unlimited) */
  maxArgs?: number;
  /** Human-readable usage hint */
  usage?: string;
}

export const COMMAND_WHITELIST: WhitelistEntry[] = [
  // ── Filesystem (read-only) ──────────────────────────────────────────────
  {
    command: 'ls',
    description: 'List directory contents',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'ls [path]',
  },
  {
    command: 'cat',
    description: 'Display file contents',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    blockedArgPatterns: [/\/etc\/shadow/, /\.key$/, /\.pem$/, /\.env/],
    usage: 'cat <file>',
  },
  {
    command: 'pwd',
    description: 'Print working directory',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
  {
    command: 'find',
    description: 'Find files by name or pattern',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    blockedArgPatterns: [/-exec/, /-delete/],
    usage: 'find <path> -name <pattern>',
  },
  {
    command: 'grep',
    description: 'Search file contents',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'grep <pattern> <file>',
  },
  {
    command: 'head',
    description: 'Show first N lines of a file',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'head [-n N] <file>',
  },
  {
    command: 'tail',
    description: 'Show last N lines of a file',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'tail [-n N] <file>',
  },
  {
    command: 'wc',
    description: 'Count lines/words/bytes in a file',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'wc [-l|-w|-c] <file>',
  },

  // ── System information ──────────────────────────────────────────────────
  {
    command: 'whoami',
    description: 'Show current user identity',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
  {
    command: 'date',
    description: 'Display current system date and time',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 1,
  },
  {
    command: 'uptime',
    description: 'Show system uptime',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
  {
    command: 'df',
    description: 'Report disk space usage',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'df [-h]',
  },
  {
    command: 'free',
    description: 'Display memory usage',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'free [-h]',
  },
  {
    command: 'env',
    description: 'List environment variables (redacted secrets)',
    riskLevel: 'MEDIUM',
    requiredRole: UserRole.SUPER_ADMIN,
    sensitiveOutput: true,
    maxArgs: 0,
  },

  // ── Process monitoring ──────────────────────────────────────────────────
  {
    command: 'ps',
    description: 'List running processes',
    riskLevel: 'MEDIUM',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'ps [aux]',
  },
  {
    command: 'top',
    description: 'Interactive process monitor (non-interactive read)',
    riskLevel: 'MEDIUM',
    requiredRole: UserRole.TENANT_ADMIN,
    blockedArgPatterns: [/-b/], // block batch mode
    usage: 'top [-n 1]',
  },
  {
    command: 'lsof',
    description: 'List open files by process',
    riskLevel: 'MEDIUM',
    requiredRole: UserRole.SUPER_ADMIN,
    usage: 'lsof [-i] [-p <pid>]',
  },

  // ── Network diagnostics ─────────────────────────────────────────────────
  {
    command: 'ping',
    description: 'Test network connectivity',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    blockedArgPatterns: [/-f/, /--flood/],
    usage: 'ping -c 4 <host>',
    maxArgs: 4,
  },
  {
    command: 'dig',
    description: 'DNS lookup',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'dig <domain>',
  },
  {
    command: 'nslookup',
    description: 'Query DNS records',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'nslookup <domain>',
  },
  {
    command: 'curl',
    description: 'Make HTTP requests (GET only, internal endpoints)',
    riskLevel: 'HIGH',
    requiredRole: UserRole.SUPER_ADMIN,
    blockedArgPatterns: [/-X\s*(POST|PUT|PATCH|DELETE)/, /--data/, /-d\s/, /--upload/],
    usage: 'curl <url>',
  },

  // ── Database (read-only) ────────────────────────────────────────────────
  {
    command: 'psql',
    description: 'PostgreSQL read-only queries',
    riskLevel: 'HIGH',
    requiredRole: UserRole.SUPER_ADMIN,
    blockedArgPatterns: [
      /\bDROP\b/i, /\bDELETE\b/i, /\bTRUNCATE\b/i,
      /\bINSERT\b/i, /\bUPDATE\b/i, /\bALTER\b/i, /\bCREATE\b/i,
    ],
    sensitiveOutput: false,
    usage: 'psql -c "SELECT ..." <dbname>',
  },

  // ── Kubernetes ──────────────────────────────────────────────────────────
  {
    command: 'kubectl',
    description: 'Kubernetes cluster information (read-only)',
    riskLevel: 'HIGH',
    requiredRole: UserRole.SUPER_ADMIN,
    blockedArgPatterns: [/delete/, /apply/, /create/, /patch/, /replace/, /edit/],
    usage: 'kubectl get pods|services|nodes',
  },

  // ── Zynctra-specific ────────────────────────────────────────────────────
  {
    command: 'audit',
    description: 'View Zynctra audit log entries',
    riskLevel: 'MEDIUM',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'audit [--limit N] [--user <id>]',
    sensitiveOutput: true,
  },
  {
    command: 'security-status',
    description: 'Show current security posture summary',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
  {
    command: 'health',
    description: 'Check service health endpoints',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 1,
  },

  // ── Utilities ───────────────────────────────────────────────────────────
  {
    command: 'echo',
    description: 'Print text to output',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    usage: 'echo <text>',
  },
  {
    command: 'help',
    description: 'Show available commands',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 1,
  },
  {
    command: 'clear',
    description: 'Clear the terminal output',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
  {
    command: 'history',
    description: 'Show command history for this session',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 1,
  },
  {
    command: 'exit',
    description: 'Close the terminal session',
    riskLevel: 'LOW',
    requiredRole: UserRole.TENANT_ADMIN,
    maxArgs: 0,
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────

const whitelistMap = new Map<string, WhitelistEntry>(
  COMMAND_WHITELIST.map((e) => [e.command, e])
);

/**
 * Returns the whitelist entry for the given base command, or undefined.
 */
export const getWhitelistEntry = (command: string): WhitelistEntry | undefined =>
  whitelistMap.get(command.toLowerCase().trim());

/**
 * Returns true when the base command exists in the whitelist.
 */
export const isCommandAllowed = (command: string): boolean =>
  whitelistMap.has(command.toLowerCase().trim());

/**
 * Validates the full command string (base + args) against the whitelist entry.
 * Returns { valid: true } or { valid: false, reason: string }.
 */
export const validateFullCommand = (
  fullCommand: string,
  userRole: UserRole
): { valid: boolean; reason?: string } => {
  const parts = fullCommand.trim().split(/\s+/);
  const base = parts[0]?.toLowerCase() ?? '';
  const args = parts.slice(1).join(' ');

  const entry = whitelistMap.get(base);
  if (!entry) return { valid: false, reason: `Command "${base}" is not permitted.` };

  // Role check
  const roleHierarchy: UserRole[] = [
    UserRole.EMPLOYEE,
    UserRole.ACCOUNTANT,
    UserRole.READONLY,
    UserRole.MANAGER,
    UserRole.HR_MANAGER,
    UserRole.TENANT_ADMIN,
    UserRole.SUPER_ADMIN,
  ];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(entry.requiredRole);
  if (userLevel < requiredLevel) {
    return { valid: false, reason: `Insufficient permissions. Requires ${entry.requiredRole}.` };
  }

  // Max args check
  if (entry.maxArgs !== undefined && parts.length - 1 > entry.maxArgs) {
    return { valid: false, reason: `Too many arguments. Max ${entry.maxArgs} allowed.` };
  }

  // Blocked argument patterns
  if (entry.blockedArgPatterns) {
    for (const pattern of entry.blockedArgPatterns) {
      if (pattern.test(args)) {
        return { valid: false, reason: 'Argument contains a blocked pattern.' };
      }
    }
  }

  return { valid: true };
};

export default COMMAND_WHITELIST;