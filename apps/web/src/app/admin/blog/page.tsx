'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiEye,
  FiClock,
  FiX,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type BlogPost } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const EMPTY_FORM = { title: '', excerpt: '', category: '', author: '', status: 'draft' as 'published' | 'draft' };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  useEffect(() => {
    initializeDB();
    setPosts(db.getBlogPosts());
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const reload = () => setPosts(db.getBlogPosts());

  const filtered = posts.filter(
    (p) => p.title.includes(search) || p.category.includes(search)
  );

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({ title: post.title, excerpt: post.excerpt, category: post.category, author: post.author, status: post.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error('عنوان الزامی است');
      return;
    }
    if (!form.author.trim()) {
      toast.error('نویسنده الزامی است');
      return;
    }
    if (editingId) {
      db.updateBlogPost(editingId, form);
      toast.success('مقاله ویرایش شد');
    } else {
      db.addBlogPost({ ...form, date: new Date().toLocaleDateString('fa-IR') });
      toast.success('مقاله جدید اضافه شد');
    }
    reload();
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    db.deleteBlogPost(deleteTarget.id);
    toast.success('مقاله حذف شد');
    reload();
    setDeleteTarget(null);
  };

  const handleToggle = (id: string) => {
    db.toggleBlogPostStatus(id);
    reload();
    toast.success('وضعیت مقاله تغییر کرد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت بلاگ</h1>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
          <FiPlus className="h-4 w-4" /> مقاله جدید
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'کل مقالات', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiFileText },
          { label: 'منتشر شده', value: stats.published, color: 'text-green-500', bg: 'bg-green-500/10', icon: FiEye },
          { label: 'پیش‌نویس', value: stats.draft, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: FiClock },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 rounded-lg border bg-background pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="جستجو بر اساس عنوان یا دسته‌بندی..." />
        </div>
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-right text-sm font-medium px-6 py-3">عنوان</th>
                <th className="text-right text-sm font-medium px-6 py-3">نویسنده</th>
                <th className="text-right text-sm font-medium px-6 py-3">دسته‌بندی</th>
                <th className="text-right text-sm font-medium px-6 py-3">تاریخ</th>
                <th className="text-right text-sm font-medium px-6 py-3">وضعیت</th>
                <th className="text-right text-sm font-medium px-6 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.author}</td>
                  <td className="px-6 py-4"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{p.category}</span></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-1"><FiClock className="h-3 w-3" />{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleToggle(p.id)} className="p-1.5 rounded-lg hover:bg-muted" title={p.status === 'published' ? 'پیش‌نویس کردن' : 'انتشار'}>
                        {p.status === 'published' ? <FiToggleRight className="h-4 w-4 text-green-500" /> : <FiToggleLeft className="h-4 w-4 text-yellow-500" />}
                      </button>
                      <button type="button" onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted"><FiEdit3 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FiFileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">مقاله‌ای یافت نشد</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-background rounded-2xl border p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{editingId ? 'ویرایش مقاله' : 'مقاله جدید'}</h2>
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(EMPTY_FORM); }} className="p-1 hover:bg-muted rounded-lg"><FiX className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="عنوان مقاله" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">خلاصه</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="خلاصه مقاله" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                    <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="دسته‌بندی" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">نویسنده *</label>
                    <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="نام نویسنده" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">وضعیت</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="published">منتشر شده</option>
                    <option value="draft">پیش‌نویس</option>
                  </select>
                </div>
                <button type="button" onClick={handleSave} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                  <FiSave className="h-4 w-4" />
                  {editingId ? 'ذخیره تغییرات' : 'ذخیره مقاله'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-background rounded-2xl border p-6 w-full max-w-sm mx-4">
              <div className="text-center">
                <FiTrash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">حذف مقاله</h3>
                <p className="text-sm text-muted-foreground mb-6">آیا از حذف &quot;{deleteTarget.title}&quot; مطمئن هستید؟</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors">انصراف</button>
                  <button type="button" onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">حذف</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
