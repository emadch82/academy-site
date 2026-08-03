'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare, FiTrash2, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function ReviewsPage() {
  const currentUser = useCurrentUser();
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const hydrated = useHydrated();

  const courses = useMemo(() => {
    if (!hydrated) return [];
    initializeDB();
    const all = db.getCourses();
    if (teacherId) {
      const ids = new Set(db.getCoursesByTeacher(teacherId).map((c) => c.id));
      return all.filter((c) => ids.has(c.id));
    }
    return all;
  }, [hydrated, teacherId]);

  const reviews = useMemo(() => {
    if (!hydrated) return [];
    initializeDB();
    let items = db.getReviews();
    if (teacherId) {
      items = db.getReviewsByTeacher(teacherId);
    }
    return items.sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = filterCourse === 'all' ? reviews : reviews.filter((r) => r.courseId === filterCourse);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این نظر مطمئن هستید؟')) {
      const items = db.getReviews().filter((r) => r.id !== id);
      db.setCollection('reviews', items);
      toast.success('نظر حذف شد');
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{teacherId ? 'نظرات دوره‌های من' : 'نظرات دوره‌ها'}</h1>
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} نظر ثبت شده</p>
        </div>
        <div className="flex items-center gap-2 bg-background border rounded-xl px-4 py-2.5">
          <FiStar className="h-5 w-5 text-yellow-400" />
          <span className="font-bold text-lg">{avgRating}</span>
          <span className="text-xs text-muted-foreground">میانگین امتیاز</span>
        </div>
      </div>

      <select
        value={filterCourse}
        onChange={(e) => setFilterCourse(e.target.value)}
        className="px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 max-w-sm"
      >
        <option value="all">همه دوره‌ها</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      <div className="space-y-3">
        {filtered.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiMessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{r.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.courseName} — {r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`h-4 w-4 ${star <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.comment}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 shrink-0"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FiBookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>نظری ثبت نشده است</p>
        </div>
      )}
    </div>
  );
}
