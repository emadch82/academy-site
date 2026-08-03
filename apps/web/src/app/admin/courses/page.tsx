'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiBookOpen,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSave,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type Course } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const STATUS_LABELS: Record<string, string> = { active: 'فعال', inactive: 'غیرفعال', draft: 'پیش‌نویس' };

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', teacherId: '', teacherName: '', category: '', price: 0, capacity: 20, imageUrl: '', level: 'مبتدی', duration: '' });

  const courses = useMemo(() => { initializeDB(); return db.getCourses(); }, []);
  const teachers = useMemo(() => db.getUsers().filter((u) => u.role === 'teacher'), []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.includes(searchQuery) || course.teacherName.includes(searchQuery) || course.category.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
      db.deleteCourse(id);
      toast.success('دوره حذف شد');
    }
  };

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.teacherName) { toast.error('لطفاً فیلدهای ضروری را پر کنید'); return; }
    db.addCourse({ ...newCourse, enrolledCount: 0, status: 'active', imageUrl: newCourse.imageUrl || '/images/ai.jpg' });
    toast.success('دوره جدید اضافه شد');
    setShowAddModal(false);
    setNewCourse({ title: '', teacherId: '', teacherName: '', category: '', price: 0, capacity: 20, imageUrl: '', level: 'مبتدی', duration: '' });
  };

  const formatPrice = (n: number) => n.toLocaleString('fa-IR');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت دوره‌ها</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <FiPlus className="h-4 w-4" />
          افزودن دوره جدید
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-10 pl-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="draft">پیش‌نویس</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl border p-4"><p className="text-2xl font-bold">{courses.length}</p><p className="text-sm text-muted-foreground">کل دوره‌ها</p></div>
        <div className="bg-background rounded-xl border p-4"><p className="text-2xl font-bold text-green-600">{courses.filter((c) => c.status === 'active').length}</p><p className="text-sm text-muted-foreground">فعال</p></div>
        <div className="bg-background rounded-xl border p-4"><p className="text-2xl font-bold text-red-600">{courses.filter((c) => c.status === 'inactive').length}</p><p className="text-sm text-muted-foreground">غیرفعال</p></div>
        <div className="bg-background rounded-xl border p-4"><p className="text-2xl font-bold text-gray-600">{courses.filter((c) => c.status === 'draft').length}</p><p className="text-sm text-muted-foreground">پیش‌نویس</p></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-background rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-right px-4 py-3 font-medium">تصویر</th>
              <th className="text-right px-4 py-3 font-medium">عنوان دوره</th>
              <th className="text-right px-4 py-3 font-medium">مدرس</th>
              <th className="text-right px-4 py-3 font-medium">دانشجویان</th>
              <th className="text-right px-4 py-3 font-medium">قیمت</th>
              <th className="text-right px-4 py-3 font-medium">مدت</th>
              <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 font-medium">عملیات</th>
            </tr></thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><img src={course.imageUrl} alt={course.title} className="w-16 h-10 rounded object-cover" /></td>
                  <td className="px-4 py-3"><p className="font-medium">{course.title}</p><p className="text-xs text-muted-foreground mt-1">{course.category}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{course.teacherName}</td>
                  <td className="px-4 py-3 flex items-center gap-1"><FiUsers className="h-4 w-4 text-muted-foreground" /><span>{course.enrolledCount}</span></td>
                  <td className="px-4 py-3 font-medium">{formatPrice(course.price)} تومان</td>
                  <td className="px-4 py-3 flex items-center gap-1 text-muted-foreground"><FiClock className="h-4 w-4" /><span>{course.duration}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' ? 'bg-green-100 text-green-700' :
                      course.status === 'inactive' ? 'bg-red-100 text-red-700' :
                      'bg-muted text-muted-foreground'
                    }`}>{STATUS_LABELS[course.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(course.id, course.title)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><FiTrash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCourses.length === 0 && <div className="text-center py-12"><FiBookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-lg font-medium">دوره‌ای یافت نشد</p></div>}
      </motion.div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background rounded-2xl border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">افزودن دوره جدید</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg"><FiX className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">عنوان دوره *</label><input type="text" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="عنوان دوره" /></div>
              <div><label className="block text-sm font-medium mb-1">مدرس *</label><select value={newCourse.teacherName} onChange={(e) => { const t = teachers.find((t) => t.fullName === e.target.value); setNewCourse({ ...newCourse, teacherName: e.target.value, teacherId: t?.id || '' }); }} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"><option value="">انتخاب مدرس</option>{teachers.map((t) => <option key={t.id} value={t.fullName}>{t.fullName}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">دسته‌بندی</label><input type="text" value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="دسته‌بندی" /></div>
              <div><label className="block text-sm font-medium mb-1">قیمت (تومان)</label><input type="number" value={newCourse.price || ''} onChange={(e) => setNewCourse({ ...newCourse, price: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">مدت زمان</label><input type="text" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="۱۲ جلسه" /></div>
              <button onClick={handleAddCourse} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 flex items-center justify-center gap-2"><FiSave className="h-4 w-4" />ذخیره دوره</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
