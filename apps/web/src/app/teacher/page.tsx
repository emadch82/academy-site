'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBookOpen,
  FiEdit3,
  FiUserX,
  FiCalendar,
  FiStar,
  FiSend,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function TeacherDashboard() {
  const currentUser = useCurrentUser();
  const teacherId = currentUser?.id ?? null;

  const [announceCourseId, setAnnounceCourseId] = useState('');
  const [announceMessage, setAnnounceMessage] = useState('');

  const stats = useMemo(() => {
    initializeDB();
    let courses = db.getCourses();
    let students = db.getUsers();
    if (teacherId) {
      courses = db.getCoursesByTeacher(teacherId);
      students = db.getStudentsByTeacher(teacherId);
    }
    const homework = teacherId ? db.getHomeworkByTeacher(teacherId) : [];
    const leaveRequests = teacherId ? db.getLeaveRequestsByTeacher(teacherId) : [];
    const appointments = teacherId ? db.getAppointmentsByTeacher(teacherId) : [];
    const reviews = teacherId ? db.getReviewsByTeacher(teacherId) : [];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '—';
    const tStats = teacherId ? db.getTeacherStats(teacherId) : null;

    return {
      courses,
      students,
      homework,
      leaveRequests,
      appointments,
      reviews,
      avgRating,
      tStats,
    };
  }, [teacherId]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const sendAnnounce = () => {
    const course = db.getCourseById(announceCourseId);
    if (!course || !announceMessage.trim()) {
      toast.error('دوره و متن پیام را وارد کنید');
      return;
    }
    const students = db.getStudentsByCourse(course.id);
    if (students.length === 0) {
      toast('دانش‌آموزی در این دوره ثبت‌نام نکرده است');
      return;
    }
    students.forEach((s) => {
      db.addNotification({
        title: `اعلان دوره ${course.title}`,
        message: announceMessage.trim(),
        type: 'info',
        target: 'individual',
        recipientId: s.id,
        status: 'sent',
        date: new Date().toLocaleDateString('fa-IR'),
      });
    });
    toast.success(`اعلان برای ${students.length} دانش‌آموز ارسال شد`);
    setAnnounceCourseId('');
    setAnnounceMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
      >
        <h1 className="text-2xl font-bold mb-2">داشبورد استاد</h1>
        <p className="opacity-90">خوش آمدید. دوره‌ها و دانش‌آموزان خود را مدیریت کنید.</p>
      </motion.div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: FiBookOpen, label: 'دوره‌های فعال', value: stats.courses.filter((c) => c.status === 'active').length.toString(), color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: FiUsers, label: 'دانش‌آموزان', value: stats.students.length.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: FiEdit3, label: 'تکالیف در انتظار تصحیح', value: stats.homework.filter((h) => h.status === 'submitted').length.toString(), color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { icon: FiStar, label: 'میانگین امتیاز', value: stats.avgRating, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { icon: FiUserX, label: 'غیبت در انتظار', value: stats.leaveRequests.filter((l) => l.status === 'pending').length.toString(), color: 'text-red-500', bg: 'bg-red-500/10' },
          { icon: FiCalendar, label: 'رزرو کلاس در انتظار', value: stats.appointments.filter((a) => a.status === 'pending').length.toString(), color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { icon: FiCheckCircle, label: 'نرخ حضور کلاس‌ها', value: stats.tStats ? `${stats.tStats.attendanceRate}٪` : '—', color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { icon: FiFileText, label: 'جزوات منتشرشده', value: (stats.tStats?.totalMaterials ?? 0).toString(), color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
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

      {/* Announce to class */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border p-6"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FiSend className="h-4 w-4 text-primary" /> اطلاع‌رسانی به کلاس
        </h2>
        <div className="grid sm:grid-cols-[1fr_2fr_auto] gap-3">
          <select
            value={announceCourseId}
            onChange={(e) => setAnnounceCourseId(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">انتخاب دوره...</option>
            {stats.courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input
            value={announceMessage}
            onChange={(e) => setAnnounceMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendAnnounce();
            }}
            placeholder="متن اعلان برای همه دانش‌آموزان دوره (Enter)"
            className="px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={sendAnnounce}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            ارسال اعلان
          </button>
        </div>
      </motion.div>
    </div>
  );
}
