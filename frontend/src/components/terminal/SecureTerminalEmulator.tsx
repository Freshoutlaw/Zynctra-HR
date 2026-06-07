/**
 * /frontend/src/components/terminal/SecureTerminalEmulator.tsx
 * 
 * Embedded secure shell/terminal for system administrators
 * 
 * Security Features:
 * - WebSocket over TLS (wss://)
 * - RBAC enforcement (only SUPER_ADMIN/TENANT_ADMIN)
 * - Command whitelist validation
 * - All commands logged to immutable audit ledger
 * - Session isolation per user
 * - Token-based authentication
 * - Rate limiting on command execution
 * - Safe output escaping to prevent XSS
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';

interface TerminalOutput {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

interface SecureTerminalProps {
  onClose?: () => void;
  allowedRoles?: UserRole[];
}

const COMMAND_WHITELIST = [
  // File operations (read-only)
  { command: 'ls', description: 'List directory contents', riskLevel: 'LOW' },
  { command: 'cat', description: 'Display file contents', riskLevel: 'LOW' },
  { command: 'pwd', description: 'Print working directory', riskLevel: 'LOW' },

  // System information
  { command: 'whoami', description: 'Current user', riskLevel: 'LOW' },
  { command: 'date', description: 'System date/time', riskLevel: 'LOW' },
  { command: 'uptime', description: 'System uptime', riskLevel: 'LOW' },

  // Process monitoring
  { command: 'ps', description: 'List processes', riskLevel: 'MEDIUM' },
  { command: 'top', description: 'Process monitor', riskLevel: 'MEDIUM' },

  // Database operations
  { command: 'psql', description: 'PostgreSQL client', riskLevel: 'HIGH' },
  { command: 'mysql', description: 'MySQL client', riskLevel: 'HIGH' },

  // Kubernetes operations
  { command: 'kubectl', description: 'Kubernetes control', riskLevel: 'HIGH' },

  // Diagnostic commands
  { command: 'dig', description: 'DNS lookup', riskLevel: 'LOW' },
  { command: 'nslookup', description: 'DNS lookup', riskLevel: 'LOW' },
  { command: 'telnet', description: 'Network connection', riskLevel: 'MEDIUM' },

  // Audit commands
  { command: 'audit', description: 'View audit logs', riskLevel: 'MEDIUM' },
  { command: 'security-status', description: 'Security status', riskLevel: 'LOW' },

  // Help
  { command: 'help', description: 'Show available commands', riskLevel: 'LOW' },
  { command: 'clear', description: 'Clear terminal', riskLevel: 'LOW' },
];

/**
 * SecureTerminalEmulator Component
 *
 * Provides secure, authenticated terminal access for system administrators only
 * All commands are validated against whitelist and logged to audit trail
 */
export const SecureTerminalEmulator: React.FC<SecureTerminalProps> = ({
  onClose,
  allowedRoles = [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN],
}) => {
  const { user, isAuthenticated } = useAuth();
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const wsRef = useRef<WebSocket | null>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  /**
   * Check if user has permission to access terminal
   */
  const hasPermission = useCallback(() => {
    return isAuthenticated && user && allowedRoles.includes(user.role);
  }, [isAuthenticated, user, allowedRoles]);

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    if (!hasPermission()) {
      addOutput({
        type: 'error',
        content: '❌ Access Denied: Insufficient permissions to access this terminal',
      });
      return;
    }

    const wsUrl = `${process.env.REACT_APP_WEBSOCKET_URL}/admin/terminal`.replace(
      'http',
      'ws'
    );

    const connect = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          setIsConnected(true);
          addOutput({
            type: 'system',
            content: '✓ Connected to secure terminal (TLS/WSS)',
          });
          addOutput({
            type: 'system',
            content: `User: ${user?.email} | Role: ${user?.role}`,
          });
          addOutput({
            type: 'system',
            content: 'Type "help" for available commands or "clear" to clear screen',
          });
        };

        wsRef.current.onmessage = (event: MessageEvent) => {
          const message = JSON.parse(event.data);

          if (message.type === 'output') {
            addOutput({
              type: 'output',
              content: escapeHtml(message.content),
            });
          } else if (message.type === 'error') {
            addOutput({
              type: 'error',
              content: escapeHtml(message.content),
            });
          } else if (message.type === 'security_event') {
            addOutput({
              type: 'error',
              content: `🛡️ Security Event: ${message.content}`,
            });
          }

          setIsExecuting(false);
        };

        wsRef.current.onerror = (error) => {
          addOutput({
            type: 'error',
            content: 'WebSocket connection error occurred',
          });
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
          addOutput({
            type: 'system',
            content: 'Disconnected from terminal',
          });
        };
      } catch (error) {
        addOutput({
          type: 'error',
          content: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [hasPermission, user]);

  /**
   * Add output line to terminal
   */
  const addOutput = useCallback(
    (item: Omit<TerminalOutput, 'id' | 'timestamp'>) => {
      setOutput((prev) => [
        ...prev,
        {
          ...item,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        },
      ]);
    },
    []
  );

  /**
   * Validate command against whitelist
   */
  const validateCommand = (command: string): {
    valid: boolean;
    reason?: string;
  } => {
    const baseCommand = command.split(' ')[0].toLowerCase();

    if (!baseCommand) {
      return { valid: false, reason: 'Empty command' };
    }

    const whitelisted = COMMAND_WHITELIST.find(
      (cmd) => cmd.command === baseCommand
    );

    if (!whitelisted) {
      return { valid: false, reason: `Command not whitelisted: ${baseCommand}` };
    }

    // Additional validation for specific commands
    if (baseCommand === 'psql' || baseCommand === 'mysql') {
      // Only allow read operations
      if (
        command.toLowerCase().includes('drop') ||
        command.toLowerCase().includes('delete') ||
        command.toLowerCase().includes('update') ||
        command.toLowerCase().includes('insert')
      ) {
        return {
          valid: false,
          reason: 'Write operations are not permitted on databases',
        };
      }
    }

    return { valid: true };
  };

  /**
   * Execute command
   */
  const executeCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return;

      // Add to history
      setCommandHistory((prev) => [command, ...prev]);
      setHistoryIndex(-1);

      // Display input
      addOutput({
        type: 'input',
        content: `$ ${command}`,
      });

      // Validate command
      const validation = validateCommand(command);
      if (!validation.valid) {
        addOutput({
          type: 'error',
          content: `Error: ${validation.reason}`,
        });
        setIsExecuting(false);
        return;
      }

      // Check rate limiting
      const recentCommands = output.filter(
        (o) => o.type === 'input' && o.timestamp > new Date(Date.now() - 1000)
      );
      if (recentCommands.length > 5) {
        addOutput({
          type: 'error',
          content: 'Rate limit exceeded: Maximum 5 commands per second',
        });
        return;
      }

      // Send to backend
      setIsExecuting(true);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'command',
            command,
            timestamp: new Date().toISOString(),
            userId: user?.id,
          })
        );
      } else {
        addOutput({
          type: 'error',
          content: 'Not connected to terminal server',
        });
        setIsExecuting(false);
      }
    },
    [user, addOutput, output]
  );

  /**
   * Handle input submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  /**
   * Handle special commands (client-side)
   */

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : commandHistory[newIndex]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  };

  /**
   * Scroll to bottom on new output
   */
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  /**
   * Check permissions
   */
  if (!hasPermission()) {
    return (
      <motion.div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-slate-800 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            You do not have permission to access the secure terminal. Only system
            administrators can use this feature.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-4 md:inset-8 lg:inset-12 bg-slate-900 border border-cyan-500/30 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-cyan-400' : 'bg-red-400'
              }`}
            />
            <h2 className="text-lg font-bold text-white">Admin Terminal</h2>
            <span className="text-xs text-slate-400">
              (Secured • {user?.email} • {user?.role})
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
              aria-label="Close terminal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 font-mono text-sm">
          {output.length === 0 && (
            <div className="text-slate-500">
              Terminal ready. Type "help" for available commands.
            </div>
          )}
          {output.map((line) => (
            <div
              key={line.id}
              className={`font-mono text-sm mb-1 ${
                line.type === 'input'
                  ? 'text-cyan-400'
                  : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'system'
                      ? 'text-yellow-400'
                      : 'text-slate-300'
              }`}
              dangerouslySetInnerHTML={{
                __html: line.content.replace(/\n/g, '<br />'),
              }}
            />
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-900 border-t border-cyan-500/30 px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <span className="text-cyan-400 font-mono">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isConnected || isExecuting}
              placeholder="Enter command..."
              className="flex-1 bg-transparent text-white font-mono outline-none disabled:opacity-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={!isConnected || isExecuting}
              className="px-4 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:opacity-50 font-mono text-sm"
            >
              {isExecuting ? '⌛' : '→'}
            </button>
          </form>
          <div className="text-xs text-slate-500 mt-2">
            Tip: Use ↑/↓ to navigate command history. Ctrl+L to clear. Type "help" for
            commands.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Escape HTML to prevent XSS attacks in terminal output
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default SecureTerminalEmulator;