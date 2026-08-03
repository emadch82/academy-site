'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiLink,
  FiYoutube,
  FiFile,
  FiDownload,
  FiBookOpen,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, Material } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

const TYPE_ICONS: Record<Material['type'], React.ElementType> = {
  pdf: FiFileText,
  video: FiYoutube,
  link: FiLink,
  file: FiFile,
};

const TYPE_LABELS: Record<Material['type'], string> = {
  pdf: 'جزوه PDF',
  video: 'ویدیو',
  link: 'لینک',
  file: 'فایل',
};

export default function MaterialsPage() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState<Material['type']>('pdf');
  const [url, setUrl] = useState('');
  const [filterType, setFilterType] = useState<'all' | Material['type']>('all');

  const hydrated = useHydrated();

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getMaterials();
    if (teacherId) {
      items = items.filter((m) => m.teacherId === teacherId);
    }
    setMaterials(items);
    let allCourses = db.getCourses();
    if (teacherId) {
      allCourses = db.getCoursesByTeacher(teacherId);
    }
    setCourses(allCourses);
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filtered = filterType === 'all' ? materials : materials.filter((m) => m.type === filterType);

  const handleAdd = () => {
    const course = db.getCourseById(courseId);
    if (!course || !title.trim() || !url.trim()) {
      toast.error('عنوان، دوره و لینک فایل را وارد کنید');
      return;
    }
    db.addMaterial({
      courseId: course.id,
      courseName: course.title,
      teacherId: teacherId || course.teacherId,
      title: title.trim(),
      type,
      url: url.trim(),
      addedAt: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('جزوه اضافه شد');
    setShowModal(false);
    setTitle('');
    setCourseId('');
    setType('pdf');
    setUrl('');
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این جزوه مطمئن هستید؟')) {
      db.deleteMaterial(id);
      toast.success('جزوه حذف شد');
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">جزوات دوره‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">{materials.length} جزوه</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          افزودن جزوه
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pdf', 'video', 'link', 'file'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              filterType === t ? 'bg-primary text-primary-foreground' : 'bg-background border'
            }`}
          >
            {t === 'all' ? 'همه' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-background border rounded-2xl">
          <FiFileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">جزوه‌ای یافت نشد</p>
          <p className="text-sm text-muted-foreground mt-1">جزوات و فایل‌های آموزشی دوره‌ها را اینجا منتشر کنید</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const Icon = TYPE_ICONS[m.type];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background border rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{m.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <FiBookOpen className="h-3 w-3" /> {m.courseName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.studentId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] bg-purple-100 text-purple-700">
                        ارسال دانشجو: {db.getUserById(m.studentId)?.fullName || '—'}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-lg bg-muted/60">{TYPE_LABELS[m.type]}</span>
                  <span className="text-xs text-muted-foreground">{m.addedAt}</span>
                </div>

                <a
                  href={m.url === '#' ? undefined : m.url}
                  target={m.url === '#' ? undefined : '_blank'}
                  rel="noreferrer"
                  onClick={(e) => {
                    if (m.url === '#') {
                      e.preventDefault();
                      toast('لینک فایل هنوز توسط استاد بارگذاری نشده است');
                    }
                  }}
                  className={`mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    m.url === '#'
                      ? 'bg-muted/60 text-muted-foreground cursor-default'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <FiDownload className="h-4 w-4" />
                  دریافت فایل
                </a>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">افزودن جزوه</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">عنوان جزوه</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلا: جزوه گرامر درس ۴"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">دوره</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">انتخاب دوره...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">نوع فایل</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(TYPE_LABELS) as Material['type'][]).map((t) => {
                    const Icon = TYPE_ICONS[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs transition-colors ${
                          type === t ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {TYPE_LABELS[t]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">لینک فایل</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-left"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                افزودن جزوه
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
