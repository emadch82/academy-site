'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface DiscountCode {
  code: string;
  percent: number;
  maxDiscount: number;
  minAmount: number;
  active: boolean;
}

const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'نجمایی۱۰', percent: 10, maxDiscount: 200000, minAmount: 500000, active: true },
  { code: 'خوش‌آمدید', percent: 15, maxDiscount: 300000, minAmount: 1000000, active: true },
  { code: 'دانشجو۵', percent: 5, maxDiscount: 100000, minAmount: 200000, active: true },
  { code: 'تخفیف ویژه', percent: 20, maxDiscount: 500000, minAmount: 2000000, active: true },
];

interface DiscountContextType {
  applyCode: (code: string, amount: number) => { valid: boolean; discount: number; message: string };
  validateCode: (code: string) => DiscountCode | null;
}

const DiscountContext = createContext<DiscountContextType | null>(null);

export function DiscountProvider({ children }: { children: ReactNode }) {
  const validateCode = (code: string): DiscountCode | null => {
    return DISCOUNT_CODES.find((dc) => dc.code === code && dc.active) || null;
  };

  const applyCode = (code: string, amount: number) => {
    const dc = validateCode(code);
    if (!dc) return { valid: false, discount: 0, message: 'کد تخفیف نامعتبر است' };
    if (amount < dc.minAmount) return { valid: false, discount: 0, message: `حداقل سبد خرید ${new Intl.NumberFormat('fa-IR').format(dc.minAmount)} تومان` };
    const discount = Math.min(Math.floor(amount * dc.percent / 100), dc.maxDiscount);
    return { valid: true, discount, message: `${dc.percent}% تخفیف اعمال شد` };
  };

  return (
    <DiscountContext.Provider value={{ applyCode, validateCode }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const ctx = useContext(DiscountContext);
  if (!ctx) throw new Error('useDiscount must be used within DiscountProvider');
  return ctx;
}
