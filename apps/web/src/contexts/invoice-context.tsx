'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import Cookies from 'js-cookie';

export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  items: { title: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  nationalCode?: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date' | 'status'>) => Invoice;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

function getStorageKey(): string {
  const token = Cookies.get('amz_access');
  return token ? `amz_invoices_${token.slice(-8)}` : 'amz_invoices_guest';
}

function generateId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) setInvoices(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(newInvoices));
    } catch {}
  };

  const addInvoice = (data: Omit<Invoice, 'id' | 'date' | 'status'>): Invoice => {
    const invoice: Invoice = {
      ...data,
      id: generateId(),
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'paid',
    };
    const updated = [invoice, ...invoices];
    save(updated);
    return invoice;
  };

  const getInvoice = (id: string) => invoices.find((inv) => inv.id === id);

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, getInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider');
  return ctx;
}
