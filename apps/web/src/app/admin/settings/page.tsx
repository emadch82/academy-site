'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useHydrated } from '@/hooks/use-hydrated';
import {
  FiSave,
  FiHome,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMail,
  FiGlobe,
  FiBell,
  FiDollarSign,
  FiShield,
} from 'react-icons/fi';

const STORAGE_KEY = 'amz_settings';

interface SettingsData {
  academyName: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  hours: string;
  supportPhone: string;
  description: string;
  notifications: {
    courses: boolean;
    events: boolean;
    news: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  payment: {
    gateway: string;
    currency: string;
    maxInstallments: string;
    downPayment: string;
    methods: {
      online: boolean;
      card: boolean;
      cash: boolean;
      installment: boolean;
    };
  };
}

const defaultSettings: SettingsData = {
  academyName: 'آموزشگاه زبان ویرا',
  phone: '۰۳۱۳۶۵۱۲۸۱۴',
  mobile: '۰۹۱۳۲۰۱۹۱۳۹',
  email: 'info@viraacademyesf.ir',
  website: 'viraacademyesf.ir',
  address: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (۸۴)',
  hours: 'شنبه تا پنجشنبه ۸ صبح تا ۸ شب',
  supportPhone: '۰۹۱۳۲۰۱۹۱۳۹',
  description: 'مرکز تخصصی آموزش زبان انگلیسی',
  notifications: {
    courses: true,
    events: true,
    news: true,
    sms: false,
    email: false,
    push: true,
  },
  payment: {
    gateway: 'زیبال',
    currency: 'تومان',
    maxInstallments: '۶',
    downPayment: '۳۰',
    methods: {
      online: true,
      card: true,
      cash: true,
      installment: false,
    },
  },
};

function loadSettings(): SettingsData {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'academy' | 'notifications' | 'payment'>('academy');
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const update = (patch: Partial<SettingsData>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const updateNotification = (key: keyof SettingsData['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const updatePayment = (patch: Partial<SettingsData['payment']>) => {
    setSettings((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...patch },
    }));
  };

  const updatePaymentMethod = (key: keyof SettingsData['payment']['methods']) => {
    setSettings((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: { ...prev.payment.methods, [key]: !prev.payment.methods[key] },
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success('تنظیمات با موفقیت ذخیره شد');
  };

  const inputClass =
    'w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <FiSave className="h-4 w-4" />
          ذخیره تغییرات
        </button>
      </div>

      <div className="flex gap-2 border-b">
        {(
          [
            { key: 'academy' as const, icon: FiHome, label: 'اطلاعات آموزشگاه' },
            { key: 'notifications' as const, icon: FiBell, label: 'تنظیمات اعلان‌ها' },
            { key: 'payment' as const, icon: FiDollarSign, label: 'تنظیمات پرداخت' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'academy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-6 space-y-6"
        >
          <h2 className="font-semibold text-lg">اطلاعات آموزشگاه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiHome className="h-4 w-4 text-muted-foreground" />
                نام آموزشگاه
              </label>
              <input
                type="text"
                value={settings.academyName}
                onChange={(e) => update({ academyName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-muted-foreground" />
                شماره تلفن
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-muted-foreground" />
                موبایل
              </label>
              <input
                type="text"
                value={settings.mobile}
                onChange={(e) => update({ mobile: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiMail className="h-4 w-4 text-muted-foreground" />
                ایمیل
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update({ email: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiGlobe className="h-4 w-4 text-muted-foreground" />
                وبسایت
              </label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => update({ website: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiClock className="h-4 w-4 text-muted-foreground" />
                ساعات کاری
              </label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => update({ hours: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-muted-foreground" />
                تلفن پشتیبانی
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => update({ supportPhone: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-muted-foreground" />
                آدرس
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => update({ address: e.target.value })}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">درباره آموزشگاه</label>
            <textarea
              value={settings.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-6 space-y-6"
        >
          <h2 className="font-semibold text-lg">تنظیمات اعلان‌ها</h2>
          <div className="space-y-4">
            {(
              [
                { key: 'courses' as const, label: 'اعلان دوره‌ها', desc: 'اعلان ثبت‌نام و شروع دوره‌ها' },
                { key: 'events' as const, label: 'اعلان رویدادها', desc: 'اعلان رویدادها و برنامه‌های ویژه' },
                { key: 'news' as const, label: 'خبرنامه', desc: 'اعلان اخبار و مقالات جدید' },
                { key: 'sms' as const, label: 'پیامک', desc: 'ارسال اعلان از طریق پیامک' },
                { key: 'email' as const, label: 'ایمیل', desc: 'ارسال اعلان از طریق ایمیل' },
                { key: 'push' as const, label: 'اعلان فوری', desc: 'اعلان‌های فوری و لحظه‌ای' },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications[item.key] ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'payment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-6 space-y-6"
        >
          <h2 className="font-semibold text-lg">تنظیمات پرداخت</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiShield className="h-4 w-4 text-muted-foreground" />
                درگاه پرداخت پیش‌فرض
              </label>
              <select
                value={settings.payment.gateway}
                onChange={(e) => updatePayment({ gateway: e.target.value })}
                className={inputClass}
              >
                <option value="زیبال">زیبال</option>
                <option value="زرین‌پال">زرین‌پال</option>
                <option value="آی‌دی‌پی">آی‌دی‌پی</option>
                <option value="به‌پرداخت ملت">به‌پرداخت ملت</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FiDollarSign className="h-4 w-4 text-muted-foreground" />
                ارز پیش‌فرض
              </label>
              <select
                value={settings.payment.currency}
                onChange={(e) => updatePayment({ currency: e.target.value })}
                className={inputClass}
              >
                <option value="تومان">تومان</option>
                <option value="ریال">ریال</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">حداکثر اقساط</label>
              <input
                type="text"
                value={settings.payment.maxInstallments}
                onChange={(e) => updatePayment({ maxInstallments: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">درصد پیش‌پرداخت</label>
              <input
                type="text"
                value={settings.payment.downPayment}
                onChange={(e) => updatePayment({ downPayment: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">روش‌های پرداخت فعال</h3>
            {(
              [
                { key: 'online' as const, label: 'پرداخت آنلاین (درگاه بانکی)' },
                { key: 'card' as const, label: 'کارت به کارت' },
                { key: 'cash' as const, label: 'نقدی' },
                { key: 'installment' as const, label: 'اقساطی' },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.payment.methods[item.key]}
                  onChange={() => updatePaymentMethod(item.key)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
