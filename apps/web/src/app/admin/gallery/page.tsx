'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiTrash2,
  FiImage,
  FiEdit3,
  FiSearch,
  FiX,
  FiSave,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

const CATEGORIES = ['کلاس', 'اساتید', 'مراسم', 'محوطه'];

const SEED_GALLERY: GalleryImage[] = [
  { id: 'g1', title: 'کلاس زبان کودکان', category: 'کلاس', imageUrl: '/images/children.jpg' },
  { id: 'g2', title: 'کلاس زبان بزرگسالان', category: 'کلاس', imageUrl: '/images/adult.jpg' },
  { id: 'g3', title: 'کلاس مکالمه SPO', category: 'کلاس', imageUrl: '/images/conversation.jpg' },
  { id: 'g4', title: 'کلاس TTC', category: 'کلاس', imageUrl: '/images/ttc.jpg' },
  { id: 'g5', title: 'آزمون MOC (آیلتس)', category: 'کلاس', imageUrl: '/images/moc.jpg' },
  { id: 'g6', title: 'استاد نسیم خدابخش', category: 'اساتید', imageUrl: '/images/nasim.jpg' },
  { id: 'g7', title: 'استاد زهرا مردانی', category: 'اساتید', imageUrl: '/images/zahra.jpg' },
  { id: 'g8', title: 'مراسم افتتاحیه', category: 'مراسم', imageUrl: '/images/vira-slide1.jpg' },
  { id: 'g9', title: 'مراسم اختتامیه', category: 'مراسم', imageUrl: '/images/vira-slide2.jpg' },
  { id: 'g10', title: 'محوطه آموزشگاه', category: 'محوطه', imageUrl: '/images/vira-slide3.jpg' },
  { id: 'g11', title: 'لوگوی آموزشگاه', category: 'محوطه', imageUrl: '/images/vira-logo.jpg' },
  { id: 'g12', title: 'تیم آموزشی', category: 'اساتید', imageUrl: '/images/speech.jpg' },
  { id: 'g13', title: 'کلاس آنلاین', category: 'کلاس', imageUrl: '/images/online.jpg' },
  { id: 'g14', title: 'معرفی کتاب و فیلم', category: 'کلاس', imageUrl: '/images/book-movie.jpg' },
  { id: 'g15', title: 'مراسم جشن فارغ‌التحصیلی', category: 'مراسم', imageUrl: '/images/vira-news.jpg' },
];

const CATEGORY_COLORS: Record<string, string> = {
  کلاس: 'bg-blue-100 text-blue-700',
  اساتید: 'bg-green-100 text-green-700',
  مراسم: 'bg-purple-100 text-purple-700',
  محوطه: 'bg-amber-100 text-amber-700',
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('همه');
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({ title: '', category: 'کلاس', imageUrl: '/images/' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<GalleryImage | null>(null);

  useEffect(() => {
    initializeDB();
    const stored = db.getCollection<GalleryImage>('galleryImages');
    if (!stored || stored.length === 0) {
      db.setCollection('galleryImages', SEED_GALLERY);
      setImages(SEED_GALLERY);
    } else {
      setImages(stored);
    }
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const refreshImages = () => {
    setImages(db.getCollection<GalleryImage>('galleryImages'));
  };

  const filtered = images.filter((img) => {
    const matchesSearch = img.title.includes(search);
    const matchesCategory = categoryFilter === 'همه' || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingImage(null);
    setForm({ title: '', category: 'کلاس', imageUrl: '/images/' });
    setShowModal(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setForm({ title: img.title, category: img.category, imageUrl: img.imageUrl });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error('لطفاً عنوان تصویر را وارد کنید');
      return;
    }
    if (!form.imageUrl.trim()) {
      toast.error('لطفاً آدرس تصویر را وارد کنید');
      return;
    }

    if (editingImage) {
      const items = db.getCollection<GalleryImage>('galleryImages');
      const updated = items.map((item) =>
        item.id === editingImage.id ? { ...item, ...form } : item
      );
      db.setCollection('galleryImages', updated);
      toast.success('تصویر ویرایش شد');
    } else {
      const newItem: GalleryImage = {
        id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...form,
      };
      const items = db.getCollection<GalleryImage>('galleryImages');
      items.push(newItem);
      db.setCollection('galleryImages', items);
      toast.success('تصویر جدید اضافه شد');
    }

    setShowModal(false);
    setEditingImage(null);
    setForm({ title: '', category: 'کلاس', imageUrl: '/images/' });
    refreshImages();
  };

  const handleDelete = (img: GalleryImage) => {
    const items = db.getCollection<GalleryImage>('galleryImages');
    const filtered_items = items.filter((item) => item.id !== img.id);
    db.setCollection('galleryImages', filtered_items);
    setShowDeleteConfirm(null);
    toast.success('تصویر حذف شد');
    refreshImages();
  };

  const categoryStats = CATEGORIES.map((cat) => ({
    label: cat,
    count: images.filter((i) => i.category === cat).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت گالری</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <FiPlus className="h-4 w-4" /> آپلود تصویر
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">کل تصاویر</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FiImage className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{images.length}</p>
        </motion.div>
        {categoryStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.05 }}
            className="bg-background rounded-xl border p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiImage className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{s.count}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-background rounded-xl border p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border bg-background pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="جستجوی عنوان..."
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="همه">همه دسته‌بندی‌ها</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="bg-background rounded-xl border overflow-hidden group"
          >
            <div className="aspect-video relative">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" fill="%23e2e8f0"><rect width="400" height="225"/><text x="200" y="120" text-anchor="middle" fill="%2394a3b8" font-size="16" font-family="sans-serif">تصویر موجود نیست</text></svg>';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEditModal(img)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
                >
                  <FiEdit3 className="h-4 w-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(img)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                >
                  <FiTrash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{img.title}</p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[img.category] || 'bg-muted text-muted-foreground'}`}
              >
                {img.category}
              </span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            تصویری یافت نشد
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-md mx-4 p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingImage ? 'ویرایش تصویر' : 'افزودن تصویر جدید'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingImage(null);
                }}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">عنوان</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="عنوان تصویر..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">دسته‌بندی</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">آدرس تصویر</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full h-10 rounded-lg border bg-background px-4 text-sm font-mono ltr text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="/images/"
                />
              </div>
              {form.imageUrl && (
                <div className="rounded-lg border overflow-hidden bg-muted/30">
                  <img
                    src={form.imageUrl}
                    alt="پیش‌نمایش"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground h-10 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <FiSave className="h-4 w-4" />
                {editingImage ? 'ذخیره تغییرات' : 'افزودن'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingImage(null);
                }}
                className="flex-1 h-10 rounded-lg border text-sm font-medium hover:bg-muted transition-all"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-sm mx-4 p-6 space-y-4"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
              <FiTrash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center">حذف تصویر</h3>
            <p className="text-sm text-muted-foreground text-center">
              آیا از حذف &laquo;{showDeleteConfirm.title}&raquo; مطمئن هستید؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
              >
                بله، حذف شود
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 h-10 rounded-lg border text-sm font-medium hover:bg-muted transition-all"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
