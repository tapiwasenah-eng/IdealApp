import { create } from 'zustand';

export interface AINotification {
  id: string;
  source: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'alert';
  cta?: {
    label: string;
    action: string;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationsStore {
  notifications: AINotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AINotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [
    // Mocked initial intelligent alerts
    {
      id: '1',
      source: 'Data Room',
      message: 'Sequoia Capital just opened your Seed Data Room.',
      severity: 'info',
      cta: { label: 'View Analytics', action: '/dashboard/data-room' },
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      source: 'AI Assistant',
      message: 'Your SaaS Pitch Deck hasn\'t been updated in 10 days. Consider refreshing metrics before sending to new investors.',
      severity: 'warning',
      cta: { label: 'Go to Pitch Deck', action: '/documents/101' },
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: '3',
      source: 'Investor Match',
      message: '3 new matches found for your current stage and sector.',
      severity: 'success',
      cta: { label: 'View Matches', action: '/dashboard/investors' },
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    }
  ],
  unreadCount: 3,
  addNotification: (notification) => set((state) => {
    // TODO: Connect this method to real push events (e.g., Webhooks, Cron Jobs, Analytics events)
    const newNotif = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString()
    };
    return {
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    };
  }),
  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  }))
}));
