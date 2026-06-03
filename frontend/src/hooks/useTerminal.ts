/**
 * /frontend/src/hooks/useTerminal.ts
 * 
 * Hook for terminal command execution
 */

import { useState, useCallback } from 'react';
import terminalService from '../services/api/terminalService';

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  error?: string;
  timestamp: Date;
}

export const useTerminal = () => {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setIsExecuting(true);
    setError(null);

    try {
      const result = await terminalService.executeCommand(command);
      const newCommand: TerminalCommand = {
        id: `cmd_${Date.now()}`,
        command,
        output: result.output || '',
        error: result.error,
        timestamp: new Date(),
      };
      setCommands((prev) => [...prev, newCommand]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Command execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setCommands([]);
  }, []);

  return {
    commands,
    isExecuting,
    error,
    executeCommand,
    clearHistory,
  };
};

export default useTerminal;