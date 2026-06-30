'use client';

import { motion } from 'framer-motion';
import { FiUserPlus, FiDollarSign, FiFileText, FiCalendar, FiCheckCircle, FiBookOpen, FiSettings, FiStar, FiClock } from 'react-icons/fi';
import { useHydrated } from '@/hooks/use-hydrated';

const ACTIVITY_LOG = [
  { id: '1', action: 'ثبت‌نام جدید', user: 'علی محمدی', detail: 'در دوره هوش مصنوعی ثبت‌نام کرد', time: '۱۴۰۵/۰۳/۱۵ ۱۰:۳۰', icon: FiUserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: '2', action: 'پرداخت', user: 'سارا رضایی', detail: 'مبلغ ۲,۵۰۰,۰۰۰ تومان پرداخت کرد', time: '۱۴۰۵/۰۳/۱۵ ۱۰:۰۰', icon: FiDollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: '3', action: 'آزمون', user: 'رضا حسینی', detail: 'آزمون React را با نمره ۸۵ تحویل داد', time: '۱۴۰۵/۰۳/۱۵ ۰۹:۳۰', icon: FiFileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: '4', action: 'کلاس جدید', user: 'مدیر سیستم', detail: 'کلاس «طراحی UI» ایجاد شد', time: '۱۴۰۵/۰۳/۱۵ ۰۹:۰۰', icon: FiCalendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: '5', action: 'گواهینامه', user: 'مریم حسینی', detail: 'گواهینامه دوره فتوشاپ را دریافت کرد', time: '۱۴۰۵/۰۳/۱۴ ۱۸:۰۰', icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: '6', action: 'دوره جدید', user: 'مدیر سیستم', detail: 'دوره «زبان انگلیسی» به روزرسانی شد', time: '۱۴۰۵/۰۳/۱۴ ۱۶:۰۰', icon: FiBookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  { id: '7', action: 'تنظیمات', user: 'مدیر سیستم', detail: 'تنظیمات پرداخت به روزرسانی شد', time: '۱۴۰۵/۰۳/۱۴ ۱۴:۰۰', icon: FiSettings, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  { id: '8', action: 'پیشنهاد', user: 'نیلوفر احمدی', detail: 'پیشنهاد «اپلیکیشن موبایل» ثبت کرد', time: '۱۴۰۵/۰۳/۱۴ ۱۲:۰۰', icon: FiStar, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: '9', action: 'ثبت‌نام', user: 'علی رضایی', detail: 'در دوره مدیریت پروژه ثبت‌نام کرد', time: '۱۴۰۵/۰۳/۱۴ ۱۰:۰۰', icon: FiUserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: '10', action: 'پرداخت', user: 'نیلوفر احمدی', detail: 'کیف پول را ۵۰۰,۰۰۰ تومان شارژ کرد', time: '۱۴۰۵/۰۳/۱۳ ۱۸:۰۰', icon: FiDollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: '11', action: 'چت', user: 'علی محمدی', detail: 'پیام پشتیبانی ارسال کرد', time: '۱۴۰۵/۰۳/۱۳ ۱۶:۰۰', icon: FiStar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: '12', action: 'تخفیف', user: 'مدیر سیستم', detail: 'کد تخفیف «نجمایی۱۰» فعال شد', time: '۱۴۰۵/۰۳/۱۳ ۱۴:۰۰', icon: FiSettings, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function ActivityLogPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لاگ فعالیت‌ها</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'کل فعالیت‌ها', value: ACTIVITY_LOG.length.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiClock },
          { label: 'ثبت‌نام', value: ACTIVITY_LOG.filter((a) => a.action.includes('ثبت‌نام')).length.toString(), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiUserPlus },
          { label: 'پرداخت', value: ACTIVITY_LOG.filter((a) => a.action.includes('پرداخت')).length.toString(), color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiDollarSign },
          { label: 'امروز', value: ACTIVITY_LOG.filter((a) => a.time.includes('۱۵')).length.toString(), color: 'text-orange-500', bg: 'bg-orange-500/10', icon: FiCalendar },
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

      <div className="bg-background rounded-xl border p-6">
        <div className="space-y-1">
          {ACTIVITY_LOG.map((activity, i) => (
            <motion.div key={activity.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center shrink-0`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">— {activity.user}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{activity.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                <FiClock className="h-3 w-3" />
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
