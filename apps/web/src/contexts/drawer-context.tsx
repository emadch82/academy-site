'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DrawerContextType {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType>({ isCartOpen: false, setCartOpen: () => {} });

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setCartOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ isCartOpen, setCartOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(DrawerContext);
}
