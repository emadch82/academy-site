'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiPlus,
  FiTrash2,
  FiX,
  FiSearch,
  FiFilter,
} from 'react-icons/fi';
import { db, initializeDB, type Transaction } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const STATUS_LABELS: Record<string, string> = {
  completed: 'تکمیل شده',
  pending: 'در انتظار',
  cancelled: 'لغو شده',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <FiCheckCircle className="h-3.5 w-3.5" />,
  pending: <FiClock className="h-3.5 w-3.5" />,
  cancelled: <FiXCircle className="h-3.5 w-3.5" />,
};

const PAYMENT_METHODS = ['آنلاین', 'کارت به کارت', 'نقدی', 'اقساطی'];

const SEED_TRANSACTIONS_DATA: Omit<Transaction, 'id'>[] = [
  { userId: 'u7', userName: 'علی محمدی', type: 'income', amount: 2500000, description: 'شهریه دوره هوش مصنوعی', date: '۱۴۰۴/۰۶/۱۵', status: 'completed', paymentMethod: 'آنلاین' },
  { userId: 'u8', userName: 'سارا احمدی', type: 'income', amount: 2000000, description: 'شهریه دوره React', date: '۱۴۰۴/۰۶/۱۰', status: 'completed', paymentMethod: 'کارت به کارت' },
  { userId: 'u9', userName: 'رضا حسینی', type: 'income', amount: 1500000, description: 'شهریه دوره زبان', date: '۱۴۰۴/۰۶/۰۵', status: 'completed', paymentMethod: 'نقدی' },
  { userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 500000, description: 'اجاره محل', date: '۱۴۰۴/۰۶/۰۱', status: 'completed', paymentMethod: 'نقدی' },
  { userId: 'u10', userName: 'نیلوفر احمدی', type: 'income', amount: 1800000, description: 'شهریه دوره رباتیک', date: '۱۴۰۴/۰۵/۲۰', status: 'completed', paymentMethod: 'آنلاین' },
  { userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 200000, description: 'تبلیغات اینستاگرام', date: '۱۴۰۴/۰۵/۱۵', status: 'completed', paymentMethod: 'کارت به کارت' },
  { userId: 'u12', userName: 'زهرا کریمی', type: 'income', amount: 2500000, description: 'شهریه دوره هوش مصنوعی', date: '۱۴۰۴/۰۵/۱۰', status: 'completed', paymentMethod: 'اقساطی' },
  { userId: 'u13', userName: 'امیر محمدی', type: 'income', amount: 1800000, description: 'شهریه دوره پایتون', date: '۱۴۰۴/۰۵/۰۵', status: 'completed', paymentMethod: 'آنلاین' },
  { userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 150000, description: 'لوازم التحریر', date: '۱۴۰۴/۰۴/۲۰', status: 'completed', paymentMethod: 'نقدی' },
  { userId: 'u15', userName: 'امین رستمی', type: 'income', amount: 1000000, description: 'شهریه دوره مدیریت پروژه', date: '۱۴۰۴/۰۴/۱۵', status: 'completed', paymentMethod: 'نقدی' },
  { userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 80000, description: 'هزینه اینترنت ماهانه', date: '۱۴۰۴/۰۴/۰۱', status: 'completed', paymentMethod: 'کارت به کارت' },
  { userId: 'u11', userName: 'علی رضایی', type: 'income', amount: 800000, description: 'شهریه دوره فن بیان', date: '۱۴۰۴/۰۳/۲۵', status: 'pending', paymentMethod: 'اقساطی' },
];

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newTx, setNewTx] = useState({
    userName: '',
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    status: 'completed' as 'completed' | 'pending' | 'cancelled',
    paymentMethod: 'آنلاین',
  });

  useEffect(() => {
    initializeDB();
    const loaded = db.getTransactions();
    if (loaded.length === 0) {
      SEED_TRANSACTIONS_DATA.forEach((tx) => db.addTransaction(tx));
      setTransactions(db.getTransactions());
    } else {
      setTransactions(loaded);
    }
  }, []);

  const refresh = () => setTransactions([...db.getTransactions()]);

  const hydrated = useHydrated();

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.trim();
      const matchSearch = !q || t.description.includes(q) || t.userName.includes(q);
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const formatPrice = (n: number) => n.toLocaleString('fa-IR');

  const toAsciiDigits = (s: string) =>
    s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

  const handleAdd = () => {
    if (!newTx.userName.trim() || !newTx.amount || !newTx.description.trim()) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    const amountNum = parseInt(toAsciiDigits(newTx.amount), 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('لطفاً مبلغ معتبر وارد کنید');
      return;
    }
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    db.addTransaction({
      userId: 'u0',
      userName: newTx.userName.trim(),
      type: newTx.type,
      amount: amountNum,
      description: newTx.description.trim(),
      date: dateStr,
      status: newTx.status,
      paymentMethod: newTx.paymentMethod,
    });

    toast.success('تراکنش جدید اضافه شد');
    setNewTx({ userName: '', type: 'income', amount: '', description: '', status: 'completed', paymentMethod: 'آنلاین' });
    setShowAddModal(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    db.deleteTransaction(id);
    toast.success('تراکنش حذف شد');
    setShowDeleteConfirm(null);
    refresh();
  };

  const handleExport = () => {
    const header = 'نام کاربر,نوع,مبلغ,توضیحات,وضعیت,روش پرداخت,تاریخ\n';
    const rows = filtered
      .map(
        (t) =>
          `${t.userName},${t.type === 'income' ? 'درآمد' : 'هزینه'},${t.amount},${t.description},${STATUS_LABELS[t.status]},${t.paymentMethod},${t.date}`
      )
      .join('\n');

    const csvContent = '\uFEFF' + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('فایل با موفقیت دانلود شد');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiDollarSign className="h-6 w-6 text-primary" />
          مدیریت مالی
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            تراکنش جدید
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
          >
            <FiDownload className="h-4 w-4" />
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FiTrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <FiArrowUp className="h-3 w-3" />
              درآمد
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatPrice(totalIncome)} تومان</p>
          <p className="text-sm text-muted-foreground mt-1">کل درآمدها</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background rounded-xl border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <FiTrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <FiArrowDown className="h-3 w-3" />
              هزینه
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatPrice(totalExpense)} تومان</p>
          <p className="text-sm text-muted-foreground mt-1">کل هزینه‌ها</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-xl border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiDollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              خالص
            </span>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netProfit >= 0 ? '+' : ''}{formatPrice(netProfit)} تومان
          </p>
          <p className="text-sm text-muted-foreground mt-1">سود خالص</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا توضیحات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pr-10 pl-8 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">همه انواع</option>
            <option value="income">درآمد</option>
            <option value="expense">هزینه</option>
          </select>
        </div>
        <div className="relative">
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pr-10 pl-8 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="completed">تکمیل شده</option>
            <option value="pending">در انتظار</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-background rounded-xl border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right px-4 py-3 font-medium">نام کاربر</th>
                <th className="text-right px-4 py-3 font-medium">تاریخ</th>
                <th className="text-right px-4 py-3 font-medium">نوع</th>
                <th className="text-right px-4 py-3 font-medium">مبلغ</th>
                <th className="text-right px-4 py-3 font-medium">روش پرداخت</th>
                <th className="text-right px-4 py-3 font-medium">توضیحات</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{t.userName}</td>
                  <td className="px-4 py-3 flex items-center gap-1 text-muted-foreground">
                    <FiCalendar className="h-4 w-4" />
                    <span>{t.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        t.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {t.type === 'income' ? (
                        <>
                          <FiArrowUp className="h-3 w-3" />
                          درآمد
                        </>
                      ) : (
                        <>
                          <FiArrowDown className="h-3 w-3" />
                          هزینه
                        </>
                      )}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatPrice(t.amount)} تومان
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1 text-muted-foreground">
                    <FiCreditCard className="h-4 w-4" />
                    <span>{t.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {t.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {STATUS_ICONS[t.status]}
                      {STATUS_LABELS[t.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setShowDeleteConfirm(t.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FiDollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">تراکنشی یافت نشد</p>
          </div>
        )}
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl border shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">افزودن تراکنش جدید</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نام کاربر *</label>
                  <input
                    type="text"
                    value={newTx.userName}
                    onChange={(e) => setNewTx({ ...newTx, userName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="نام کاربر را وارد کنید"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع تراکنش *</label>
                    <select
                      value={newTx.type}
                      onChange={(e) =>
                        setNewTx({ ...newTx, type: e.target.value as 'income' | 'expense' })
                      }
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="income">درآمد</option>
                      <option value="expense">هزینه</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">مبلغ (تومان) *</label>
                    <input
                      type="text"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="مبلغ را وارد کنید"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات *</label>
                  <input
                    type="text"
                    value={newTx.description}
                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="توضیحات تراکنش"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">وضعیت</label>
                    <select
                      value={newTx.status}
                      onChange={(e) =>
                        setNewTx({
                          ...newTx,
                          status: e.target.value as 'completed' | 'pending' | 'cancelled',
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="completed">تکمیل شده</option>
                      <option value="pending">در انتظار</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">روش پرداخت</label>
                    <select
                      value={newTx.paymentMethod}
                      onChange={(e) => setNewTx({ ...newTx, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  ذخیره
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl border shadow-xl w-full max-w-sm p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">حذف تراکنش</h3>
              <p className="text-sm text-muted-foreground mb-6">
                آیا از حذف این تراکنش مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
