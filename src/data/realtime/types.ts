export type NotificationCategory = 'task' | 'agent' | 'system';
export type NotificationPriority = 'normal' | 'high';

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

export type PushMessage =
  | { type: 'notification'; data: PushNotification }
  | { type: 'ping' };
