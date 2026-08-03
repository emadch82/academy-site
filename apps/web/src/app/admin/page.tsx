'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiShield,
  FiBookOpen,
  FiAward,
} from 'react-icons/fi';
import Link from 'next/link';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function AdminDashboard() {
  const stats = useMemo(() => {
    initializeDB();
    const users = db.getUsers();
    const teachers = users.filter((u) => u.role === 'teacher');
    const students = users.filter((u) => u.role === 'student');
    const courses = db.getCourses();
    return {
      totalUsers: users.length,
      teachers: teachers.length,
      students: students.length,
      courses: courses.length,
    };
  }, []);

  const teachers = useMemo(() => {
    initializeDB();
    return db
      .getUsers()
      .filter((u) => u.role === 'teacher')
      .map((t) => ({
        teacher: t,
        classes: db.getScheduleByTeacher(t.id).length,
        students: db.getStudentsByTeacher(t.id).length,
      }));
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
      >
        <h1 className="text-2xl font-bold mb-2">داشبورد مدیریت</h1>
        <p className="opacity-90">مدیریت کاربران و اساتید آموزشگاه زبان ویرا</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FiUsers, label: 'کل کاربران', value: stats.totalUsers.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: FiUserCheck, label: 'اساتید', value: stats.teachers.toString(), color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: FiUserPlus, label: 'دانش‌آموزان', value: stats.students.toString(), color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { icon: FiBookOpen, label: 'دوره‌ها', value: stats.courses.toString(), color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-background rounded-xl border p-5"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Management Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/users">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-xl border p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">مدیریت کاربران</h2>
              <p className="text-sm text-muted-foreground mt-1">تأیید، ویرایش و مدیریت تمام کاربران سیستم</p>
            </div>
            <FiShield className="h-5 w-5 text-muted-foreground/40" />
          </motion.div>
        </Link>
        <Link href="/admin/teachers">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-background rounded-xl border p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <FiUserCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">مدیریت اساتید</h2>
              <p className="text-sm text-muted-foreground mt-1">افزودن، ویرایش و مشاهده جزئیات اساتید</p>
            </div>
            <FiShield className="h-5 w-5 text-muted-foreground/40" />
          </motion.div>
        </Link>
      </div>

      {/* Teachers Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-background rounded-xl border p-6"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FiAward className="h-4 w-4 text-primary" /> نمای کلی اساتید
        </h2>
        <div className="space-y-3">
          {teachers.map(({ teacher, classes, students }) => (
            <Link
              key={teacher.id}
              href="/admin/teachers"
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FiUserCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{teacher.fullName}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">{teacher.email}</p>
              </div>
              <span className="text-xs font-medium text-green-600">{classes} کلاس</span>
              <span className="text-xs text-muted-foreground">{students} دانش‌آموز</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
