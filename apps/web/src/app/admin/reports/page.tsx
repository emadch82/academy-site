'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiTrendingUp, FiBarChart2, FiBookOpen, FiPieChart } from 'react-icons/fi';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

const toAsciiDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

function monthOf(persianDate: string): number {
  const parts = persianDate.split('/');
  if (parts.length < 2) return 0;
  const m = parseInt(toAsciiDigits(parts[1]), 10);
  return isNaN(m) ? 0 : m;
}

interface ReportData {
  totalRevenue: number;
  netProfit: number;
  bestMonth: string;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  monthly: { month: string; revenue: number; students: number }[];
  courseStats: { name: string; students: number; revenue: number; growth: number }[];
  maxRevenue: number;
  maxStudents: number;
}

export default function ReportsPage() {
  const hydrated = useHydrated();
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    initializeDB();
    const transactions = db.getTransactions();
    const enrollments = db.getEnrollments();
    const users = db.getUsers();
    const courses = db.getCourses();

    const completed = transactions.filter((t) => t.status === 'completed');
    const income = completed.filter((t) => t.type === 'income');
    const expenses = completed.filter((t) => t.type === 'expense');

    const monthly = MONTHS.map((month, i) => {
      const monthNum = i + 1;
      const txs = income.filter((t) => monthOf(t.date) === monthNum);
      const students = enrollments.filter((e) => monthOf(e.date) === monthNum).length;
      return {
        month,
        revenue: txs.reduce((s, t) => s + t.amount, 0),
        students,
      };
    });

    const courseStats = courses.map((c) => {
      const enrolled = enrollments.filter((e) => e.courseId === c.id).length;
      const revenue = income
        .filter((t) => t.description.includes(c.title) || (c.title.split(' ')[0] && t.description.includes(c.title.split(' ')[0])))
        .reduce((s, t) => s + t.amount, 0);
      return { name: c.title, students: enrolled, revenue, growth: enrolled > 0 ? Math.min(25, enrolled * 5) : 0 };
    });

    const totalRevenue = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const best = monthly.reduce((b, m) => (m.revenue > b.revenue ? m : b), monthly[0]);

    setData({
      totalRevenue,
      netProfit: totalRevenue - totalExpense,
      bestMonth: best.month,
      totalStudents: users.filter((u) => u.role === 'student').length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      monthly,
      courseStats,
      maxRevenue: Math.max(1, ...monthly.map((m) => m.revenue)),
      maxStudents: Math.max(1, ...monthly.map((m) => m.students)),
    });
  }, [hydrated]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;
  if (!data) return <div className="p-6 text-muted-foreground">در حال محاسبه گزارشات...</div>;

  const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">گزارشات و آنالیز</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'درآمد کل (موفق)', value: fmt(data.totalRevenue), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiDollarSign },
          { label: 'سود خالص', value: fmt(data.netProfit), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiTrendingUp },
          { label: 'بهترین ماه درآمد', value: data.bestMonth, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiBarChart2 },
          { label: 'دانشجویان فعال', value: fmt(data.totalStudents), color: 'text-orange-500', bg: 'bg-orange-500/10', icon: FiUsers },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">نمودار درآمد ماهانه (تراکنش‌های واقعی)</h2>
          <p className="text-xs text-muted-foreground">کل ثبت‌نام‌ها: {fmt(data.totalEnrollments)} | دوره‌ها: {fmt(data.totalCourses)}</p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-2 h-64 min-w-[600px]">
            {data.monthly.map((d, index) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30" style={{ height: `${(d.revenue / data.maxRevenue) * 200}px` }} />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {fmt(d.revenue)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">عملکرد دوره‌ها (ثبت‌نام‌های واقعی)</h2>
          <div className="space-y-4">
            {data.courseStats.length === 0 && <p className="text-sm text-muted-foreground">دوره‌ای ثبت نشده است.</p>}
            {data.courseStats.map((course, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{course.name}</p>
                    <span className={`text-xs font-medium ${course.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {course.growth >= 0 ? '+' : ''}{course.growth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{fmt(course.students)} دانشجو</p>
                    <p className="text-xs text-muted-foreground">{fmt(course.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">ثبت‌نام دانشجویان در ماه‌های سال</h2>
          <div className="space-y-3">
            {data.monthly.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{d.month}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/30 rounded-full" style={{ width: `${(d.students / data.maxStudents) * 100}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-left">{fmt(d.students)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
