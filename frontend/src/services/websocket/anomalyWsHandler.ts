/**
 * /frontend/src/services/websocket/anomalyWsHandler.ts
 *
 * WebSocket handler for real-time anomaly detection.
 */

import WebSocketClient from './wsClient';

type AnomalyHandler = (data: unknown) => void;

class AnomalyWebSocketHandler {
  private readonly ws: WebSocketClient;
  private readonly listeners = new Map<string, AnomalyHandler[]>();

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.ws.on('anomaly_detected', (d) => this.emit('detected', d));
    this.ws.on('anomaly_resolved', (d) => this.emit('resolved', d));
    this.ws.on('anomaly_update', (d) => this.emit('updated', d));
  }

  on(event: string, callback: AnomalyHandler): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: AnomalyHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      this.listeners.set(event, handlers.filter((h) => h !== callback));
    }
  }

  private emit(event: string, data: unknown): void {
    for (const cb of this.listeners.get(event) ?? []) cb(data);
  }

  acknowledgeAnomaly(anomalyId: string): void {
    this.ws.send('acknowledge_anomaly', { anomalyId });
  }

  resolveAnomaly(anomalyId: string): void {
    this.ws.send('resolve_anomaly', { anomalyId });
  }
}

export default AnomalyWebSocketHandler;