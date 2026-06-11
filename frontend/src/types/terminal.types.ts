export interface TerminalCommand {
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
