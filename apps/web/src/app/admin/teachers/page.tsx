'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiBookOpen,
  FiMail,
  FiPhone,
  FiX,
  FiSave,
  FiAward,
  FiUsers as FiStudentIcon,
  FiEye,
  FiStar,
  FiCalendar,
  FiClock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type User } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ fullName: '', email: '', mobile: '', password: '' });

  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const teachers = useMemo(() => {
    initializeDB();
    return db.getUsers().filter((u) => u.role === 'teacher');
  }, []);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  if (!isAdmin) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>دسترسی این صفحه فقط برای مدیر است</p>
      </div>
    );
  }

  const getTeacherCourses = (teacherId: string) => db.getCoursesByTeacher(teacherId);

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.includes(searchQuery) ||
      t.email.includes(searchQuery) ||
      t.mobile.includes(searchQuery)
  );

  const handleDeleteTeacher = (teacherId: string, name: string) => {
    if (confirm(`آیا از حذف استاد ${name} مطمئن هستید؟`)) {
      db.deleteUser(teacherId);
      toast.success('استاد حذف شد');
    }
  };

  const handleAddTeacher = () => {
    if (!newTeacher.fullName || !newTeacher.email || !newTeacher.password) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    db.addUser({
      ...newTeacher,
      role: 'teacher',
      status: 'active',
      joinDate: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('استاد جدید اضافه شد');
    setShowAddModal(false);
    setNewTeacher({ fullName: '', email: '', mobile: '', password: '' });
  };

  const handleSaveEdit = () => {
    if (!editingTeacher) return;
    db.updateUser(editingTeacher.id, {
      fullName: editingTeacher.fullName,
      email: editingTeacher.email,
      mobile: editingTeacher.mobile,
    });
    toast.success('اطلاعات استاد به‌روزرسانی شد');
    setEditingTeacher(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اساتید</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {teachers.length} استاد فعال در آموزشگاه
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiUserPlus className="h-4 w-4" />
          استاد جدید
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="جستجوی نام، ایمیل یا موبایل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-9 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const teacherCourses = getTeacherCourses(teacher.id);
          const teacherStudents = db.getStudentsByTeacher(teacher.id);
          const teacherClasses = db.getScheduleByTeacher(teacher.id);
          return (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-xl p-4 bg-background hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiAward className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{teacher.fullName}</p>
                    <p className="text-xs text-muted-foreground">{teacher.mobile || teacher.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  استاد
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <FiBookOpen className="h-4 w-4 text-primary" />
                  <span>{teacherCourses.length} دوره</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <FiStudentIcon className="h-4 w-4 text-primary" />
                  <span>{teacherStudents.length} دانش‌آموز</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 col-span-2">
                  <FiCalendar className="h-4 w-4 text-green-500" />
                  <span>{teacherClasses.length} کلاس ({teacherClasses.map((c) => c.day).filter((d, i, a) => a.indexOf(d) === i).join('، ') || '—'})</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-1.5">
                  {teacherCourses.length > 0 ? (
                    teacherCourses.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                        <FiBookOpen className="h-3 w-3" />
                        {c.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">بدون دوره</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTeacher(teacher)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border hover:bg-muted transition-colors"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" /> ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" /> حذف
                  </button>
                </div>
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <FiEye className="h-4 w-4" /> جزئیات
                </button>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                عضویت: {teacher.joinDate}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>استادی یافت نشد</p>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">افزودن استاد جدید</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="نام و نام خانوادگی *"
                value={newTeacher.fullName}
                onChange={(e) => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder="ایمیل *"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="شماره موبایل"
                value={newTeacher.mobile}
                onChange={(e) => setNewTeacher({ ...newTeacher, mobile: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="password"
                placeholder="رمز عبور *"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddTeacher}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <FiSave className="h-4 w-4" /> ثبت استاد
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">ویرایش استاد</h2>
              <button onClick={() => setEditingTeacher(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={editingTeacher.fullName}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                value={editingTeacher.email}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                value={editingTeacher.mobile}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, mobile: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <FiSave className="h-4 w-4" /> ذخیره تغییرات
              </button>
              <button
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">جزئیات {selectedTeacher.fullName}</h2>
              <button onClick={() => setSelectedTeacher(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {(() => {
              const tc = db.getCoursesByTeacher(selectedTeacher.id);
              const ts = db.getStudentsByTeacher(selectedTeacher.id);
              const tClasses = db.getScheduleByTeacher(selectedTeacher.id);
              const tReviews = db.getReviewsByTeacher(selectedTeacher.id);
              const tHomework = db.getHomework().filter((h) => h.teacherId === selectedTeacher.id);
              const avgRating = tReviews.length > 0 ? (tReviews.reduce((s, r) => s + r.rating, 0) / tReviews.length).toFixed(1) : '—';
              const pendingHw = tHomework.filter((h) => h.status === 'pending').length;

              return (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiAward className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{selectedTeacher.fullName}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">{selectedTeacher.email} — {selectedTeacher.mobile}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-primary">{tc.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">دوره</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-primary">{ts.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">دانش‌آموز</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-yellow-500">{avgRating}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">میانگین امتیاز</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-orange-500">{pendingHw}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">تکلیف در انتظار</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-green-500" /> کلاس‌ها ({tClasses.length})
                    </h3>
                    {tClasses.length > 0 ? (
                      <div className="space-y-1.5">
                        {tClasses.map((cl) => (
                          <div key={cl.id} className="flex items-center justify-between p-2 rounded-lg border text-xs">
                            <span className="font-medium">{cl.courseName}</span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <FiClock className="h-3 w-3" />
                              {cl.day} {cl.time} — {cl.room}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">کلاسی ثبت نشده</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <FiBookOpen className="h-4 w-4 text-primary" /> دوره‌ها
                    </h3>
                    {tc.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tc.map((c) => (
                          <span key={c.id} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs">
                            {c.title} ({c.enrolledCount} ثبت‌نام)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">بدون دوره</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <FiStudentIcon className="h-4 w-4 text-primary" /> دانش‌آموزان
                    </h3>
                    {ts.length > 0 ? (
                      <div className="space-y-1.5">
                        {ts.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-2 rounded-lg border text-xs">
                            <span>{s.fullName}</span>
                            <span className="text-muted-foreground" dir="ltr">{s.mobile}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">بدون دانش‌آموز</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <FiStar className="h-4 w-4 text-yellow-500" /> نظرات ({tReviews.length})
                    </h3>
                    {tReviews.length > 0 ? (
                      <div className="space-y-1.5">
                        {tReviews.slice(0, 4).map((r) => (
                          <div key={r.id} className="p-2 rounded-lg border text-xs">
                            <span className="font-medium">{r.studentName}</span>
                            <span className="text-yellow-500"> ★{'★'.repeat(r.rating)}</span>
                            <p className="text-muted-foreground mt-0.5 line-clamp-1">{r.comment || '—'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">نظری ثبت نشده</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
}
