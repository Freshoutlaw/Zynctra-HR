/**
 * /frontend/src/services/websocket/wsClient.ts
 *
 * WebSocket client for real-time features
 */

type MessageHandler = (data: unknown) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly messageHandlers = new Map<string, MessageHandler[]>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent<string>) => {
          try {
            const data = JSON.parse(event.data) as { type?: string };
            if (data.type) this.handleMessage(data.type, data);
          } catch {
            console.warn('[WS] Failed to parse message', event.data);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WS] error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          this.scheduleReconnect();
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private handleMessage(type: string, data: unknown): void {
    const handlers = this.messageHandlers.get(type) ?? [];
    for (const handler of handlers) handler(data);
  }

  on(eventType: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }
    this.messageHandlers.get(eventType)!.push(handler);
  }

  off(eventType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      this.messageHandlers.set(
        eventType,
        handlers.filter((h) => h !== handler)
      );
    }
  }

  send(eventType: string, data?: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: eventType, ...data }));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectTimer = setTimeout(() => void this.connect().catch(console.error), delay);
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export default WebSocketClient;