'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBookOpen,
  FiCalendar,
  FiMail,
  FiPhone,
  FiX,
  FiSave,
  FiEye,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type User } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ fullName: '', email: '', mobile: '', password: '' });
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const students = useMemo(() => {
    initializeDB();
    const all = db.getUsers().filter((u) => u.role === 'student');
    if (teacherId) {
      const ids = new Set(db.getStudentsByTeacher(teacherId).map((s) => s.id));
      return all.filter((s) => ids.has(s.id));
    }
    return all;
  }, [teacherId]);

  const courses = useMemo(() => {
    initializeDB();
    const all = db.getCourses();
    if (teacherId) {
      const ids = new Set(db.getCoursesByTeacher(teacherId).map((c) => c.id));
      return all.filter((c) => ids.has(c.id));
    }
    return all;
  }, [teacherId]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const getStudentCourses = (studentId: string) => {
    const enrollments = db.getEnrollments().filter((e) => e.studentId === studentId && e.status !== 'cancelled');
    return courses.filter((c) => enrollments.some((e) => e.courseId === c.id));
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.includes(searchQuery) ||
      student.email.includes(searchQuery) ||
      student.mobile.includes(searchQuery);
    const matchesCourse =
      courseFilter === 'all' || getStudentCourses(student.id).some((c) => c.id === courseFilter);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleStatusChange = (studentId: string, newStatus: User['status']) => {
    db.updateUser(studentId, { status: newStatus });
    toast.success('وضعیت دانش‌آموز تغییر کرد');
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (confirm(`آیا از حذف ${name} مطمئن هستید؟`)) {
      db.deleteUser(studentId);
      toast.success('دانش‌آموز حذف شد');
    }
  };

  const handleAddStudent = () => {
    if (!newStudent.fullName || !newStudent.email || !newStudent.password) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    db.addUser({
      ...newStudent,
      role: 'student',
      status: 'active',
      joinDate: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('دانش‌آموز جدید اضافه شد');
    setShowAddModal(false);
    setNewStudent({ fullName: '', email: '', mobile: '', password: '' });
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;
    db.updateUser(editingStudent.id, {
      fullName: editingStudent.fullName,
      email: editingStudent.email,
      mobile: editingStudent.mobile,
    });
    toast.success('اطلاعات دانش‌آموز به‌روزرسانی شد');
    setEditingStudent(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <FiCheckCircle className="h-3 w-3" /> فعال
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <FiXCircle className="h-3 w-3" /> غیرفعال
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <FiClock className="h-3 w-3" /> در انتظار
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'مدیریت دانش‌آموزان' : 'دانش‌آموزان من'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredStudents.length} دانش‌آموز از {students.length} ثبت‌شده
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiUserPlus className="h-4 w-4" />
            دانش‌آموز جدید
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل یا موبایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
        >
          <option value="all">همه دوره‌ها</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="pending">در انتظار</option>
        </select>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const studentCourses = getStudentCourses(student.id);
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-xl p-4 bg-background hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiUsers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.mobile || student.email}</p>
                  </div>
                </div>
                {getStatusBadge(student.status)}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {studentCourses.length > 0 ? (
                  studentCourses.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      <FiBookOpen className="h-3 w-3" />
                      {c.title}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">بدون دوره ثبت‌نامی</span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border hover:bg-muted transition-colors"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" /> ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.fullName)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <FiEye className="h-4 w-4" /> جزئیات
                </button>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>عضویت: {student.joinDate}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleStatusChange(student.id, student.status === 'active' ? 'inactive' : 'active')}
                    className="text-xs text-primary hover:underline"
                  >
                    {student.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FiUsers className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>دانش‌آموزی یافت نشد</p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">افزودن دانش‌آموز جدید</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="نام و نام خانوادگی *"
                value={newStudent.fullName}
                onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder="ایمیل *"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="شماره موبایل"
                value={newStudent.mobile}
                onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="password"
                placeholder="رمز عبور *"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddStudent}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <FiSave className="h-4 w-4" /> ثبت دانش‌آموز
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

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">ویرایش دانش‌آموز</h2>
              <button onClick={() => setEditingStudent(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={editingStudent.fullName}
                onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                value={editingStudent.mobile}
                onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
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
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">جزئیات {selectedStudent.fullName}</h2>
              <button onClick={() => setSelectedStudent(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FiMail className="h-4 w-4 text-muted-foreground" />
                  <span dir="ltr" className="text-xs">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FiPhone className="h-4 w-4 text-muted-foreground" />
                  <span dir="ltr" className="text-xs">{selectedStudent.mobile}</span>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold mb-2">
                  <FiBookOpen className="h-4 w-4 text-primary" /> دوره‌های ثبت‌نامی
                </h3>
                {(() => {
                  const sc = getStudentCourses(selectedStudent.id);
                  return sc.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sc.map((c) => (
                        <span key={c.id} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs">
                          {c.title} — {c.teacherName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">بدون دوره</p>
                  );
                })()}
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold mb-2">
                  <FiCalendar className="h-4 w-4 text-primary" /> حاضری و غیاب اخیر
                </h3>
                {(() => {
                  const attendance = db
                    .getAttendance()
                    .filter((a) => a.studentId === selectedStudent.id)
                    .sort((a, b) => (b.date > a.date ? 1 : -1))
                    .slice(0, 5);
                  if (attendance.length === 0) {
                    return <p className="text-muted-foreground text-xs">بدون رکورد حضور</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {attendance.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-2 border rounded-lg text-xs">
                          <span>{a.date}</span>
                          <span>{db.getCourseById(a.courseId)?.title || a.courseId}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              a.status === 'present'
                                ? 'bg-green-100 text-green-700'
                                : a.status === 'late'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {a.status === 'present' ? 'حاضر' : a.status === 'late' ? 'تأخیر' : 'غایب'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold mb-2">
                  <FiEdit2 className="h-4 w-4 text-primary" /> تکالیف اخیر
                </h3>
                {(() => {
                  const homework = db
                    .getHomeworkByStudent(selectedStudent.id)
                    .slice(0, 5);
                  if (homework.length === 0) {
                    return <p className="text-muted-foreground text-xs">بدون تکلیف</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {homework.map((h) => (
                        <div key={h.id} className="flex items-center justify-between p-2 border rounded-lg text-xs">
                          <span>{h.title}</span>
                          <span>مهلت: {h.dueDate}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              h.status === 'graded'
                                ? 'bg-purple-100 text-purple-700'
                                : h.status === 'submitted'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {h.status === 'graded' ? 'تصحیح شده' : h.status === 'submitted' ? 'تحویل داده شده' : 'در انتظار'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
