'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, initializeDB } from '@/lib/store';

interface DiscountCode {
  code: string;
  percent: number;
  maxDiscount: number;
  minAmount: number;
  active: boolean;
}

interface DiscountContextType {
  applyCode: (code: string, amount: number) => { valid: boolean; discount: number; message: string };
  validateCode: (code: string) => DiscountCode | null;
  refreshDiscounts: () => void;
}

const DiscountContext = createContext<DiscountContextType | null>(null);

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = useState<DiscountCode[]>([]);

  const loadDiscounts = () => {
    try {
      initializeDB();
      const stored = db.getCollection<{ code: string; percent: number; maxDiscount: number; minAmount: number; status: string }>('discounts');
      const mapped: DiscountCode[] = stored.map((d) => ({
        code: d.code,
        percent: d.percent,
        maxDiscount: d.maxDiscount,
        minAmount: d.minAmount,
        active: d.status === 'active',
      }));
      setCodes(mapped);
    } catch {
      setCodes([]);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const validateCode = (code: string): DiscountCode | null => {
    return codes.find((dc) => dc.code === code && dc.active) || null;
  };

  const applyCode = (code: string, amount: number) => {
    const dc = validateCode(code);
    if (!dc) return { valid: false, discount: 0, message: 'کد تخفیف نامعتبر است' };
    if (amount < dc.minAmount) return { valid: false, discount: 0, message: `حداقل سبد خرید ${new Intl.NumberFormat('fa-IR').format(dc.minAmount)} تومان` };
    const discount = Math.min(Math.floor(amount * dc.percent / 100), dc.maxDiscount);
    return { valid: true, discount, message: `${dc.percent}% تخفیف اعمال شد` };
  };

  const refreshDiscounts = () => loadDiscounts();

  return (
    <DiscountContext.Provider value={{ applyCode, validateCode, refreshDiscounts }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const ctx = useContext(DiscountContext);
  if (!ctx) throw new Error('useDiscount must be used within DiscountProvider');
  return ctx;
}
