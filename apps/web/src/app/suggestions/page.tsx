'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiZap, FiSend, FiCheckCircle, FiThumbsUp, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  status: 'pending' | 'reviewing' | 'accepted' | 'implemented';
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: 's1', title: 'دوره هوش مصنوعی پیشرفته', description: 'پیشنهاد برگزاری دوره هوش مصنوعی سطح پیشرفته با تمرکز بر GPT و LLM', author: 'امیر محمدی', date: '۱۴۰۵/۰۳/۱۰', votes: 25, status: 'implemented' },
  { id: 's2', title: 'کلاس شبانه', description: 'برگزاری کلاس‌ها در ساعات عصر و شب برای شاغلین', author: 'سارا رضایی', date: '۱۴۰۵/۰۳/۰۸', votes: 18, status: 'accepted' },
  { id: 's3', title: 'آزمون آنلاین', description: 'سیستم آزمون آنلاین برای ارزیابی دانشجویان', author: 'رضا حسینی', date: '۱۴۰۵/۰۳/۰۵', votes: 32, status: 'implemented' },
  { id: 's4', title: 'گواهینامه دیجیتال', description: 'صدور گواهینامه دیجیتال برای دوره‌های تکمیل شده', author: 'نیلوفر احمدی', date: '۱۴۰۵/۰۳/۰۱', votes: 15, status: 'reviewing' },
];

const STATUS_MAP = {
  pending: { label: 'در انتظار بررسی', color: 'bg-yellow-100 text-yellow-700' },
  reviewing: { label: 'در حال بررسی', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'پذیرفته شده', color: 'bg-green-100 text-green-700' },
  implemented: { label: 'اجرا شده', color: 'bg-purple-100 text-purple-700' },
};

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('لطفاً عنوان و توضیحات را وارد کنید');
      return;
    }
    const newSuggestion: Suggestion = {
      id: `s_${Date.now()}`,
      title: form.title,
      description: form.description,
      author: 'کاربر',
      date: new Date().toLocaleDateString('fa-IR'),
      votes: 1,
      status: 'pending',
    };
    setSuggestions([newSuggestion, ...suggestions]);
    setForm({ title: '', description: '' });
    setShowForm(false);
    toast.success('پیشنهاد شما ثبت شد!');
  };

  const handleVote = (id: string) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)));
    toast.success('نظر شما ثبت شد');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowLeft className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">نظام پیشنهادات</h1>
                <p className="text-muted-foreground mt-2">پیشنهادات خود را برای بهبود آموزشگاه ارسال کنید</p>
              </div>
              <button type="button" onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                <FiZap className="h-5 w-5" />
                پیشنهاد جدید
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {showForm && (
          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-background rounded-2xl border p-6 space-y-4">
            <h3 className="font-bold">پیشنهاد جدید</h3>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="عنوان پیشنهاد" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none" placeholder="توضیحات پیشنهاد..." />
            <div className="flex gap-2">
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2"><FiSend className="h-4 w-4" /> ارسال</button>
              <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors">انصراف</button>
            </div>
          </motion.form>
        )}

        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-2xl border p-6">
              <div className="flex items-start gap-4">
                <button type="button" onClick={() => handleVote(s.id)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors shrink-0">
                  <FiThumbsUp className="h-5 w-5" />
                  <span className="text-sm font-bold">{s.votes}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{s.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[s.status].color}`}>{STATUS_MAP[s.status].label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FiClock className="h-3 w-3" />{s.date}</span>
                    <span>{s.author}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
