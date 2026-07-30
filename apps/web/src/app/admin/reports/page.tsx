'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { useHydrated } from '@/hooks/use-hydrated';

const monthlyData = [
  { month: 'فروردین', revenue: 15000000, students: 18, courses: 8 },
  { month: 'اردیبهشت', revenue: 22000000, students: 25, courses: 8 },
  { month: 'خرداد', revenue: 20000000, students: 22, courses: 8 },
  { month: 'تیر', revenue: 25000000, students: 28, courses: 8 },
  { month: 'مرداد', revenue: 18000000, students: 20, courses: 8 },
  { month: 'شهریور', revenue: 30000000, students: 32, courses: 8 },
  { month: 'مهر', revenue: 35000000, students: 35, courses: 8 },
  { month: 'آبان', revenue: 32000000, students: 33, courses: 8 },
  { month: 'آذر', revenue: 28000000, students: 30, courses: 8 },
  { month: 'دی', revenue: 25000000, students: 28, courses: 8 },
  { month: 'بهمن', revenue: 30000000, students: 32, courses: 8 },
  { month: 'اسفند', revenue: 20000000, students: 22, courses: 8 },
];

const courseStats = [
  { name: 'دوره کودکان', students: 12, revenue: 0, growth: 10 },
  { name: 'دوره نوجوانان', students: 10, revenue: 0, growth: 15 },
  { name: 'دوره بزرگسالان', students: 18, revenue: 0, growth: 12 },
  { name: 'مکالمه SPO', students: 10, revenue: 0, growth: 20 },
  { name: 'دوره TTC', students: 8, revenue: 0, growth: 5 },
  { name: 'آزمون MOC (آیلتس)', students: 12, revenue: 0, growth: 25 },
];

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

export default function ReportsPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">گزارشات و آنالیز</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'درآمد کل سال', value: new Intl.NumberFormat('fa-IR').format(monthlyData.reduce((a, d) => a + d.revenue, 0)), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiDollarSign },
          { label: 'میانگین ماهانه', value: new Intl.NumberFormat('fa-IR').format(Math.round(monthlyData.reduce((a, d) => a + d.revenue, 0) / 12)), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiTrendingUp },
          { label: 'بهترین ماه', value: 'بهمن', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: FiBarChart2 },
          { label: 'رشد سالانه', value: '+۲۰٪', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: FiTrendingUp },
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
        <h2 className="font-semibold mb-6">نمودار درآمد ماهانه</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-2 h-64 min-w-[600px]">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30" style={{ height: `${(data.revenue / maxRevenue) * 200}px` }} />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {(data.revenue / 1000000).toFixed(0)}M
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">عملکرد دوره‌ها</h2>
          <div className="space-y-4">
            {courseStats.map((course, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{course.name}</p>
                    <span className={`text-xs font-medium ${course.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {course.growth >= 0 ? '+' : ''}{course.growth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{course.students} دانشجو</p>
                    <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('fa-IR').format(course.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">رشد دانشجویان</h2>
          <div className="space-y-3">
            {monthlyData.slice(-6).map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{d.month}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/30 rounded-full" style={{ width: `${(d.students / 40) * 100}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-left">{d.students}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
