/**
 * /frontend/src/services/websocket/terminalWsHandler.ts
 *
 * Terminal command WebSocket handler.
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

type OutputListener = (outputs: TerminalOutput[]) => void;

class TerminalWebSocketHandler {
  private readonly ws: WebSocketClient;
  private commandOutputs: TerminalOutput[] = [];
  private readonly listeners = new Set<OutputListener>();
  private currentCommandId: string | null = null;

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.ws.on('terminal_output', (d) =>
      this.handleOutput(d as { output: string })
    );
    this.ws.on('terminal_error', (d) =>
      this.handleError(d as { error: string })
    );
    this.ws.on('command_executed', (d) =>
      this.handleCommandExecuted(d as Record<string, unknown>)
    );
  }

  private handleOutput(data: { output: string }): void {
    if (!this.currentCommandId) return;
    const existing = this.commandOutputs.find(
      (c) => c.id === this.currentCommandId
    );
    if (existing) {
      existing.output += data.output;
      this.notify();
    }
  }

  private handleError(data: { error: string }): void {
    if (!this.currentCommandId) return;
    const existing = this.commandOutputs.find(
      (c) => c.id === this.currentCommandId
    );
    if (existing) {
      existing.error = data.error;
      this.notify();
    }
  }

  private handleCommandExecuted(data: Record<string, unknown>): void {
    const record: TerminalOutput = {
      id: data['id'] as string,
      command: data['command'] as string,
      output: (data['output'] as string | undefined) ?? '',
      error: data['error'] as string | undefined,
      timestamp: new Date(),
      executionTime: (data['executionTime'] as number | undefined) ?? 0,
    };
    this.commandOutputs = [...this.commandOutputs, record];
    this.notify();
  }

  executeCommand(command: string): string {
    const id = `cmd_${Date.now()}`;
    this.currentCommandId = id;
    this.ws.send('execute_command', { id, command });
    return id;
  }

  getOutputs(): TerminalOutput[] {
    return this.commandOutputs;
  }

  clearOutputs(): void {
    this.commandOutputs = [];
    this.notify();
  }

  subscribe(cb: OutputListener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) cb(this.commandOutputs);
  }
}

export default TerminalWebSocketHandler;