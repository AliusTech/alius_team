import { create } from 'zustand';
import type { PushNotification } from '@/data/realtime/types';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadNotificationCount,
} from '@/data/db/commands';

/** Push notification state — tracks notifications, unread count, and dialog visibility. */
export interface NotificationState {
  notifications: PushNotification[];
  unreadCount: number;
  isLoading: boolean;
  isLoaded: boolean;

  loadNotifications: () => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  onReceived: (n: PushNotification) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

/** Zustand store hook for managing notifications with local DB persistence. */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isLoaded: false,

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const [items, unread] = await Promise.all([
        getNotifications(100, 0, false),
        getUnreadNotificationCount(),
      ]);
      set({ notifications: items, unreadCount: unread, isLoading: false, isLoaded: true });
    } catch (error) {
      console.error('[notifications] failed to load:', error);
      set({ isLoading: false, isLoaded: true });
    }
  },

  loadUnreadCount: async () => {
    try {
      const unread = await getUnreadNotificationCount();
      set({ unreadCount: unread });
    } catch (error) {
      console.error('[notifications] failed to load unread count:', error);
    }
  },

  onReceived: (n) => {
    const existing = get().notifications;
    if (existing.some((item) => item.id === n.id)) return;
    set({
      notifications: [n, ...existing],
      unreadCount: get().unreadCount + 1,
    });
  },

  markRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error('[notifications] failed to mark read:', error);
      throw error;
    }
  },

  markAllRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error('[notifications] failed to mark all read:', error);
      throw error;
    }
  },

  remove: async (id) => {
    const target = get().notifications.find((n) => n.id === id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: target && !target.is_read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('[notifications] failed to delete:', error);
      throw error;
    }
  },

  clearAll: async () => {
    set({ notifications: [], unreadCount: 0 });
    try {
      await clearAllNotifications();
    } catch (error) {
      console.error('[notifications] failed to clear all:', error);
      throw error;
    }
  },
}));
