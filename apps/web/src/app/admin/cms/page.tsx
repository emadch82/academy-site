'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import {
  FiFileText,
  FiImage,
  FiHelpCircle,
  FiMessageSquare,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiX,
  FiSave,
} from 'react-icons/fi';

type Tab = 'articles' | 'banners' | 'faq' | 'comments';

interface Article {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
}

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  active: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  course: string;
  date: string;
  status: 'approved' | 'pending';
}

const COLLECTIONS = {
  articles: 'cms_articles',
  banners: 'cms_banners',
  faq: 'cms_faq',
  comments: 'cms_comments',
} as const;

const SEED_ARTICLES: Article[] = [
  { id: 'ca1', title: '۱۰ روش مؤثر یادگیری زبان انگلیسی', content: 'روش‌های عملی و اثبات‌شده برای یادگیری سریعتر زبان انگلیسی.', status: 'published' },
  { id: 'ca2', title: 'روش‌های آموزش زبان به کودکان', content: 'بهترین متدهای آموزش زبان برای کودکان ۵ تا ۱۰ سال.', status: 'published' },
  { id: 'ca3', title: 'نکات کلیدی تقویت مکالمه', content: 'راهکارهای عملی برای بهبود مهارت Speaking و Listening.', status: 'draft' },
  { id: 'ca4', title: 'معرفی کتاب و فیلم', content: 'معرفی انواع کتاب و فیلم متناسب با سطح زبان هر فرد.', status: 'published' },
];

const SEED_BANNERS: Banner[] = [
  { id: 'cb1', title: 'ثبت‌نام دوره کودکان', imageUrl: '/images/children.jpg', link: '/courses/children', active: true },
  { id: 'cb2', title: 'دوره مکالمه SPO', imageUrl: '/images/conversation.jpg', link: '/courses/conversation', active: true },
  { id: 'cb3', title: 'آمادگی آیلتس', imageUrl: '/images/moc.jpg', link: '/courses/moc', active: true },
  { id: 'cb4', title: 'دوره‌های آنلاین', imageUrl: '/images/online.jpg', link: '/courses/online', active: true },
];

const SEED_FAQ: FaqItem[] = [
  { id: 'cf1', question: 'شرایط ثبت‌نام چیست؟', answer: 'برای ثبت‌نام کافی است فرم ثبت‌نام را پر کرده و هزینه دوره را پرداخت کنید.', category: 'عمومی' },
  { id: 'cf2', question: 'آیا امکان پرداخت اقساطی وجود دارد؟', answer: 'بله، امکان پرداخت اقساطی تا ۳ قسط فراهم است.', category: 'مالی' },
  { id: 'cf3', question: 'آیا گواهینامه معتبر ارائه می‌شود؟', answer: 'بله، پس از تکمیل دوره و قبولی در آزمون پایانی، گواهینامه معتبر صادر می‌شود.', category: 'آموزشی' },
  { id: 'cf4', question: 'شرایط استرداد شهریه چیست؟', answer: 'تا ۷ روز پس از ثبت‌نام امکان استرداد کامل شهریه وجود دارد.', category: 'مالی' },
];

const SEED_COMMENTS: Comment[] = [
  { id: 'cc1', author: 'سارا محمدی', content: 'کلاس مکالمه SPO خیلی عالی بود، ممنون از خانم مردانی', course: 'دوره مکالمه SPO', date: '۱۴۰۵/۰۴/۱۵', status: 'approved' },
  { id: 'cc2', author: 'علی رضایی', content: 'محیط آموزشگاه خیلی صمیمی و عالیه', course: 'عمومی', date: '۱۴۰۵/۰۴/۱۴', status: 'approved' },
  { id: 'cc3', author: 'مریم حسینی', content: 'دوره کودکان عالیه، پسرم خیلی لذت می‌بره', course: 'دوره کودکان', date: '۱۴۰۵/۰۴/۱۳', status: 'approved' },
  { id: 'cc4', author: 'رضا عباسی', content: 'لطفا دوره‌های بیشتری برای آمادگی آیلتس بذارید', course: 'عمومی', date: '۱۴۰۵/۰۴/۱۲', status: 'pending' },
];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getItems<T>(collection: string): T[] {
  return db.getCollection<T>(collection);
}

function setItems<T>(collection: string, items: T[]): void {
  db.setCollection(collection, items);
}

function addItem<T extends { id: string }>(collection: string, item: T): T {
  const items = getItems<T>(collection);
  items.push(item);
  setItems(collection, items);
  return item;
}

function updateItem<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
  const items = getItems<T>(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  setItems(collection, items);
  return items[idx];
}

function removeItem<T extends { id: string }>(collection: string, id: string): boolean {
  const items = getItems<T>(collection);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  setItems(collection, filtered);
  return true;
}

function seedCollection<T extends { id: string }>(collection: string, seed: T[]): T[] {
  const existing = getItems<T>(collection);
  if (existing.length === 0) {
    setItems(collection, seed);
    return seed;
  }
  return existing;
}

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; label: string } | null>(null);

  const [articleForm, setArticleForm] = useState({ title: '', content: '', status: 'draft' as 'published' | 'draft' });
  const [bannerForm, setBannerForm] = useState({ title: '', imageUrl: '', link: '', active: true });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '' });

  const loadData = useCallback(() => {
    setBanners(seedCollection<Banner>(COLLECTIONS.banners, SEED_BANNERS));
    setFaqItems(seedCollection<FaqItem>(COLLECTIONS.faq, SEED_FAQ));
    const posts = db.getBlogPosts().map((p) => ({ id: p.id, title: p.title, content: p.excerpt || p.title, status: p.status }));
    setArticles(posts);
    const realComments = db.getReviews().map((r) => ({
      id: r.id,
      author: r.studentName,
      content: r.comment,
      course: r.courseName,
      date: r.date,
      status: 'approved' as 'approved' | 'pending',
    }));
    setComments(realComments);
  }, []);

  useEffect(() => {
    initializeDB();
    loadData();
  }, [loadData]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const tabs: { id: Tab; label: string; icon: typeof FiFileText; count: number }[] = [
    { id: 'articles', label: 'مقالات', icon: FiFileText, count: articles.length },
    { id: 'banners', label: 'بنرها', icon: FiImage, count: banners.length },
    { id: 'faq', label: 'سوالات متداول', icon: FiHelpCircle, count: faqItems.length },
    { id: 'comments', label: 'نظرات', icon: FiMessageSquare, count: comments.length },
  ];

  const resetForms = () => {
    setArticleForm({ title: '', content: '', status: 'draft' });
    setBannerForm({ title: '', imageUrl: '', link: '', active: true });
    setFaqForm({ question: '', answer: '', category: '' });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForms();
    setModalType('add');
    setShowModal(true);
  };

  const openEditModal = (tab: Tab, item: any) => {
    setModalType('edit');
    setEditingId(item.id);
    if (tab === 'articles') {
      setArticleForm({ title: item.title, content: item.content, status: item.status });
    } else if (tab === 'banners') {
      setBannerForm({ title: item.title, imageUrl: item.imageUrl, link: item.link, active: item.active });
    } else if (tab === 'faq') {
      setFaqForm({ question: item.question, answer: item.answer, category: item.category });
    }
    setShowModal(true);
  };

  const handleSaveArticle = () => {
    if (!articleForm.title.trim()) {
      toast.error('عنوان مقاله الزامی است');
      return;
    }
    if (modalType === 'add') {
      const newItem: Article = {
        id: generateId('ca'),
        ...articleForm,
      };
      db.addBlogPost({
        title: articleForm.title,
        excerpt: articleForm.content.slice(0, 150),
        content: articleForm.content,
        category: 'عمومی',
        author: 'مدیر سیستم',
        status: articleForm.status,
        date: new Date().toLocaleDateString('fa-IR'),
        imageUrl: '/images/blog2.jpg',
        readTime: `${Math.max(1, Math.ceil(articleForm.content.length / 350))} دقیقه`,
      });
      setArticles((prev) => [...prev, newItem]);
      toast.success('مقاله اضافه شد');
    } else if (editingId) {
      const items = db.getBlogPosts();
      const post = items.find((p) => p.id === editingId);
      if (post) {
        db.updateBlogPost(editingId, { title: articleForm.title, excerpt: articleForm.content.slice(0, 150), content: articleForm.content, status: articleForm.status });
      }
      setArticles((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...articleForm } : a)));
      toast.success('مقاله ویرایش شد');
    }
    setShowModal(false);
    resetForms();
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title.trim()) {
      toast.error('عنوان بنر الزامی است');
      return;
    }
    if (modalType === 'add') {
      const newItem: Banner = {
        id: generateId('cb'),
        ...bannerForm,
      };
      addItem<Banner>(COLLECTIONS.banners, newItem);
      setBanners((prev) => [...prev, newItem]);
      toast.success('بنر اضافه شد');
    } else if (editingId) {
      updateItem<Banner>(COLLECTIONS.banners, editingId, bannerForm);
      setBanners((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...bannerForm } : b)));
      toast.success('بنر ویرایش شد');
    }
    setShowModal(false);
    resetForms();
  };

  const handleSaveFaq = () => {
    if (!faqForm.question.trim()) {
      toast.error('سوال الزامی است');
      return;
    }
    if (modalType === 'add') {
      const newItem: FaqItem = {
        id: generateId('cf'),
        ...faqForm,
      };
      addItem<FaqItem>(COLLECTIONS.faq, newItem);
      setFaqItems((prev) => [...prev, newItem]);
      toast.success('سوال اضافه شد');
    } else if (editingId) {
      updateItem<FaqItem>(COLLECTIONS.faq, editingId, faqForm);
      setFaqItems((prev) => prev.map((f) => (f.id === editingId ? { ...f, ...faqForm } : f)));
      toast.success('سوال ویرایش شد');
    }
    setShowModal(false);
    resetForms();
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    if (activeTab === 'articles') {
      db.deleteBlogPost(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } else if (activeTab === 'banners') {
      removeItem<Banner>(COLLECTIONS.banners, id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } else if (activeTab === 'faq') {
      removeItem<FaqItem>(COLLECTIONS.faq, id);
      setFaqItems((prev) => prev.filter((f) => f.id !== id));
    } else if (activeTab === 'comments') {
      db.deleteReview(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
    toast.success('حذف شد');
    setConfirmDelete(null);
  };

  const handleApproveComment = (id: string) => {
    updateItem<Comment>(COLLECTIONS.comments, id, { status: 'approved' });
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c)));
    toast.success('نظر تایید شد');
  };

  const handleToggleBanner = (id: string, currentActive: boolean) => {
    updateItem<Banner>(COLLECTIONS.banners, id, { active: !currentActive });
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !currentActive } : b)));
    toast.success(currentActive ? 'بنر غیرفعال شد' : 'بنر فعال شد');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <FiCheckCircle className="h-3 w-3" />
            {status === 'published' ? 'منتشر شده' : 'تایید شده'}
          </span>
        );
      case 'draft':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <FiClock className="h-3 w-3" />
            {status === 'draft' ? 'پیش‌نویس' : 'در انتظار'}
          </span>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const prefix = modalType === 'add' ? 'افزودن' : 'ویرایش';
    switch (activeTab) {
      case 'articles': return `${prefix} مقاله`;
      case 'banners': return `${prefix} بنر`;
      case 'faq': return `${prefix} سوال`;
      default: return prefix;
    }
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => { setShowModal(false); resetForms(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">{getModalTitle()}</h2>
              <button onClick={() => { setShowModal(false); resetForms(); }} className="p-1 rounded-lg hover:bg-muted">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeTab === 'articles' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان</label>
                    <input
                      type="text"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="عنوان مقاله"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">محتوا</label>
                    <textarea
                      value={articleForm.content}
                      onChange={(e) => setArticleForm((p) => ({ ...p, content: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-28 resize-none"
                      placeholder="محتوای مقاله"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">وضعیت</label>
                    <select
                      value={articleForm.status}
                      onChange={(e) => setArticleForm((p) => ({ ...p, status: e.target.value as 'published' | 'draft' }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    >
                      <option value="draft">پیش‌نویس</option>
                      <option value="published">منتشر شده</option>
                    </select>
                  </div>
                </>
              )}
              {activeTab === 'banners' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="عنوان بنر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">آدرس تصویر</label>
                    <input
                      type="text"
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="/images/banner.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">لینک</label>
                    <input
                      type="text"
                      value={bannerForm.link}
                      onChange={(e) => setBannerForm((p) => ({ ...p, link: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="/courses"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bannerForm.active}
                      onChange={(e) => setBannerForm((p) => ({ ...p, active: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                      id="banner-active"
                    />
                    <label htmlFor="banner-active" className="text-sm font-medium">فعال</label>
                  </div>
                </>
              )}
              {activeTab === 'faq' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">سوال</label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="سوال"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">پاسخ</label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-24 resize-none"
                      placeholder="پاسخ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                    <input
                      type="text"
                      value={faqForm.category}
                      onChange={(e) => setFaqForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                      placeholder="دسته‌بندی"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
              <button
                onClick={() => { setShowModal(false); resetForms(); }}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'articles') handleSaveArticle();
                  else if (activeTab === 'banners') handleSaveBanner();
                  else if (activeTab === 'faq') handleSaveFaq();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                <FiSave className="h-4 w-4" />
                ذخیره
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderConfirmDelete = () => {
    if (!confirmDelete) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FiTrash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold">حذف آیتم</h3>
              <p className="text-sm text-muted-foreground">
                آیا از حذف <span className="font-medium">{confirmDelete.label}</span> اطمینان دارید؟
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
              >
                <FiTrash2 className="h-4 w-4" />
                حذف
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">CMS - مدیریت محتوا</h1>
        {activeTab !== 'comments' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            <FiPlus className="h-4 w-4" />
            افزودن
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-muted">{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === 'articles' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-background rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-right px-4 py-3 font-medium">عنوان</th>
                  <th className="text-right px-4 py-3 font-medium">محتوا</th>
                  <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                  <th className="text-right px-4 py-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{article.content}</td>
                    <td className="px-4 py-3">{getStatusBadge(article.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal('articles', article)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <FiEdit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => setConfirmDelete({ id: article.id, label: article.title })} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <FiTrash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'banners' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-background rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{banner.title}</h3>
                <button onClick={() => handleToggleBanner(banner.id, banner.active)} className="shrink-0">
                  {banner.active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <FiCheckCircle className="h-3 w-3" /> فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <FiXCircle className="h-3 w-3" /> غیرفعال
                    </span>
                  )}
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>لینک: {banner.link}</p>
                <p>تصویر: {banner.imageUrl}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEditModal('banners', banner)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium hover:bg-muted">
                  <FiEdit2 className="h-4 w-4" />
                  ویرایش
                </button>
                <button onClick={() => setConfirmDelete({ id: banner.id, label: banner.title })} className="px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                  <FiTrash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'faq' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.id} className="bg-background rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{item.question}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{item.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEditModal('faq', item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <FiEdit2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => setConfirmDelete({ id: item.id, label: item.question })} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <FiTrash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'comments' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-background rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.author}</span>
                    {getStatusBadge(comment.status)}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>دوره: {comment.course}</span>
                    <span>{comment.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setConfirmDelete({ id: comment.id, label: comment.author })} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <FiTrash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {renderModal()}
      {renderConfirmDelete()}
    </div>
  );
}
