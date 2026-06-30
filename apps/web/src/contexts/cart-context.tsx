'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Course } from '@/lib/courses-data';

export interface CartItem {
  course: Course;
  addedAt: Date;
}

export interface PurchasedCourse {
  course: Course;
  purchasedAt: Date;
  orderId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (course: Course) => boolean;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  totalItems: number;
  totalPrice: number;
  purchased: PurchasedCourse[];
  addPurchased: (courses: Course[], orderId: string) => void;
  isPurchased: (courseId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [purchased, setPurchased] = useState<PurchasedCourse[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.map((item: CartItem) => ({ ...item, addedAt: new Date(item.addedAt) })));
      } catch {}
    }
    const savedPurchased = localStorage.getItem('purchased');
    if (savedPurchased) {
      try {
        const parsed = JSON.parse(savedPurchased);
        setPurchased(parsed.map((item: PurchasedCourse) => ({ ...item, purchasedAt: new Date(item.purchasedAt) })));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('purchased', JSON.stringify(purchased));
  }, [purchased]);

  const addItem = useCallback((course: Course): boolean => {
    let added = false;
    setItems((prev) => {
      if (prev.some((item) => item.course.id === course.id)) return prev;
      added = true;
      return [...prev, { course, addedAt: new Date() }];
    });
    return added;
  }, []);

  const removeItem = useCallback((courseId: string) => {
    setItems((prev) => prev.filter((item) => item.course.id !== courseId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (courseId: string) => items.some((item) => item.course.id === courseId),
    [items]
  );

  const addPurchased = useCallback((courses: Course[], orderId: string) => {
    setPurchased((prev) => {
      const newItems = courses
        .filter((c) => !prev.some((p) => p.course.id === c.id))
        .map((course) => ({ course, purchasedAt: new Date(), orderId }));
      return [...prev, ...newItems];
    });
  }, []);

  const isPurchased = useCallback(
    (courseId: string) => purchased.some((item) => item.course.id === courseId),
    [purchased]
  );

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.course.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, isInCart, totalItems, totalPrice, purchased, addPurchased, isPurchased }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
