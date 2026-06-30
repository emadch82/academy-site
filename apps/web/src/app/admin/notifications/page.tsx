'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiPlus,
  FiSend,
  FiUsers,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiTrash2,
  FiEdit2,
  FiFilter,
  FiX,
  FiSave,
  FiInfo,
  FiAlertTriangle,
  FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type Notification } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useNotifications } from '@/contexts/notification-context';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof FiInfo }> = {
  info: { label: 'اطلاعاتی', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiInfo },
  success: { label: 'موفقیت', color: 'text-green-500', bg: 'bg-green-500/10', icon: FiCheckCircle },
  warning: { label: 'هشدار', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: FiAlertTriangle },
  error: { label: 'خطا', color: 'text-red-500', bg: 'bg-red-500/10', icon: FiAlertCircle },
};

const TARGET_LABELS: Record<string, string> = {
  all: 'همه کاربران',
  course: 'دانشجویان دوره',
  individual: 'فرد خاص',
};

const EMPTY_FORM = {
  title: '',
  message: '',
  type: 'info' as Notification['type'],
  target: 'all' as Notification['target'],
};

const SEED_NOTIFICATIONS: Omit<Notification, 'id' | 'read'>[] = [
  { title: 'شروع ثبت‌نام دوره‌های پاییز', message: 'ثبت‌نام دوره‌های پاییز آغاز شد. برای مشاهده دوره‌ها به پنل مراجعه کنید.', type: 'info', target: 'all', status: 'sent', date: '۱۴۰۳/۰۸/۱۵' },
  { title: 'یادآوری کلاس React فردا', message: 'کلاس React فردا ساعت ۰۹:۰۰ برگزار می‌شود. لطفاً به موقع حضور داشته باشید.', type: 'warning', target: 'course', status: 'sent', date: '۱۴۰۳/۰۸/۱۴' },
  { title: 'اعلام نتایج آزمون HTML', message: 'نتایج آزمون HTML و CSS اعلام شد. نمرات خود را در پنل بررسی کنید.', type: 'success', target: 'course', status: 'sent', date: '۱۴۰۳/۰۸/۱۲' },
  { title: 'تخفیف ویژه دوره فتوشاپ', message: 'تخفیف ۲۰٪ ویژه دوره فتوشاپ تا پایان آبان ماه فعال است.', type: 'info', target: 'all', status: 'draft', date: '۱۴۰۳/۰۸/۱۰' },
  { title: 'یادآوری پرداخت اقساط', message: 'قسط سوم شهریه شما تا ۵ روز آینده سررسید می‌شود.', type: 'error', target: 'individual', status: 'sent', date: '۱۴۰۳/۰۸/۰۸' },
  { title: 'برگزاری وبینار رایگان', message: 'وبینار مبانی برنامه‌نویسی روز جمعه ساعت ۱۰:۰۰ برگزار می‌شود.', type: 'success', target: 'all', status: 'sent', date: '۱۴۰۳/۰۸/۰۵' },
];

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { addNotification: pushToSite } = useNotifications();
  const hydrated = useHydrated();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    initializeDB();
    let items = db.getNotifications();
    if (items.length === 0) {
      SEED_NOTIFICATIONS.forEach((n) => db.addNotification(n));
      items = db.getNotifications();
    }
    setNotifications(items);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const stats = useMemo(() => {
    const all = db.getNotifications();
    return {
      total: all.length,
      sent: all.filter((n) => n.status === 'sent').length,
      draft: all.filter((n) => n.status === 'draft').length,
    };
  }, [notifications]);

  const filtered = notifications.filter((n) => {
    const matchType = typeFilter === 'all' || n.type === typeFilter;
    const matchStatus = statusFilter === 'all' || n.status === statusFilter;
    return matchType && matchStatus;
  });

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (n: Notification) => {
    setEditingId(n.id);
    setForm({ title: n.title, message: n.message, type: n.type, target: n.target });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('لطفاً عنوان و پیام را وارد کنید');
      return;
    }
    if (editingId) {
      const items = db.getCollection<Notification>('notifications').map((n: Notification) =>
        n.id === editingId ? { ...n, title: form.title, message: form.message, type: form.type, target: form.target } : n
      );
      db.setCollection('notifications', items);
      toast.success('اعلان ویرایش شد');
    } else {
      db.addNotification({
        title: form.title,
        message: form.message,
        type: form.type,
        target: form.target,
        status: 'draft',
        date: new Date().toLocaleDateString('fa-IR'),
      });
      toast.success('اعلان جدید ایجاد شد');
    }
    closeModal();
    loadNotifications();
  };

  const handleSend = (id: string) => {
    const items = db.getCollection<Notification>('notifications').map((n: Notification) =>
      n.id === id ? { ...n, status: 'sent' as const } : n
    );
    db.setCollection('notifications', items);
    const sent = items.find((n: Notification) => n.id === id);
    if (sent) {
      pushToSite({ title: sent.title, message: sent.message, type: sent.type, link: sent.target === 'course' ? '/courses' : undefined });
    }
    toast.success('اعلان ارسال شد');
    loadNotifications();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`آیا از حذف «${title}» مطمئن هستید؟`)) {
      const items = db.getCollection<Notification>('notifications').filter((n: Notification) => n.id !== id);
      db.setCollection('notifications', items);
      toast.success('اعلان حذف شد');
      loadNotifications();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت اعلان‌ها</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <FiPlus className="h-4 w-4" />
          ایجاد اعلان جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">کل اعلان‌ها</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
          <p className="text-sm text-muted-foreground">ارسال شده</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-sm text-muted-foreground">پیش‌نویس</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold">{notifications.length}</p>
          <p className="text-sm text-muted-foreground">تعداد کل</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <FiFilter className="h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">همه انواع</option>
            <option value="info">اطلاعاتی</option>
            <option value="success">موفقیت</option>
            <option value="warning">هشدار</option>
            <option value="error">خطا</option>
          </select>
        </div>
        <div className="flex gap-1">
          {[
            { value: 'all', label: 'همه' },
            { value: 'sent', label: 'ارسال شده (نمایش در سایت)' },
            { value: 'draft', label: 'پیش‌نویس' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.map((notification, index) => {
          const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background rounded-xl border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {notification.status === 'draft' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">پیش‌نویس</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        {notification.date}
                      </span>
                      <span className="flex items-center gap-1">
                        {notification.target === 'all' ? (
                          <FiUsers className="h-3 w-3" />
                        ) : (
                          <FiUser className="h-3 w-3" />
                        )}
                        {TARGET_LABELS[notification.target]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {notification.status === 'draft' && (
                    <button
                      onClick={() => handleSend(notification.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                    >
                      <FiSend className="h-3 w-3" />
                      ارسال
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(notification)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    title="ویرایش"
                  >
                    <FiEdit2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(notification.id, notification.title)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="حذف"
                  >
                    <FiTrash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-background rounded-xl border">
          <FiBell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">اعلانی یافت نشد</p>
          <p className="text-muted-foreground">فیلترهای خود را تغییر دهید</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl border p-6 w-full max-w-lg mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editingId ? 'ویرایش اعلان' : 'ایجاد اعلان جدید'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="عنوان اعلان"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">پیام *</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="متن پیام اعلان"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Notification['type'] })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="info">اطلاعاتی</option>
                  <option value="success">موفقیت</option>
                  <option value="warning">هشدار</option>
                  <option value="error">خطا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">مخاطب</label>
                <select
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value as Notification['target'] })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">همه کاربران</option>
                  <option value="course">دانشجویان دوره خاص</option>
                  <option value="individual">فرد خاص</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <FiSave className="h-4 w-4" />
                {editingId ? 'ذخیره تغییرات' : 'ایجاد اعلان'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
