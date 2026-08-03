'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBookOpen,
  FiPlus,
  FiTrash2,
  FiX,
  FiSave,
  FiEdit2,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export default function SchedulePage() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [showModal, setShowModal] = useState(false);
  const [filterDay, setFilterDay] = useState<string>('all');
  const [newItem, setNewItem] = useState({ courseId: '', day: 'شنبه', time: '', room: '' });

  const hydrated = useHydrated();

  const [schedule, setSchedule] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getSchedule();
    if (teacherId) {
      items = items.filter((s) => s.teacherId === teacherId);
    }
    setSchedule(items);
    let allCourses = db.getCourses();
    if (teacherId) {
      allCourses = db.getCoursesByTeacher(teacherId);
    }
    setCourses(allCourses);
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = filterDay === 'all' ? schedule : schedule.filter((s) => s.day === filterDay);

  const handleAdd = () => {
    const course = db.getCourseById(newItem.courseId);
    if (!course || !newItem.time) {
      toast.error('دوره و ساعت را انتخاب کنید');
      return;
    }
    const items = db.getCollection<any>('schedule');
    db.setCollection('schedule', [
      ...items,
      {
        id: `sch_${Date.now()}`,
        courseId: course.id,
        courseName: course.title,
        teacherId: course.teacherId,
        day: newItem.day,
        time: newItem.time,
        room: newItem.room || 'کلاس ۱',
      },
    ]);
    toast.success('جلسه به برنامه اضافه شد');
    setShowModal(false);
    setNewItem({ courseId: '', day: 'شنبه', time: '', room: '' });
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این جلسه مطمئن هستید؟')) {
      const items = db.getCollection<any>('schedule').filter((s: any) => s.id !== id);
      db.setCollection('schedule', items);
      toast.success('جلسه حذف شد');
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'برنامه کلاسی' : 'برنامه کلاسی من'}</h1>
          <p className="text-sm text-muted-foreground mt-1">{schedule.length} جلسه در برنامه</p>
        </div>
        {isAdmin || (teacherId && courses.length > 0) ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            افزودن جلسه
          </button>
        ) : null}
      </div>

      {/* Day filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterDay('all')}
          className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
            filterDay === 'all' ? 'bg-primary text-primary-foreground' : 'bg-background border'
          }`}
        >
          همه روزها
        </button>
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setFilterDay(d)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              filterDay === d ? 'bg-primary text-primary-foreground' : 'bg-background border'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const course = db.getCourseById(item.courseId);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FiCalendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{item.courseName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">استاد: {course?.teacherName || '—'}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <FiClock className="h-4 w-4 text-primary" /> {item.time}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <FiMapPin className="h-4 w-4 text-primary" /> {item.room}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <FiBookOpen className="h-4 w-4 text-primary" /> {item.day}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FiCalendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>جلسه‌ای در برنامه نیست</p>
        </div>
      )}

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">افزودن جلسه جدید</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <select
                value={newItem.courseId}
                onChange={(e) => setNewItem({ ...newItem, courseId: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">انتخاب دوره...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <select
                value={newItem.day}
                onChange={(e) => setNewItem({ ...newItem, day: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="ساعت (مثلاً ۱۶:۰۰ - ۱۸:۰۰)"
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="کلاس (مثلاً کلاس ۲)"
                value={newItem.room}
                onChange={(e) => setNewItem({ ...newItem, room: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <FiSave className="h-4 w-4" /> ثبت جلسه
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
