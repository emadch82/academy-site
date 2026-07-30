'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBookOpen,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiClock,
} from 'react-icons/fi';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function AdminDashboard() {
  const stats = useMemo(() => {
    initializeDB();
    const users = db.getUsers();
    const courses = db.getCourses();
    const transactions = db.getTransactions();

    const activeCourses = courses.filter((c) => c.status === 'active').length;
    const totalIncome = transactions.filter((t) => t.type === 'income' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

    return {
      activeCourses,
      totalIncome,
      users,
      courses,
      transactions,
    };
  }, []);

  const topCourses = useMemo(() => {
    return stats.courses
      .filter((c) => c.status === 'active')
      .sort((a, b) => b.enrolledCount - a.enrolledCount)
      .slice(0, 5);
  }, [stats.courses]);

  const recentTransactions = useMemo(() => {
    return stats.transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [stats.transactions]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const chartData = [
    { label: 'فروردین', value: 45 },
    { label: 'اردیبهشت', value: 62 },
    { label: 'خرداد', value: 58 },
    { label: 'تیر', value: 71 },
    { label: 'مرداد', value: 65 },
    { label: 'شهریور', value: 80 },
    { label: 'مهر', value: 75 },
    { label: 'آبان', value: 88 },
    { label: 'آذر', value: 92 },
    { label: 'دی', value: 85 },
    { label: 'بهمن', value: 95 },
    { label: 'اسفند', value: 78 },
  ];
  const maxChartValue = Math.max(...chartData.map((d) => d.value));

  const formatPrice = (n: number) => n.toLocaleString('fa-IR');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
      >
        <h1 className="text-2xl font-bold mb-2">داشبورد مدیریت</h1>
        <p className="opacity-90">خوش آمدید. وضعیت کلی آموزشگاه زبان ویرا را مشاهده کنید.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: FiBookOpen, label: 'دوره‌های فعال', value: stats.activeCourses.toString(), change: '+۲', trend: 'up' as const, color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: FiDollarSign, label: 'درآمد کل', value: formatPrice(stats.totalIncome), suffix: 'تومان', change: '+۱۸٪', trend: 'up' as const, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { icon: FiUsers, label: 'کل کاربران', value: stats.users.length.toString(), change: '+۵', trend: 'up' as const, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <FiArrowUp className="h-4 w-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-background rounded-xl border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">نمودار درآمد ماهانه</h2>
            <span className="text-sm text-muted-foreground">واحد: میلیون تومان</span>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-end gap-2 h-48">
              {chartData.map((data, index) => (
                <div key={data.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30"
                      style={{ height: `${(data.value / maxChartValue) * 140}px` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.value}M
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background rounded-xl border p-6"
        >
          <h2 className="font-semibold mb-4">پرفروش‌ترین دوره‌ها</h2>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.enrolledCount} ثبت‌نام</p>
                </div>
                <p className="text-xs font-medium text-green-600">{formatPrice(course.price * course.enrolledCount)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-background rounded-xl border p-6"
      >
        <h2 className="font-semibold mb-4">تراکنش‌های اخیر</h2>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {tx.type === 'income' ? <FiTrendingUp className="h-5 w-5 text-green-500" /> : <FiArrowDown className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">{tx.description}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <FiClock className="h-3 w-3" />
                  {tx.date}
                </p>
              </div>
              <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
