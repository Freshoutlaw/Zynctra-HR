/**
 * /frontend/src/services/websocket/realtimeNotificationHandler.ts
 *
 * Real-time notification handler via WebSocket.
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

type NotificationListener = (notifications: Notification[]) => void;

class RealtimeNotificationHandler {
  private readonly ws: WebSocketClient;
  private notifications: Notification[] = [];
  private readonly listeners = new Set<NotificationListener>();

  constructor(wsClient: WebSocketClient) {
    this.ws = wsClient;
    this.ws.on('notification', (d) =>
      this.handleNotification(d as Record<string, unknown>)
    );
    this.ws.on('notifications_batch', (d) =>
      this.handleBatch(d as { notifications: Record<string, unknown>[] })
    );
  }

  private handleNotification(data: Record<string, unknown>): void {
    const n: Notification = {
      id: data['id'] as string,
      type: data['type'] as string,
      title: data['title'] as string,
      message: data['message'] as string,
      priority: (data['priority'] as Notification['priority']) ?? 'medium',
      timestamp: new Date((data['timestamp'] as string) ?? Date.now()),
      read: false,
    };
    this.notifications = [n, ...this.notifications];
    this.notify();
  }

  private handleBatch(data: { notifications: Record<string, unknown>[] }): void {
    for (const n of data.notifications ?? []) this.handleNotification(n);
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(notificationId: string): void {
    const n = this.notifications.find((x) => x.id === notificationId);
    if (n) {
      n.read = true;
      this.ws.send('mark_notification_read', { notificationId });
      this.notify();
    }
  }

  markAllAsRead(): void {
    for (const n of this.notifications) n.read = true;
    this.ws.send('mark_all_notifications_read');
    this.notify();
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notify();
  }

  subscribe(cb: NotificationListener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) cb(this.notifications);
  }
}

export default RealtimeNotificationHandler;