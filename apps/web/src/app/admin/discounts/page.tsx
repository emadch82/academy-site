'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit3, FiTrash2, FiPlus, FiTag, FiPercent, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

interface Discount {
  id: string;
  code: string;
  percent: number;
  maxDiscount: number;
  minAmount: number;
  usedCount: number;
  status: 'active' | 'inactive';
  expires: string;
}

const EMPTY_FORM = {
  code: '',
  percent: 10,
  maxDiscount: 200000,
  minAmount: 0,
  status: 'active' as 'active' | 'inactive',
  expires: '',
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadDiscounts = () => {
    const data = db.getCollection<Discount>('discounts');
    setDiscounts(data);
  };

  useEffect(() => {
    initializeDB();
    loadDiscounts();
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = discounts.filter((d) => d.code.includes(search));
  const totalUsed = discounts.reduce((a, d) => a + d.usedCount, 0);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (d: Discount) => {
    setEditingId(d.id);
    setForm({
      code: d.code,
      percent: d.percent,
      maxDiscount: d.maxDiscount,
      minAmount: d.minAmount,
      status: d.status,
      expires: d.expires,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.code.trim()) {
      toast.error('کد تخفیف را وارد کنید');
      return;
    }
    if (form.percent <= 0 || form.percent > 100) {
      toast.error('درصد تخفیف باید بین ۱ تا ۱۰۰ باشد');
      return;
    }

    const current = db.getCollection<Discount>('discounts');

    if (editingId) {
      const updated = current.map((d) =>
        d.id === editingId ? { ...d, ...form } : d
      );
      db.setCollection('discounts', updated);
      toast.success('تخفیف با موفقیت ویرایش شد');
    } else {
      const newDiscount: Discount = {
        id: `d_${Date.now()}`,
        ...form,
        usedCount: 0,
      };
      db.setCollection('discounts', [...current, newDiscount]);
      toast.success('تخفیف با موفقیت اضافه شد');
    }

    closeModal();
    loadDiscounts();
  };

  const handleDelete = (id: string, code: string) => {
    if (!window.confirm(`آیا از حذف کد تخفیف "${code}" مطمئن هستید؟`)) return;

    const current = db.getCollection<Discount>('discounts');
    db.setCollection('discounts', current.filter((d) => d.id !== id));
    toast.success('تخفیف حذف شد');
    loadDiscounts();
  };

  const handleToggleStatus = (id: string) => {
    const current = db.getCollection<Discount>('discounts');
    const updated = current.map((d) =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    );
    db.setCollection('discounts', updated);
    toast.success('وضعیت تخفیف تغییر کرد');
    loadDiscounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت کدهای تخفیف</h1>
        <button type="button" onClick={openAddModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
          <FiPlus className="h-4 w-4" /> کد جدید
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'کل کدها', value: discounts.length.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiTag },
          { label: 'فعال', value: discounts.filter((d) => d.status === 'active').length.toString(), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiPercent },
          { label: 'غیرفعال', value: discounts.filter((d) => d.status === 'inactive').length.toString(), color: 'text-red-500', bg: 'bg-red-500/10', icon: FiCalendar },
          { label: 'کل استفاده‌ها', value: totalUsed.toString(), color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiTag },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-background rounded-xl border p-4">
        <div className="relative max-w-sm">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 rounded-lg border bg-background pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="جستجوی کد..." />
        </div>
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-right text-sm font-medium px-6 py-3">کد</th>
                <th className="text-right text-sm font-medium px-6 py-3">درصد تخفیف</th>
                <th className="text-right text-sm font-medium px-6 py-3">حداکثر</th>
                <th className="text-right text-sm font-medium px-6 py-3">حداقل سبد</th>
                <th className="text-right text-sm font-medium px-6 py-3">استفاده شده</th>
                <th className="text-right text-sm font-medium px-6 py-3">انقضا</th>
                <th className="text-right text-sm font-medium px-6 py-3">وضعیت</th>
                <th className="text-right text-sm font-medium px-6 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-6 py-4"><code className="bg-muted px-2 py-1 rounded text-sm font-mono">{d.code}</code></td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">{d.percent}%</td>
                  <td className="px-6 py-4 text-sm">{new Intl.NumberFormat('fa-IR').format(d.maxDiscount)}</td>
                  <td className="px-6 py-4 text-sm">{new Intl.NumberFormat('fa-IR').format(d.minAmount)}</td>
                  <td className="px-6 py-4 text-sm">{d.usedCount}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{d.expires}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(d.id)}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-all ${d.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      {d.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEditModal(d)} className="p-1.5 rounded-lg hover:bg-muted"><FiEdit3 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => handleDelete(d.id, d.code)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground text-sm">هیچ کد تخفیفی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-xl border p-6 w-full max-w-md mx-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{editingId ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید'}</h2>
                <button type="button" onClick={closeModal} className="p-1 rounded-lg hover:bg-muted"><FiX className="h-5 w-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">کد تخفیف</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="مثال: نوروز۱۴۰۵"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">درصد تخفیف</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={form.percent}
                      onChange={(e) => setForm({ ...form, percent: Number(e.target.value) })}
                      className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">حداکثر تخفیف (تومان)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                      className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">حداقل سبد خرید (تومان)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.minAmount}
                      onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })}
                      className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">تاریخ انقضا</label>
                    <input
                      type="text"
                      value={form.expires}
                      onChange={(e) => setForm({ ...form, expires: e.target.value })}
                      className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="۱۴۰۵/۰۶/۳۱"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">وضعیت</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, status: 'active' })}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm border transition-all ${form.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'border-muted hover:bg-muted/50'}`}
                    >
                      <FiCheck className="h-4 w-4" /> فعال
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, status: 'inactive' })}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm border transition-all ${form.status === 'inactive' ? 'bg-muted text-muted-foreground border-border' : 'border-muted hover:bg-muted/50'}`}
                    >
                      <FiX className="h-4 w-4" /> غیرفعال
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleSave} className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                  {editingId ? 'ذخیره تغییرات' : 'افزودن تخفیف'}
                </button>
                <button type="button" onClick={closeModal} className="px-4 h-10 rounded-lg border text-sm font-medium hover:bg-muted/50 transition-all">
                  انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
