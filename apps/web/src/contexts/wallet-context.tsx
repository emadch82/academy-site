'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Transaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number, description?: string) => void;
  deduct: (amount: number, description?: string) => boolean;
  refund: (amount: number, description?: string) => void;
  canAfford: (amount: number) => boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

function getStorageKey(): string {
  const token = Cookies.get('amz_access');
  return token ? `amz_wallet_${token.slice(-8)}` : 'amz_wallet_guest';
}

function generateId(): string {
  return `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WalletData>({ balance: 0, transactions: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newData: WalletData) => {
    setData(newData);
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(newData));
    } catch {}
  };

  const deposit = (amount: number, description?: string) => {
    const tx: Transaction = {
      id: generateId(),
      type: 'deposit',
      amount,
      description: description || `شارژ کیف پول`,
      date: new Date().toLocaleDateString('fa-IR'),
    };
    save({ balance: data.balance + amount, transactions: [tx, ...data.transactions] });
  };

  const deduct = (amount: number, description?: string): boolean => {
    if (data.balance < amount) return false;
    const tx: Transaction = {
      id: generateId(),
      type: 'purchase',
      amount: -amount,
      description: description || 'خرید از فروشگاه',
      date: new Date().toLocaleDateString('fa-IR'),
    };
    save({ balance: data.balance - amount, transactions: [tx, ...data.transactions] });
    return true;
  };

  const refund = (amount: number, description?: string) => {
    const tx: Transaction = {
      id: generateId(),
      type: 'refund',
      amount,
      description: description || 'بازپرداخت',
      date: new Date().toLocaleDateString('fa-IR'),
    };
    save({ balance: data.balance + amount, transactions: [tx, ...data.transactions] });
  };

  const canAfford = (amount: number) => data.balance >= amount;

  return (
    <WalletContext.Provider value={{ balance: data.balance, transactions: data.transactions, deposit, deduct, refund, canAfford }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
