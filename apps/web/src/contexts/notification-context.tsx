'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'دوره جدید اضافه شد', message: 'دوره جامع هوش مصنوعی به لیست دوره‌ها اضافه شد.', type: 'info', read: false, date: '۱۴۰۵/۰۳/۱۵', link: '/courses/ai-2025' },
  { id: 'n2', title: 'تخفیف ویژه', message: 'کد تخفیف «خوش‌آمدید» با ۱۵٪ تخفیف فعال شد.', type: 'success', read: false, date: '۱۴۰۵/۰۳/۱۴' },
  { id: 'n3', title: 'یادآوری پرداخت', message: 'مهلت پرداخت قسط دوم شما رو به اتمام است.', type: 'warning', read: true, date: '۱۴۰۵/۰۳/۱۰' },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'date'>) => {
    const newNotif: Notification = {
      ...n,
      id: `n_${Date.now()}`,
      read: false,
      date: new Date().toLocaleDateString('fa-IR'),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
