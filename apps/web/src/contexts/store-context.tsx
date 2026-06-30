'use client';

import { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { db, initializeDB, type User, type Course, type Enrollment, type Transaction, type Notification } from '@/lib/store';

interface StoreContextValue {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  transactions: Transaction[];
  notifications: Notification[];

  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => User | null;
  deleteUser: (id: string) => boolean;
  changeUserRole: (id: string, role: User['role']) => User | null;

  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => Course | null;
  deleteCourse: (id: string) => boolean;

  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => Enrollment;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => Notification;

  getCourseById: (id: string) => Course | undefined;
  getUserById: (id: string) => User | undefined;
  refresh: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeDB();
  }, []);

  const refresh = useCallback(() => {
    // Force re-render by toggling a hidden state (we rely on direct reads instead)
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    get users() { return db.getUsers(); },
    get courses() { return db.getCourses(); },
    get enrollments() { return db.getEnrollments(); },
    get transactions() { return db.getTransactions(); },
    get notifications() { return db.getNotifications(); },

    addUser: (user) => db.addUser(user),
    updateUser: (id, updates) => db.updateUser(id, updates),
    deleteUser: (id) => db.deleteUser(id),
    changeUserRole: (id, role) => db.changeUserRole(id, role),

    addCourse: (course) => db.addCourse(course),
    updateCourse: (id, updates) => db.updateCourse(id, updates),
    deleteCourse: (id) => db.deleteCourse(id),

    addEnrollment: (enrollment) => db.addEnrollment(enrollment),
    addTransaction: (tx) => db.addTransaction(tx),
    addNotification: (n) => db.addNotification(n),

    getCourseById: (id) => db.getCourseById(id),
    getUserById: (id) => db.getUserById(id),
    refresh,
  }), [refresh]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
