/** Notification category types. */
export type NotificationCategory = 'task' | 'agent' | 'system';
/** Notification priority levels. */
export type NotificationPriority = 'normal' | 'high';

/** Push notification received via WebSocket. */
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  action_url?: string;
  is_read?: boolean;
  created_at: number;
  received_at?: number;
}

/** Discriminated union of all possible WebSocket push messages. */
export type PushMessage =
  | { type: 'notification'; data: PushNotification }
  | { type: 'ping' };
