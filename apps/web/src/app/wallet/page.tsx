'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiPlus, FiArrowUp, FiArrowDown, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useWallet } from '@/contexts/wallet-context';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export default function WalletPage() {
  const { balance, transactions, deposit } = useWallet();
  const [customAmount, setCustomAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);

  const handleDeposit = (amount: number) => {
    deposit(amount);
    setCustomAmount('');
    setShowDeposit(false);
  };

  const formatPrice = (n: number) => new Intl.NumberFormat('fa-IR').format(Math.abs(n));

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowLeft className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold">کیف پول</h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">موجودی کیف پول</span>
            <FiDollarSign className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{formatPrice(balance)} تومان</p>
          <button type="button" onClick={() => setShowDeposit(true)} className="mt-4 bg-white/20 hover:bg-white/30 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FiPlus className="h-4 w-4" /> شارژ کیف پول
          </button>
        </motion.div>

        {showDeposit && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-background rounded-2xl border p-6 space-y-4">
            <h3 className="font-bold">انتخاب مبلغ شارژ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_AMOUNTS.map((amt) => (
                <button key={amt} onClick={() => handleDeposit(amt)} className="border rounded-xl py-3 px-4 hover:bg-primary hover:text-primary-foreground transition-all text-center">
                  <p className="font-bold">{formatPrice(amt)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="مبلغ دلخواه (تومان)" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="flex-1 border rounded-xl px-4 py-3 text-sm" />
              <button type="button" onClick={() => customAmount && handleDeposit(Number(customAmount))} disabled={!customAmount || Number(customAmount) <= 0} className="bg-primary text-primary-foreground px-6 rounded-xl text-sm font-medium disabled:opacity-50">شارژ</button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-background rounded-2xl border p-6 space-y-4">
          <h3 className="font-bold">تاریخچه تراکنش‌ها</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">هنوز تراکنشی ثبت نشده</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' || tx.type === 'refund' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'deposit' ? <FiArrowDown className="h-5 w-5" /> : <FiArrowUp className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : '-'}{formatPrice(tx.amount)} تومان
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
