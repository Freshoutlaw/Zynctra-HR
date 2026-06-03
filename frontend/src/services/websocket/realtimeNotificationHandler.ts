/**
 * /frontend/src/services/websocket/realtimeNotificationHandler.ts
 * 
 * Real-time notification handler via WebSocket
 */

import WebSocketClient from './wsClient';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
}

class RealtimeNotificationHandler {
  private ws: WebSocketClient;
  private notifications: Notification[] = [];
  private listeners: Set<Function> = new Set();

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.setupHandlers();
  }

  private setupHandlers() {
    this.ws.on('notification', (data) => this.handleNotification(data));
    this.ws.on('notifications_batch', (data) => this.handleBatch(data));
  }

  private handleNotification(data: any) {
    const notification: Notification = {
      id: data.id,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'medium',
      timestamp: new Date(data.timestamp),
      read: false,
    };
    this.notifications.unshift(notification);
    this.notifyListeners();
  }

  private handleBatch(data: any) {
    if (Array.isArray(data.notifications)) {
      data.notifications.forEach((n: any) => {
        this.handleNotification(n);
      });
    }
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.ws.send('mark_notification_read', { notificationId });
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.ws.send('mark_all_notifications_read');
    this.notifyListeners();
  }

  clearNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  subscribe(callback: Function) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.notifications));
  }
}

export default RealtimeNotificationHandler;