/**
 * /frontend/src/services/api/terminalService.ts
 *
 * Secure terminal / command execution service
 */

import apiClient from './apiClient';

class TerminalService {
  async executeCommand(command: string, context?: unknown) {
    const res = await apiClient.post('/terminal/execute', { command, context });
    return res.data as { output?: string; error?: string };
  }

  async getCommandHistory() {
    const res = await apiClient.get('/terminal/history');
    return res.data ?? [];
  }

  async clearHistory() {
    const res = await apiClient.delete('/terminal/history');
    return res.data;
  }

  async getAvailableCommands() {
    const res = await apiClient.get('/terminal/commands');
    return res.data ?? [];
  }

  async validateCommand(command: string) {
    const res = await apiClient.post('/terminal/validate', { command });
    return res.data as { valid: boolean; reason?: string };
  }

  async getCommandLogs(
    filter?: Record<string, string | number | boolean | null | undefined>
  ) {
    const res = await apiClient.get(
      '/terminal/logs',
      filter ? { params: filter } : {}
    );
    return res.data ?? [];
  }
}

export default new TerminalService();