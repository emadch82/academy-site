'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBell, FiCheck, FiInfo, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import { useNotifications } from '@/contexts/notification-context';

const ICON_MAP = {
  info: FiInfo,
  success: FiCheck,
  warning: FiAlertTriangle,
  error: FiAlertCircle,
};

const COLOR_MAP = {
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-green-500 bg-green-500/10',
  warning: 'text-yellow-500 bg-yellow-500/10',
  error: 'text-red-500 bg-red-500/10',
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllRead, clearAll, unreadCount } = useNotifications();

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
                <h1 className="text-3xl font-bold">اعلان‌ها</h1>
                <p className="text-muted-foreground mt-2">{unreadCount} اعلان خوانده نشده</p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllRead} className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">خواندن همه</button>
                )}
                <button type="button" onClick={clearAll} className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors text-red-500">پاک کردن</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <FiBell className="h-12 w-12 text-primary/40" />
            </div>
            <h2 className="text-xl font-bold mb-4">اعلانی وجود ندارد</h2>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => {
              const Icon = ICON_MAP[n.type];
              return (
                <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => markAsRead(n.id)} className={`bg-background rounded-2xl border p-5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[n.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{n.title}</h3>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{n.date}</p>
                  </div>
                  {n.link && (
                    <Link href={n.link} className="text-xs text-primary hover:underline shrink-0">مشاهده</Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
