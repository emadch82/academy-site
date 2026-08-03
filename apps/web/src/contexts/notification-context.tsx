'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { db, initializeDB, type Notification as StoreNotification } from '@/lib/store';

const READ_KEY = 'vira_notifications_read';
const SHOWN_KEY = 'vira_notifications_shown';

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
  requestPermission: () => void;
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

function getShownIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SHOWN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveShownIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHOWN_KEY, JSON.stringify([...ids]));
}

function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = document.cookie.match(/amz_user=([^;]+)/);
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw[1]));
    return parsed.id || null;
  } catch {
    return null;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadFromDb = useCallback(() => {
    try {
      initializeDB();
      const currentUserId = getCurrentUserId();
      const allSent = db
        .getNotifications()
        .filter((n: StoreNotification) => n.status === 'sent')
        .filter((n: StoreNotification) => n.target === 'all' || (n.recipientId && n.recipientId === currentUserId))
        .sort((a, b) => (b.date > a.date ? 1 : -1));
      const readIds = getReadIds();
      const shownIds = getShownIds();
      const mapped: Notification[] = allSent.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: readIds.has(n.id),
        date: n.date,
        link: n.link || (n.target === 'course' ? '/courses' : n.link),
      }));
      setNotifications(mapped);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        const fresh = allSent.filter((n) => !shownIds.has(n.id) && n.recipientId === currentUserId);
        if (fresh.length > 0 && window.Notification.permission === 'granted') {
          fresh.forEach((n) => {
            new window.Notification(n.title, { body: n.message, tag: n.id });
          });
        }
        const newShown = getShownIds();
        allSent.forEach((n) => newShown.add(n.id));
        saveShownIds(newShown);
      }
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadFromDb();
    const interval = setInterval(loadFromDb, 15000);
    window.addEventListener('focus', loadFromDb);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', loadFromDb);
    };
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

  const requestPermission = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll, refreshFromDb, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
