/**
 * /frontend/src/services/websocket/anomalyWsHandler.ts
 * 
 * WebSocket handler for real-time anomaly detection
 */

import WebSocketClient from './wsClient';

class AnomalyWebSocketHandler {
  private ws: WebSocketClient;
  private listeners: Map<string, Function[]> = new Map();

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.setupHandlers();
  }

  private setupHandlers() {
    this.ws.on('anomaly_detected', (data) => this.handleAnomalyDetected(data));
    this.ws.on('anomaly_resolved', (data) => this.handleAnomalyResolved(data));
    this.ws.on('anomaly_update', (data) => this.handleAnomalyUpdate(data));
  }

  private handleAnomalyDetected(data: any) {
    this.notifyListeners('detected', data);
  }

  private handleAnomalyResolved(data: any) {
    this.notifyListeners('resolved', data);
  }

  private handleAnomalyUpdate(data: any) {
    this.notifyListeners('updated', data);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  acknowledgeAnomaly(anomalyId: string) {
    this.ws.send('acknowledge_anomaly', { anomalyId });
  }

  resolveAnomaly(anomalyId: string) {
    this.ws.send('resolve_anomaly', { anomalyId });
  }
}

export default AnomalyWebSocketHandler;