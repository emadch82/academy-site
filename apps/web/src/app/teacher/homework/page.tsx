'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit3,
  FiBookOpen,
  FiX,
  FiSend,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiStar,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function HomeworkPage() {
  const [courseId, setCourseId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [gradeComment, setGradeComment] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

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

  const allHomework = useMemo(() => {
    initializeDB();
    return db.getHomework();
  }, [refreshKey]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const selectedCourse = courses.find((c) => c.id === courseId);
  const students = courseId ? db.getStudentsByCourse(courseId) : [];

  const filteredHomework = allHomework
    .filter((h) => filterCourse === 'all' || h.courseId === filterCourse)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  const handleAssign = () => {
    if (!courseId || !studentId) {
      toast.error('دوره و دانش‌آموز را انتخاب کنید');
      return;
    }
    if (!title) {
      toast.error('عنوان تکلیف را وارد کنید');
      return;
    }

    const course = db.getCourseById(courseId)!;
    const student = db.getUserById(studentId)!;

    const homework = db.addHomework({
      title,
      description,
      courseId,
      courseName: course.title,
      teacherId: course.teacherId,
      teacherName: course.teacherName,
      studentId,
      studentName: student.fullName,
      dueDate: dueDate || 'بدون مهلت',
      status: 'pending',
    });

    if (notifyStudent) {
      db.addNotification({
        title: 'تکلیف جدید',
        message: `${course.teacherName} برای شما در دوره «${course.title}» تکلیف «${title}» ارسال کرد.`,
        type: 'info',
        target: 'individual',
        status: 'sent',
        recipientId: studentId,
        recipientName: student.fullName,
        link: '/profile',
        date: new Date().toLocaleDateString('fa-IR'),
      });
    }

    toast.success(`تکلیف برای ${student.fullName} ارسال شد`);
    setTitle('');
    setDescription('');
    setDueDate('');
    setStudentId('');
  };

  const openGrading = (h: any) => {
    setGradingId(h.id);
    setGradeValue(h.grade ? String(h.grade) : '');
    setGradeComment(h.comment || '');
  };

  const handleSaveGrade = () => {
    if (!gradingId) return;
    const grade = gradeValue ? Number(gradeValue) : undefined;
    if (gradeValue && (grade === undefined || isNaN(grade) || grade < 0 || grade > 20)) {
      toast.error('نمره باید بین ۰ تا ۲۰ باشد');
      return;
    }
    const hw = db.getHomework().find((h) => h.id === gradingId);
    if (!hw) return;
    db.updateHomework(gradingId, {
      status: 'graded',
      grade,
      comment: gradeComment,
    });
    db.addNotification({
      title: 'نمره تکلیف',
      message: `تکلیف «${hw.title}» تصحیح شد${gradeValue ? ` — نمره: ${gradeValue}` : ''}${gradeComment ? ` — نظر استاد: ${gradeComment}` : ''}.`,
      type: 'success',
      target: 'individual',
      status: 'sent',
      recipientId: hw.studentId,
      recipientName: hw.studentName,
      link: '/profile',
      date: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('نمره تکلیف ثبت شد');
    setGradingId(null);
    setGradeValue('');
    setGradeComment('');
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`آیا از حذف تکلیف «${title}» مطمئن هستید؟`)) {
      db.deleteHomework(id);
      toast.success('تکلیف حذف شد');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
            <FiStar className="h-3 w-3" /> تصحیح شده
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            <FiCheckCircle className="h-3 w-3" /> تحویل شده
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
            <FiClock className="h-3 w-3" /> در انتظار
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تکالیف</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ارسال تکلیف به دانش‌آموزان و پیگیری وضعیت آن‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assign form */}
        <div className="border rounded-xl p-5 bg-background h-fit">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <FiEdit3 className="h-5 w-5 text-primary" />
            تکلیف جدید
          </h2>
          <div className="space-y-3">
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setStudentId('');
              }}
              className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">انتخاب دوره...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.teacherName}
                </option>
              ))}
            </select>

            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={!courseId}
              className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="">انتخاب دانش‌آموز...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="عنوان تکلیف *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <textarea
              placeholder="توضیحات تکلیف..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />

            <input
              type="text"
              placeholder="مهلت تحویل (مثلاً ۱۴۰۵/۰۵/۲۰)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyStudent}
                onChange={(e) => setNotifyStudent(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              اطلاع‌رسانی به دانش‌آموز
            </label>

            <button
              onClick={handleAssign}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiSend className="h-4 w-4" />
              ارسال تکلیف
            </button>
          </div>
        </div>

        {/* Homework list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-bold">
              <FiBookOpen className="h-5 w-5 text-primary" />
              تکالیف ثبت‌شده ({filteredHomework.length})
            </h2>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-3 py-1.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">همه دوره‌ها</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {filteredHomework.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-xl">
              <FiEdit3 className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">تکلیفی ثبت نشده است</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pl-1">
              {filteredHomework.map((h) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-4 bg-background"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{h.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {h.studentName} — {h.courseName}
                      </p>
                      {h.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{h.description}</p>
                      )}
                      {h.status === 'graded' && h.comment && (
                        <div className="mt-2 bg-purple-50 text-purple-800 rounded-lg p-2.5 text-xs">
                          <p className="font-bold mb-0.5">نظر استاد:</p>
                          <p>{h.comment}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {getStatusBadge(h.status)}
                      {h.status === 'graded' && h.grade !== undefined && (
                        <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                          نمره: {h.grade}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs">
                    <span className="text-muted-foreground">
                      مهلت: {h.dueDate} — {h.createdAt}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {h.status === 'submitted' && (
                        <button
                          onClick={() => openGrading(h)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          <FiStar className="h-3 w-3" />
                          تصحیح و نمره
                        </button>
                      )}
                      {h.status === 'graded' && (
                        <button
                          onClick={() => openGrading(h)}
                          className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          ویرایش نمره
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(h.id, h.title)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grading Modal */}
      {gradingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-bold">
                <FiStar className="h-5 w-5 text-primary" />
                تصحیح تکلیف
              </h2>
              <button onClick={() => setGradingId(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">نمره (۰ تا ۲۰)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step="0.5"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="مثلاً ۱۸"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">نظر استاد</label>
                <textarea
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  rows={3}
                  placeholder="بازخورد خود را بنویسید..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveGrade}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <FiCheckCircle className="h-4 w-4" /> ثبت نمره
              </button>
              <button onClick={() => setGradingId(null)} className="px-4 py-2 border rounded-lg hover:bg-muted">
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
