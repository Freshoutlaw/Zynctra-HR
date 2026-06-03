// cat > /mnt/user-data/outputs/terminalService.ts << 'EOF'
/**
 * /frontend/src/services/api/terminalService.ts
 * 
 * Secure terminal/command execution service
 */

import apiClient from './apiClient';

class TerminalService {
  async executeCommand(command: string, context?: any) {
    const response = await apiClient.post('/terminal/execute', {
      command,
      context,
    });
    return response.data;
  }

  async getCommandHistory() {
    const response = await apiClient.get('/terminal/history');
    return response.data;
  }

  async clearHistory() {
    const response = await apiClient.delete('/terminal/history');
    return response.data;
  }

  async getAvailableCommands() {
    const response = await apiClient.get('/terminal/commands');
    return response.data;
  }

  async validateCommand(command: string) {
    const response = await apiClient.post('/terminal/validate', { command });
    return response.data;
  }

  async getCommandLogs(filter?: any) {
    const response = await apiClient.get('/terminal/logs', {
      params: filter,
    });
    return response.data;
  }
}

export default new TerminalService();
// EOF