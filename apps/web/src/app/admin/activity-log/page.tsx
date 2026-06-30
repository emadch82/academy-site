'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiDollarSign, FiStar, FiLogIn, FiSettings, FiClock, FiSearch, FiFilter } from 'react-icons/fi';
import { db, initializeDB, type ActivityLog } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const TYPE_CONFIG: Record<ActivityLog['type'], { label: string; icon: typeof FiClock; color: string; bg: string }> = {
  register: { label: 'ثبت‌نام', icon: FiUserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  login: { label: 'ورود', icon: FiLogIn, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  purchase: { label: 'خرید', icon: FiDollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  review: { label: 'امتیاز', icon: FiStar, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  enrollment: { label: 'ثبت‌نام دوره', icon: FiUserPlus, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  system: { label: 'سیستم', icon: FiSettings, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

export default function ActivityLogPage() {
  const hydrated = useHydrated();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const logs = useMemo(() => {
    if (!hydrated) return [];
    initializeDB();
    return db.getActivityLogs().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [hydrated]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch = !search || log.userName.includes(search) || log.detail.includes(search) || log.meta?.includes(search);
      const matchType = typeFilter === 'all' || log.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [logs, search, typeFilter]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const stats = [
    { label: 'کل فعالیت‌ها', value: logs.length, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiClock },
    { label: 'ثبت‌نام', value: logs.filter((a) => a.type === 'register').length, color: 'text-green-500', bg: 'bg-green-500/10', icon: FiUserPlus },
    { label: 'پرداخت', value: logs.filter((a) => a.type === 'purchase').length, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiDollarSign },
    { label: 'ورود', value: logs.filter((a) => a.type === 'login').length, color: 'text-orange-500', bg: 'bg-orange-500/10', icon: FiLogIn },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لاگ فعالیت‌ها</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="جستجو در نام کاربر یا جزئیات..."
            />
          </div>
          <div className="flex gap-2 items-center">
            <FiFilter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {[
                { value: 'all', label: 'همه' },
                { value: 'register', label: 'ثبت‌نام' },
                { value: 'login', label: 'ورود' },
                { value: 'purchase', label: 'خرید' },
                { value: 'review', label: 'امتیاز' },
                { value: 'system', label: 'سیستم' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    typeFilter === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-background rounded-xl border p-6">
        <div className="space-y-1">
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FiSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>فعالیتی یافت نشد</p>
            </div>
          )}
          {filteredLogs.map((activity, i) => {
            const config = TYPE_CONFIG[activity.type];
            const Icon = config.icon;
            return (
              <motion.div key={activity.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>{config.label}</span>
                    <span className="font-medium text-sm">{activity.userName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{activity.detail}</p>
                  {activity.meta && <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.meta}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <FiClock className="h-3 w-3" />
                  {activity.timestamp}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
