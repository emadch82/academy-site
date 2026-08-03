'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiCheck,
  FiX,
  FiCheckCircle,
  FiMessageCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, Appointment } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

const STATUS_LABELS: Record<Appointment['status'], string> = {
  pending: 'در انتظار',
  approved: 'تایید شده',
  rejected: 'رد شده',
  completed: 'انجام شده',
};

const STATUS_STYLES: Record<Appointment['status'], string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-blue-50 text-blue-700',
  rejected: 'bg-red-50 text-red-600',
  completed: 'bg-green-50 text-green-700',
};

export default function AppointmentsPage() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | Appointment['status']>('all');

  const hydrated = useHydrated();

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getAppointments();
    if (teacherId) {
      items = items.filter((a) => a.teacherId === teacherId);
    }
    setAppointments(items);
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = filterStatus === 'all' ? appointments : appointments.filter((a) => a.status === filterStatus);
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const handleStatus = (ap: Appointment, status: Appointment['status']) => {
    db.updateAppointment(ap.id, { status });
    if (status !== 'pending') {
      db.addNotification({
        title: status === 'approved' ? 'رزرو کلاس تایید شد' : status === 'rejected' ? 'رزرو کلاس رد شد' : 'کلاس انجام شد',
        message: `رزرو کلاس ${ap.date} ساعت ${ap.time} با ${ap.teacherName} ${status === 'approved' ? 'تایید' : status === 'rejected' ? 'رد' : 'انجام'} شد.`,
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
        target: 'individual',
        recipientId: ap.studentId,
        status: 'sent',
        date: new Date().toLocaleDateString('fa-IR'),
      });
    }
    toast.success('وضعیت به‌روزرسانی شد');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">رزرو کلاس</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0 ? `${pendingCount} درخواست در انتظار تایید` : 'درخواستی در انتظار نیست'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-background border'
            }`}
          >
            {s === 'all' ? 'همه' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-background border rounded-2xl">
          <FiCalendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">رزروی وجود ندارد</p>
          <p className="text-sm text-muted-foreground mt-1">دانش‌آموزان می‌توانند جلسه کلاس رزرو کنند</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ap) => (
            <motion.div
              key={ap.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FiCalendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{ap.studentName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[ap.status]}`}>
                        {STATUS_LABELS[ap.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" /> {ap.date}</span>
                      <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {ap.time}</span>
                      <span className="flex items-center gap-1"><FiBookOpen className="h-3 w-3" /> {ap.courseName}</span>
                    </p>
                  </div>
                </div>

                {ap.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(ap, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <FiCheck className="h-4 w-4" /> تایید
                    </button>
                    <button
                      onClick={() => handleStatus(ap, 'rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <FiX className="h-4 w-4" /> رد
                    </button>
                  </div>
                )}

                {ap.status === 'approved' && (
                  <button
                    onClick={() => handleStatus(ap, 'completed')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FiCheckCircle className="h-4 w-4" /> علامت انجام
                  </button>
                )}
              </div>

              {ap.reason && (
                <div className="mt-3 p-3 rounded-xl bg-muted/40 text-sm flex items-start gap-2">
                  <FiMessageCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{ap.reason}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
