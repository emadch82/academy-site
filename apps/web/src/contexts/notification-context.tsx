'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { db, initializeDB, type Notification as StoreNotification } from '@/lib/store';

const READ_KEY = 'vira_notifications_read';

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

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadFromDb = useCallback(() => {
    try {
      initializeDB();
      const allSent = db.getNotifications().filter((n: StoreNotification) => n.status === 'sent');
      const readIds = getReadIds();
      const mapped: Notification[] = allSent.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: readIds.has(n.id),
        date: n.date,
        link: n.target === 'course' ? '/courses' : undefined,
      }));
      setNotifications(mapped);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read' | 'date'>) => {
    const newNotif: Notification = {
      ...n,
      id: `n_${Date.now()}`,
      read: false,
      date: new Date().toLocaleDateString('fa-IR'),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const readIds = getReadIds();
    readIds.add(id);
    saveReadIds(readIds);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const readIds = getReadIds();
    notifications.forEach((n) => readIds.add(n.id));
    saveReadIds(readIds);
  }, [notifications]);

  const clearAll = useCallback(() => setNotifications([]), []);

  const refreshFromDb = useCallback(() => loadFromDb(), [loadFromDb]);

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
