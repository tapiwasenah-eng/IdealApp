import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type NotificationType = 'invite' | 'share' | 'comment' | 'dataroom_view' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        get unreadCount() {
          return get().notifications.filter(n => !n.read).length;
        },
        addNotification: (notif) => set(state => ({
          notifications: [{
            ...notif,
            id: Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            read: false,
          }, ...state.notifications].slice(0, 100),
        })),
        markAsRead: (id) => set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        })),
        markAllRead: () => set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
        })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      { name: 'notifications' }
    ),
    { name: 'notification-store' }
  )
);
