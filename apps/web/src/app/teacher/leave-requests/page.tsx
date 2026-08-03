'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUserX,
  FiCheck,
  FiX,
  FiClock,
  FiBookOpen,
  FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, LeaveRequest } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

const STATUS_LABELS: Record<LeaveRequest['status'], string> = {
  pending: 'در انتظار بررسی',
  approved: 'تایید شده',
  rejected: 'رد شده',
};

const STATUS_STYLES: Record<LeaveRequest['status'], string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-600',
};

export default function LeaveRequestsPage() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | LeaveRequest['status']>('all');

  const hydrated = useHydrated();

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getLeaveRequests();
    if (teacherId) {
      items = items.filter((l) => l.teacherId === teacherId);
    }
    setRequests(items);
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = filterStatus === 'all' ? requests : requests.filter((l) => l.status === filterStatus);
  const pendingCount = requests.filter((l) => l.status === 'pending').length;

  const handleStatus = (req: LeaveRequest, status: LeaveRequest['status']) => {
    db.updateLeaveRequest(req.id, { status });
    db.addNotification({
      title: status === 'approved' ? 'غیبت تایید شد' : 'غیبت رد شد',
      message: `درخواست غیبت موجه تاریخ ${req.date} در دوره «${req.courseName}» ${status === 'approved' ? 'تایید' : 'رد'} شد.`,
      type: status === 'approved' ? 'success' : 'error',
      target: 'individual',
      recipientId: req.studentId,
      status: 'sent',
      date: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success(status === 'approved' ? 'درخواست تایید شد' : 'درخواست رد شد');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">درخواست‌های غیبت موجه</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0 ? `${pendingCount} درخواست در انتظار بررسی` : 'درخواستی در انتظار نیست'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
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
          <FiUserX className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">درخواستی وجود ندارد</p>
          <p className="text-sm text-muted-foreground mt-1">دانش‌آموزان درخواست غیبت موجه خود را اینجا ثبت می‌کنند</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <FiUserX className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{req.studentName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {req.date}</span>
                      <span className="flex items-center gap-1"><FiBookOpen className="h-3 w-3" /> {req.courseName}</span>
                      <span className="flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> ثبت: {req.createdAt}</span>
                      {(req as any).isToday && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-600 rounded-full px-2 py-0.5">
                          <FiAlertCircle className="h-3 w-3" /> امروز نمی‌تواند بیاید
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(req, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <FiCheck className="h-4 w-4" /> تایید
                    </button>
                    <button
                      onClick={() => handleStatus(req, 'rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <FiX className="h-4 w-4" /> رد
                    </button>
                  </div>
                )}
              </div>

              {req.reason && (
                <div className="mt-3 p-3 rounded-xl bg-muted/40 text-sm">
                  <span className="font-medium">دلیل: </span>
                  {req.reason}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
