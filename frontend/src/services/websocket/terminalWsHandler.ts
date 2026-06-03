/**
 * /frontend/src/services/websocket/terminalWsHandler.ts
 * 
 * Terminal command WebSocket handler
 */

import WebSocketClient from './wsClient';

export interface TerminalOutput {
  id: string;
  command: string;
  output: string;
  error?: string;
  timestamp: Date;
  executionTime: number;
}

class TerminalWebSocketHandler {
  private ws: WebSocketClient;
  private commandOutputs: TerminalOutput[] = [];
  private listeners: Set<Function> = new Set();
  private currentCommandId: string | null = null;

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.setupHandlers();
  }

  private setupHandlers() {
    this.ws.on('terminal_output', (data) => this.handleOutput(data));
    this.ws.on('terminal_error', (data) => this.handleError(data));
    this.ws.on('command_executed', (data) => this.handleCommandExecuted(data));
  }

  private handleOutput(data: any) {
    if (this.currentCommandId) {
      const output = this.commandOutputs.find((c) => c.id === this.currentCommandId);
      if (output) {
        output.output += data.output;
        this.notifyListeners();
      }
    }
  }

  private handleError(data: any) {
    if (this.currentCommandId) {
      const output = this.commandOutputs.find((c) => c.id === this.currentCommandId);
      if (output) {
        output.error = data.error;
        this.notifyListeners();
      }
    }
  }

  private handleCommandExecuted(data: any) {
    const terminalOutput: TerminalOutput = {
      id: data.id,
      command: data.command,
      output: data.output || '',
      error: data.error,
      timestamp: new Date(),
      executionTime: data.executionTime || 0,
    };
    this.commandOutputs.push(terminalOutput);
    this.notifyListeners();
  }

  executeCommand(command: string): string {
    const commandId = `cmd_${Date.now()}`;
    this.currentCommandId = commandId;
    this.ws.send('execute_command', { id: commandId, command });
    return commandId;
  }

  getOutputs(): TerminalOutput[] {
    return this.commandOutputs;
  }

  clearOutputs() {
    this.commandOutputs = [];
    this.notifyListeners();
  }

  subscribe(callback: Function) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.commandOutputs));
  }
}

export default TerminalWebSocketHandler;