'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, initializeDB, type Notification as StoreNotification } from '@/lib/store';

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
  refreshFromDb: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadFromDb = () => {
    try {
      initializeDB();
      const allSent = db.getNotifications().filter((n: StoreNotification) => n.status === 'sent');
      const UNWANTED = ['یادآوری پرداخت اقساط', 'یادآوری کلاس React فردا', 'اعلام نتایج آزمون HTML'];
      const today = new Date().toLocaleDateString('fa-IR');
      allSent.forEach((n) => {
        if (UNWANTED.some((u) => n.title.includes(u) || n.message.includes(u))) {
          db.deleteNotification(n.id);
        } else {
          const newTitle = n.title.replace('پاییز', 'تابستان');
          const newMessage = n.message.replace('پاییز', 'تابستان');
          db.updateNotification(n.id, { title: newTitle, message: newMessage, date: today } as any);
        }
      });
      const filtered = db.getNotifications().filter((n: StoreNotification) => n.status === 'sent');
      const mapped: Notification[] = filtered.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: false,
        date: n.date,
        link: n.target === 'course' ? '/courses' : undefined,
      }));
      setNotifications(mapped);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadFromDb();
  }, []);

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

  const refreshFromDb = () => loadFromDb();

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll, refreshFromDb }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
