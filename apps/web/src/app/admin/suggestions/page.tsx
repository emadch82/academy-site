'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiPlus, FiCheckCircle, FiClock, FiXCircle, FiThumbsUp, FiX, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof FiClock }> = {
  pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
  accepted: { label: 'پذیرفته شده', color: 'bg-green-100 text-green-700', icon: FiCheckCircle },
  rejected: { label: 'رد شده', color: 'bg-red-100 text-red-700', icon: FiXCircle },
};

const EMPTY_FORM = { title: '', description: '', author: '' };

export default function SuggestionsAdminPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    initializeDB();
    loadSuggestions();
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const loadSuggestions = () => {
    const data = db.getCollection<Suggestion>('suggestions');
    setSuggestions(data);
  };

  const filtered = suggestions.filter((s) => {
    const matchesSearch = s.title.includes(search) || s.author.includes(search);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: suggestions.length,
    pending: suggestions.filter((s) => s.status === 'pending').length,
    accepted: suggestions.filter((s) => s.status === 'accepted').length,
    rejected: suggestions.filter((s) => s.status === 'rejected').length,
    totalVotes: suggestions.reduce((a, s) => a + s.votes, 0),
  };

  const updateStatus = (id: string, newStatus: 'accepted' | 'rejected') => {
    const current = db.getCollection<Suggestion>('suggestions');
    const updated = current.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    db.setCollection('suggestions', updated);
    toast.success(newStatus === 'accepted' ? 'پیشنهاد پذیرفته شد' : 'پیشنهاد رد شد');
    loadSuggestions();
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`آیا از حذف پیشنهاد "${title}" مطمئن هستید؟`)) return;
    const current = db.getCollection<Suggestion>('suggestions');
    db.setCollection('suggestions', current.filter((s) => s.id !== id));
    toast.success('پیشنهاد حذف شد');
    loadSuggestions();
  };

  const handleVote = (id: string, delta: number) => {
    const current = db.getCollection<Suggestion>('suggestions');
    const updated = current.map((s) =>
      s.id === id ? { ...s, votes: Math.max(0, s.votes + delta) } : s
    );
    db.setCollection('suggestions', updated);
    loadSuggestions();
  };

  const handleAdd = () => {
    if (!form.title.trim()) {
      toast.error('عنوان را وارد کنید');
      return;
    }
    if (!form.author.trim()) {
      toast.error('نام نویسنده را وارد کنید');
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    const newSuggestion: Suggestion = {
      id: `s_${Date.now()}`,
      title: form.title,
      description: form.description,
      author: form.author,
      date: dateStr,
      votes: 0,
      status: 'pending',
    };

    const current = db.getCollection<Suggestion>('suggestions');
    db.setCollection('suggestions', [...current, newSuggestion]);
    toast.success('پیشنهاد با موفقیت اضافه شد');
    setShowModal(false);
    setForm(EMPTY_FORM);
    loadSuggestions();
  };

  const filterLabel = statusFilter === 'all' ? 'همه وضعیت‌ها' : STATUS_MAP[statusFilter]?.label || statusFilter;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت پیشنهادات</h1>
        <button type="button" onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
          <FiPlus className="h-4 w-4" /> پیشنهاد جدید
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {[
          { label: 'کل', value: stats.total.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiThumbsUp },
          { label: 'در انتظار', value: stats.pending.toString(), color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: FiClock },
          { label: 'پذیرفته', value: stats.accepted.toString(), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiCheckCircle },
          { label: 'رد شده', value: stats.rejected.toString(), color: 'text-red-500', bg: 'bg-red-500/10', icon: FiXCircle },
          { label: 'کل رأی‌ها', value: stats.totalVotes.toString(), color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiThumbsUp },
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-lg border bg-background pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="جستجو بر اساس عنوان یا نویسنده..."
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 h-10 px-4 rounded-lg border bg-background text-sm hover:bg-muted/50 transition-all"
            >
              {filterLabel}
              <FiChevronDown className="h-4 w-4" />
            </button>
            {showFilter && (
              <div className="absolute top-full mt-1 left-0 bg-background border rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                {[{ value: 'all', label: 'همه وضعیت‌ها' }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ value: k, label: v.label }))].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setStatusFilter(opt.value); setShowFilter(false); }}
                    className={`w-full text-right px-4 py-2 text-sm hover:bg-muted/50 transition-all ${statusFilter === opt.value ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((s, i) => {
          const st = STATUS_MAP[s.status];
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-xl border p-5">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button type="button" onClick={() => handleVote(s.id, 1)} className="p-1 rounded hover:bg-muted/50 text-green-600 transition-all">
                    <FiChevronDown className="h-4 w-4 rotate-180" />
                  </button>
                  <FiThumbsUp className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">{s.votes}</span>
                  <button type="button" onClick={() => handleVote(s.id, -1)} className="p-1 rounded hover:bg-muted/50 text-red-600 transition-all">
                    <FiChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{s.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{s.date}</span>
                    <span>{s.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'accepted')}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-all"
                      >
                        پذیرش
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-all"
                      >
                        رد
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id, s.title)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-all"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-background rounded-xl border p-8 text-center text-muted-foreground text-sm">
            هیچ پیشنهادی یافت نشد
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-xl border p-6 w-full max-w-md mx-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">افزودن پیشنهاد جدید</h2>
                <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted"><FiX className="h-5 w-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="عنوان پیشنهاد..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full h-24 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="توضیحات پیشنهاد..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">نویسنده</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="نام نویسنده..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleAdd} className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                  افزودن پیشنهاد
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 h-10 rounded-lg border text-sm font-medium hover:bg-muted/50 transition-all">
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
