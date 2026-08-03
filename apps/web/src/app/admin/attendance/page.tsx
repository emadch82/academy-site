'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBookOpen,
  FiUserCheck,
  FiRefreshCw,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

const STATUS_LABELS: Record<string, string> = {
  present: 'حاضر',
  absent: 'غایب',
  late: 'تأخیر',
};

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent: 'bg-red-100 text-red-700 border-red-200',
  late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function AttendancePage() {
  const [courseId, setCourseId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('fa-IR'));
  const [records, setRecords] = useState<Record<string, string>>({});
  const [savedFor, setSavedFor] = useState<string>('');

  const currentUser = useCurrentUser();
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const courses = useMemo(() => {
    initializeDB();
    const all = db.getCourses().filter((c) => c.status === 'active');
    if (teacherId) {
      const ids = new Set(db.getCoursesByTeacher(teacherId).map((c) => c.id));
      return all.filter((c) => ids.has(c.id));
    }
    return all;
  }, [teacherId]);

  const hydrated = useHydrated();
  useEffect(() => {
    if (hydrated && courseId) {
      const existing = db.getAttendanceByCourse(courseId).filter((a) => a.date === date);
      const map: Record<string, string> = {};
      existing.forEach((a) => {
        map[a.studentId] = a.status;
      });
      setRecords(map);
      setSavedFor(existing.length > 0 ? date : '');
    }
  }, [hydrated, courseId, date]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const students = courseId ? db.getStudentsByCourse(courseId) : [];

  const setStatus = (studentId: string, status: string) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
    setSavedFor('');
  };

  const saveAttendance = () => {
    if (!courseId) {
      toast.error('ابتدا دوره را انتخاب کنید');
      return;
    }
    const today = new Date().toLocaleDateString('fa-IR');
    const targetDate = date === today ? today : date;
    const existing = db.getAttendanceByCourse(courseId).filter((a) => a.date === targetDate);
    const existingIds = new Set(existing.map((a) => a.studentId));

    students.forEach((student) => {
      const status = records[student.id];
      if (!status) return;
      if (existingIds.has(student.id)) {
        const rec = existing.find((a) => a.studentId === student.id)!;
        const items = db.getCollection<any>('attendance');
        const idx = items.findIndex((i: any) => i.id === rec.id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], status };
          db.setCollection('attendance', items);
        }
      } else {
        db.addAttendance({
          courseId,
          studentId: student.id,
          studentName: student.fullName,
          date: targetDate,
          status: status as any,
        });
      }
    });

    toast.success('حاضری و غیاب ثبت شد');
    setSavedFor(targetDate);
  };

  const markedCount = students.filter((s) => records[s.id]).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">حاضری و غیاب</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ثبت حضور و غیاب دانش‌آموزان هر دوره
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
        >
          <option value="">انتخاب دوره...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} — {c.teacherName}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="تاریخ (مثلاً ۱۴۰۵/۰۵/۱۵)"
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {!courseId ? (
        <div className="text-center py-16 text-muted-foreground">
          <FiCalendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>برای ثبت حاضری، ابتدا یک دوره را انتخاب کنید</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {students.length} دانش‌آموز — {markedCount} نفر ثبت شدند
            </p>
            {savedFor && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                <FiCheckCircle className="h-3 w-3" /> ثبت‌شده برای {savedFor}
              </span>
            )}
          </div>

          {/* Student list */}
          <div className="space-y-2">
            {students.map((student) => {
              const current = records[student.id];
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between gap-3 p-3 border rounded-xl bg-background"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <FiUserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {student.mobile}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    {(['present', 'late', 'absent'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          current === status
                            ? STATUS_COLORS[status]
                            : 'border-gray-200 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {status === 'present' && <FiCheckCircle className="h-3.5 w-3.5" />}
                        {status === 'absent' && <FiXCircle className="h-3.5 w-3.5" />}
                        {status === 'late' && <FiClock className="h-3.5 w-3.5" />}
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {students.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FiBookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>این دوره دانش‌آموز ثبت‌نامی ندارد</p>
            </div>
          )}

          {/* Save */}
          <div className="sticky bottom-0 py-3 bg-muted/60 backdrop-blur border-t">
            <button
              onClick={saveAttendance}
              disabled={markedCount === 0}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className="h-4 w-4" />
              ثبت حاضری و غیاب ({markedCount} نفر)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
