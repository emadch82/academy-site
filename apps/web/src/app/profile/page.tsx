'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiBookOpen,
  FiEdit3,
  FiCalendar,
  FiGrid,
  FiBell,
  FiMessageCircle,
  FiFileText,
  FiZap,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiDollarSign,
  FiShoppingBag,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAward,
  FiUserX,
  FiDownload,
  FiYoutube,
  FiLink,
  FiFile,
  FiX,
  FiUpload,
  FiPlus,
  FiAlertCircle,
} from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB, todayFa } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useInvoices } from '@/contexts/invoice-context';
import { formatPrice } from '@/lib/courses-data';
import toast from 'react-hot-toast';

type Tab = 'courses' | 'homework' | 'attendance' | 'invoices' | 'reviews' | 'quiz' | 'appointments' | 'leave' | 'materials' | 'certificates' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'courses', label: 'دوره‌های من', icon: FiBookOpen },
  { id: 'homework', label: 'تکالیف', icon: FiEdit3 },
  { id: 'quiz', label: 'آزمون‌ها', icon: FiAward },
  { id: 'attendance', label: 'حاضری و غیاب', icon: FiCalendar },
  { id: 'materials', label: 'جزوات', icon: FiFileText },
  { id: 'appointments', label: 'رزرو کلاس', icon: FiClock },
  { id: 'leave', label: 'غیبت موجه', icon: FiUserX },
  { id: 'certificates', label: 'گواهینامه‌ها', icon: FiAward },
  { id: 'invoices', label: 'فاکتورها', icon: FiDollarSign },
  { id: 'reviews', label: 'نظرات من', icon: FiStar },
  { id: 'settings', label: 'پروفایل', icon: FiUser },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('courses');
  const { invoices } = useInvoices();
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [leaveCourseId, setLeaveCourseId] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [apptTeacherId, setApptTeacherId] = useState('');
  const [apptCourseId, setApptCourseId] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [apptSessions, setApptSessions] = useState(1);
  const [absentNoteId, setAbsentNoteId] = useState<string | null>(null);
  const [absentNoteText, setAbsentNoteText] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matCourseId, setMatCourseId] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'video' | 'link' | 'file'>('pdf');
  const [matUrl, setMatUrl] = useState('');

  const user = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = Cookies.get('amz_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; name: string; identifier: string; role: string };
    } catch {
      return null;
    }
  }, []);

  const data = useMemo(() => {
    initializeDB();
    if (!user?.id) return null;
    return {
      userInfo: db.getUserById(user.id),
      enrollments: db.getEnrollmentsByStudent(user.id).filter((e) => e.status !== 'cancelled'),
      homework: db.getHomeworkByStudent(user.id),
      attendance: db.getAttendanceByStudent(user.id).sort((a, b) => (b.date > a.date ? 1 : -1)),
      transactions: db.getTransactionsByUser(user.id),
      reviews: db.getReviewsByStudent(user.id),
      quizzes: db
        .getQuizzes()
        .filter((q) =>
          db
            .getEnrollmentsByStudent(user.id)
            .some((e) => e.courseId === q.courseId && e.status !== 'cancelled')
        ),
      attempts: db.getAttemptsByStudent(user.id),
      appointments: db.getAppointmentsByStudent(user.id),
      leaveRequests: db.getLeaveRequestsByStudent(user.id),
      materials: db
        .getMaterials()
        .filter((m) =>
          db
            .getEnrollmentsByStudent(user.id)
            .some((e) => e.courseId === m.courseId && e.status !== 'cancelled')
        ),
      certificates: db.getCertificatesByStudent(user.id),
      teachers: db.getUsers().filter((u) => u.role === 'teacher'),
    };
  }, [user, refreshKey]);

  const submitHomework = (id: string) => {
    db.updateHomework(id, { status: 'submitted' });
    toast.success('تکلیف با موفقیت تحویل داده شد');
    setRefreshKey((k) => k + 1);
  };

  const handleAddMaterial = () => {
    if (!user?.id) return;
    const course = db.getCourseById(matCourseId);
    if (!matTitle.trim() || !course) {
      toast.error('عنوان جزوه و دوره را وارد کنید');
      return;
    }
    db.addMaterialByStudent({
      courseId: course.id,
      courseName: course.title,
      teacherId: course.teacherId || '',
      studentId: user.id,
      title: matTitle.trim(),
      type: matType,
      url: matUrl.trim() || '#',
      addedAt: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('جزوه شما ارسال شد');
    setShowMaterialModal(false);
    setMatTitle('');
    setMatCourseId('');
    setMatUrl('');
    setMatType('pdf');
    setRefreshKey((k) => k + 1);
  };

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  if (!user || !data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ابتدا وارد شوید</h1>
          <p className="text-muted-foreground mb-8">برای مشاهده پنل دانشجویی، ابتدا وارد حساب خود شوید.</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90">
            ورود به حساب
          </Link>
        </div>
      </main>
    );
  }

  const pendingHomework = data.homework.filter((h) => h.status === 'pending').length;
  const presentCount = data.attendance.filter((a) => a.status === 'present').length;

  const handleSaveProfile = () => {
    if (fullName.trim().length < 3) {
      toast.error('نام و نام خانوادگی حداقل ۳ حرف باشد');
      return;
    }
    db.updateUser(user.id, { fullName: fullName.trim() });
    if (email.trim()) db.updateUser(user.id, { email: email.trim() });
    if (mobile.trim()) db.updateUser(user.id, { mobile: mobile.trim() });
    Cookies.set(
      'amz_user',
      JSON.stringify({ ...user, name: fullName.trim() }),
      { path: '/', expires: 7 }
    );
    toast.success('اطلاعات پروفایل ذخیره شد');
    setRefreshKey((k) => k + 1);
  };

  const handleChangePassword = () => {
    if (!data.userInfo) return;
    if (data.userInfo.password !== currentPassword) {
      toast.error('رمز عبور فعلی اشتباه است');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('رمز جدید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('تکرار رمز جدید مطابقت ندارد');
      return;
    }
    db.updateUser(user.id, { password: newPassword });
    toast.success('رمز عبور با موفقیت تغییر کرد');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const addLeaveRequest = () => {
    const course = db.getCourseById(leaveCourseId);
    if (!course || !leaveDate || !leaveReason.trim()) {
      toast.error('دوره، تاریخ و دلیل را وارد کنید');
      return;
    }
    const isToday = leaveDate === todayFa();
    db.addLeaveRequest({
      studentId: user.id,
      studentName: data.userInfo?.fullName || user.name,
      teacherId: course.teacherId,
      courseId: course.id,
      courseName: course.title,
      date: leaveDate,
      reason: leaveReason.trim(),
      status: 'pending',
      isToday,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    });
    db.addNotification({
      title: isToday ? 'غیبت امروز اعلام شد' : 'درخواست غیبت موجه جدید',
      message: `${user.name} ${isToday ? 'اعلام کرد امروز نمی‌تواند در کلاس «' + course.title + '» حاضر شود.' : 'درخواست غیبت موجه برای ' + leaveDate + ' در دوره «' + course.title + '» ثبت کرد.'}`,
      type: 'info',
      target: 'individual',
      recipientId: course.teacherId,
      status: 'sent',
      date: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('درخواست غیبت ثبت شد و به استاد اطلاع داده شد');
    setLeaveCourseId('');
    setLeaveDate('');
    setLeaveReason('');
    setRefreshKey((k) => k + 1);
  };

  const saveAbsenceNote = () => {
    if (!absentNoteId) return;
    db.updateAttendance(absentNoteId, { absenceReason: absentNoteText.trim() });
    toast.success('دلیل غیبت برای استاد ارسال شد');
    setAbsentNoteId(null);
    setAbsentNoteText('');
    setRefreshKey((k) => k + 1);
  };

  const addAppointment = () => {
    if (!apptTeacherId || !apptDate || !apptTime || !apptReason.trim()) {
      toast.error('استاد، تاریخ، ساعت و موضوع را وارد کنید');
      return;
    }
    const teacher = db.getUserById(apptTeacherId);
    if (!teacher) return;
    const course = db.getCourseById(apptCourseId);
    db.addAppointment({
      studentId: user.id,
      studentName: data.userInfo?.fullName || user.name,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      courseId: course?.id || '',
      courseName: course?.title || '—',
      date: apptDate,
      time: apptTime,
      reason: apptReason.trim(),
      status: 'pending',
      sessions: Math.max(1, apptSessions),
      attendedCount: 0,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    });
    db.addNotification({
      title: 'درخواست رزرو کلاس جدید',
      message: `${user.name} جلسه کلاس ${apptDate} ساعت ${apptTime} با شما رزرو کرد.`,
      type: 'info',
      target: 'individual',
      recipientId: teacher.id,
      status: 'sent',
      date: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('رزرو کلاس ثبت شد و به استاد اطلاع داده شد');
    setApptTeacherId('');
    setApptCourseId('');
    setApptDate('');
    setApptTime('');
    setApptReason('');
    setRefreshKey((k) => k + 1);
  };

  const addReview = (courseId: string, courseName: string, rating: number, comment: string) => {
    const existing = db.getReviewsByStudent(user.id).find((r) => r.courseId === courseId);
    if (existing) {
      const items = db.getCollection<any>('reviews').map((r: any) =>
        r.id === existing.id ? { ...r, rating, comment } : r
      );
      db.setCollection('reviews', items);
      toast.success('نظر شما به‌روزرسانی شد');
    } else {
      db.addReview({
        courseId,
        courseName,
        studentId: user.id,
        studentName: data.userInfo?.fullName || user.name,
        rating,
        comment,
        date: new Date().toLocaleDateString('fa-IR'),
      });
      toast.success('نظر شما ثبت شد');
    }
    setRefreshKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-primary/10 to-secondary/10 border rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shrink-0">
              {user.name?.charAt(0) || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{data.userInfo?.fullName || user.name}</h1>
              <p className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-3">
                <span className="flex items-center gap-1"><FiMail className="h-3.5 w-3.5" /> {data.userInfo?.email || user.identifier}</span>
                <span className="flex items-center gap-1"><FiPhone className="h-3.5 w-3.5" /> {data.userInfo?.mobile || '—'}</span>
                <span className="flex items-center gap-1"><FiUser className="h-3.5 w-3.5" /> عضویت: {data.userInfo?.joinDate}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-background/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{data.enrollments.length}</p>
              <p className="text-xs text-muted-foreground mt-1">دوره فعال</p>
            </div>
            <div className="bg-background/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pendingHomework}</p>
              <p className="text-xs text-muted-foreground mt-1">تکلیف در انتظار</p>
            </div>
            <div className="bg-background/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">روز حضور</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'کیف پول', href: '/wallet', icon: FiGrid },
            { label: 'اعلان‌ها', href: '/notifications', icon: FiBell },
            { label: 'چت پشتیبانی', href: '/chat', icon: FiMessageCircle },
            { label: 'گواهینامه‌ها', href: '/certificates', icon: FiFileText },
            { label: 'پیشنهادات', href: '/suggestions', icon: FiZap },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center gap-2 bg-background border rounded-xl py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-background border hover:border-primary/50'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Courses */}
          {tab === 'courses' && (
            <>
              {data.enrollments.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold mb-2">هنوز دوره‌ای ثبت‌نام نکرده‌اید</p>
                  <p className="text-sm text-muted-foreground mb-6">دوره‌های ما را ببینید و شروع به یادگیری کنید</p>
                  <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                    مشاهده دوره‌ها
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                    {[
                      { label: 'دوره‌های من', value: db.getStudentStats(user.id).enrolledCourses.toString(), icon: FiBookOpen, color: 'text-primary' },
                      { label: 'نرخ حضور', value: `${db.getStudentStats(user.id).attendanceRate}٪`, icon: FiCalendar, color: 'text-green-600' },
                      { label: 'تکالیف در انتظار', value: db.getStudentStats(user.id).pendingHomework.toString(), icon: FiEdit3, color: 'text-orange-500' },
                      { label: 'رزرو در انتظار', value: db.getStudentStats(user.id).pendingAppointments.toString(), icon: FiClock, color: 'text-purple-500' },
                      { label: 'معدل آزمون', value: (db.getStudentStats(user.id).avgQuizScore || '—').toString(), icon: FiAward, color: 'text-yellow-500' },
                      { label: 'جزوات من', value: db.getStudentStats(user.id).totalMaterials.toString(), icon: FiFileText, color: 'text-blue-500' },
                    ].map((s) => (
                      <div key={s.label} className="bg-background border rounded-xl p-4 text-center">
                        <s.icon className={`h-4 w-4 mx-auto mb-2 ${s.color}`} />
                        <p className="text-lg font-bold">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.enrollments.map((e) => {
                      const course = db.getCourseById(e.courseId);
                      return (
                        <div key={e.id} className="bg-background border rounded-xl p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <FiBookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              <FiCheckCircle className="h-3 w-3" /> فعال
                            </span>
                          </div>
                          <h3 className="font-bold">{e.courseName}</h3>
                          <p className="text-xs text-muted-foreground mt-1">استاد: {course?.teacherName || '—'}</p>
                          <p className="text-xs text-muted-foreground mt-1">سطح: {course?.level || '—'} — {course?.duration || ''}</p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <span className="text-xs text-muted-foreground">ثبت‌نام: {e.date}</span>
                          {course ? (
                            <Link href={`/courses/${course.id}`} className="text-xs text-primary hover:underline">جزئیات دوره</Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </>
              )}
            </>
          )}

          {/* Homework */}
          {tab === 'homework' && (
            <>
              {data.homework.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiEdit3 className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">تکلیفی برای شما ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.homework.map((h) => (
                    <div key={h.id} className="bg-background border rounded-xl p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold">{h.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {h.courseName} — استاد: {h.teacherName}
                          </p>
                          {h.description && (
                            <p className="text-sm text-muted-foreground mt-2">{h.description}</p>
                          )}
                          {h.status === 'graded' && h.comment && (
                            <div className="mt-3 bg-purple-50 text-purple-800 rounded-xl p-3 text-sm">
                              <p className="font-bold mb-1">نظر استاد:</p>
                              <p>{h.comment}</p>
                            </div>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs shrink-0 ${
                            h.status === 'graded'
                              ? 'bg-purple-100 text-purple-700'
                              : h.status === 'submitted'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {h.status === 'graded' ? (
                            <><FiStar className="h-3 w-3" /> {h.grade ? `نمره: ${h.grade}` : 'تصحیح شده'}</>
                          ) : h.status === 'submitted' ? (
                            <><FiCheckCircle className="h-3 w-3" /> تحویل شده</>
                          ) : (
                            <><FiClock className="h-3 w-3" /> در انتظار</>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                        <span>مهلت: {h.dueDate}</span>
                        <div className="flex items-center gap-2">
                          <span>ارسال: {h.createdAt}</span>
                          {h.status === 'pending' && (
                            <button
                              onClick={() => submitHomework(h.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                            >
                              <FiCheckCircle className="h-3.5 w-3.5" />
                              تحویل تکلیف
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Attendance */}
          {tab === 'attendance' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="bg-background border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">نرخ حضور</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    {db.getStudentStats(user.id).attendanceRate}٪
                  </p>
                </div>
                <div className="bg-background border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">جلسات ثبت‌شده</p>
                  <p className="text-2xl font-bold mt-1">
                    {db.getStudentStats(user.id).totalAttendance}
                  </p>
                </div>
                <div className="bg-background border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">حضورها</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    {db.getStudentStats(user.id).presentCount}
                  </p>
                </div>
                <div className="bg-background border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">معدل آزمون‌ها</p>
                  <p className="text-2xl font-bold mt-1 text-primary">
                    {db.getStudentStats(user.id).avgQuizScore || '—'}
                  </p>
                </div>
              </div>
              {data.attendance.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiCalendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">رکوردی از حضور شما ثبت نشده است</p>
                </div>
              ) : (
                <div className="bg-background border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-right px-5 py-3 font-medium">تاریخ</th>
                          <th className="text-right px-5 py-3 font-medium">دوره</th>
                          <th className="text-right px-5 py-3 font-medium">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.attendance.map((a) => (
                          <tr key={a.id} className="border-t align-top">
                            <td className="px-5 py-3 whitespace-nowrap">{a.date}</td>
                            <td className="px-5 py-3">{db.getCourseById(a.courseId)?.title || '—'}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                                    a.status === 'present'
                                      ? 'bg-green-100 text-green-700'
                                      : a.status === 'late'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {a.status === 'present' && <><FiCheckCircle className="h-3 w-3" /> حاضر</>}
                                  {a.status === 'late' && <><FiClock className="h-3 w-3" /> تأخیر</>}
                                  {a.status === 'absent' && <><FiXCircle className="h-3 w-3" /> غایب</>}
                                </span>
                                {a.status === 'absent' && (
                                  a.absenceReason ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-orange-600 bg-orange-50 rounded-full px-2.5 py-1">
                                      <FiMessageCircle className="h-3 w-3" /> دلیل: {a.absenceReason}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setAbsentNoteId(a.id);
                                        setAbsentNoteText('');
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                                    >
                                      <FiEdit3 className="h-3 w-3" /> نوشتن دلیل غیبت
                                    </button>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Invoices */}
          {tab === 'invoices' && (
            <>
              {invoices.length === 0 && data.transactions.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiDollarSign className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">خریدی ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="bg-background border rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">سفارش {inv.orderId}</p>
                          <p className="text-xs text-muted-foreground mt-1">{inv.date} — {inv.paymentMethod === 'online' ? 'پرداخت آنلاین' : inv.paymentMethod === 'wallet' ? 'کیف پول' : 'نقدی'}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-primary">{formatPrice(inv.total)}</p>
                          {inv.discount > 0 && (
                            <p className="text-xs text-green-600">تخفیف: {formatPrice(inv.discount)}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t space-y-1">
                        {inv.items.map((it, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            {it.title} — {formatPrice(it.price)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Reviews */}
          {tab === 'reviews' && (
            <>
              {data.enrollments.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiStar className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">برای ثبت نظر، ابتدا در یک دوره ثبت‌نام کنید</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.enrollments.map((e) => {
                    const existing = data.reviews.find((r) => r.courseId === e.courseId);
                    return (
                      <ReviewCard
                        key={e.courseId}
                        courseId={e.courseId}
                        courseName={e.courseName}
                        initialRating={existing?.rating || 0}
                        initialComment={existing?.comment || ''}
                        submitted={!!existing}
                        onSubmit={(rating, comment) => addReview(e.courseId, e.courseName, rating, comment)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Quizzes */}
          {tab === 'quiz' && (
            <>
              {data.quizzes.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">آزمونی برای دوره‌های شما تعریف نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.quizzes.map((quiz) => {
                    const attempts = data.attempts.filter((a) => a.quizId === quiz.id);
                    const last = attempts.length > 0 ? attempts[attempts.length - 1] : null;
                    const best = attempts.length > 0
                      ? Math.max(...attempts.map((a) => (a.maxScore > 0 ? a.score / a.maxScore : 0)))
                      : 0;
                    return (
                      <div key={quiz.id} className="bg-background border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{quiz.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {quiz.courseName} — {quiz.questions.length} سوال — {quiz.duration} دقیقه
                          </p>
                          {last ? (
                            <p className="text-xs mt-2">
                              آخرین نتیجه: <span className={`font-bold ${last.score / last.maxScore >= 0.7 ? 'text-green-600' : last.score / last.maxScore >= 0.4 ? 'text-yellow-600' : 'text-red-500'}`}>{last.score} / {last.maxScore}</span>
                              {' '}— بهترین: <span className="font-bold text-primary">{Math.round(best * 100)}٪</span>
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-2">هنوز شرکت نکرده‌اید</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setActiveQuiz(quiz);
                            setQuizAnswers(new Array(quiz.questions.length).fill(-1));
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          <FiEdit3 className="h-4 w-4" />
                          {last ? 'آزمون مجدد' : 'شرکت در آزمون'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Appointments */}
          {tab === 'appointments' && (
            <div className="space-y-6">
              <div className="bg-background border rounded-2xl p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-primary" /> رزرو جلسه کلاس
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">استاد</label>
                    <select
                      value={apptTeacherId}
                      onChange={(e) => {
                        setApptTeacherId(e.target.value);
                        setApptCourseId('');
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">انتخاب استاد...</option>
                      {data.teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.fullName}</option>
                      ))}
                    </select>
                    {apptTeacherId && (
                      <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                        <p className="text-xs font-medium text-primary mb-2">برنامه کلاس‌های هفتگی استاد:</p>
                        {db.getSchedule().filter((s) => s.teacherId === apptTeacherId).length === 0 ? (
                          <p className="text-xs text-muted-foreground">برنامه‌ای ثبت نشده است</p>
                        ) : (
                          <div className="space-y-1">
                            {db.getSchedule()
                              .filter((s) => s.teacherId === apptTeacherId)
                              .sort((a, b) => ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].indexOf(a.day) - ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].indexOf(b.day))
                              .map((s) => (
                                <p key={s.id} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <FiCalendar className="h-3 w-3 text-primary" /> {s.day} — {s.time} <span className="opacity-60">({s.courseName})</span>
                                </p>
                              ))}
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-2">
                          اگر زمان متفاوتی مدنظر دارید، تاریخ و ساعت دلخواه را انتخاب و درخواست دهید.
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">دوره</label>
                    <select
                      value={apptCourseId}
                      onChange={(e) => setApptCourseId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">انتخاب دوره (اختیاری)...</option>
                      {data.enrollments.map((e) => (
                        <option key={e.courseId} value={e.courseId}>{e.courseName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">تاریخ</label>
                    <input
                      type="date"
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">ساعت</label>
                    <input
                      type="time"
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">تعداد جلسات</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={apptSessions}
                      onChange={(e) => setApptSessions(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">این کلاس چند جلسه برگزار می‌شود؟</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1 block">موضوع کلاس</label>
                    <textarea
                      value={apptReason}
                      onChange={(e) => setApptReason(e.target.value)}
                      rows={2}
                      placeholder="موضوع جلسه کلاس..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addAppointment}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  ثبت رزرو کلاس
                </button>
              </div>

              {data.appointments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold">رزروهای من</h3>
                  {data.appointments.map((ap) => (
                    <div key={ap.id} className="bg-background border rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{ap.teacherName} <span className="text-muted-foreground">— {ap.courseName}</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" /> {ap.date}</span>
                            <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {ap.time}</span>
                            <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" /> {(ap as any).sessions || 1} جلسه</span>
                          </p>
                          {ap.reason && <p className="text-xs text-muted-foreground mt-1">{ap.reason}</p>}
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            ap.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700'
                              : ap.status === 'approved'
                              ? 'bg-blue-50 text-blue-700'
                              : ap.status === 'rejected'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {ap.status === 'pending' ? 'در انتظار تایید' : ap.status === 'approved' ? 'تایید شده' : ap.status === 'rejected' ? 'رد شده' : 'انجام شده'}
                        </span>
                      </div>
                      {ap.status === 'approved' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span>جلسات برگزارشده</span>
                            <span>{(ap as any).attendedCount || 0} از {(ap as any).sessions || 1}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(100, Math.round((((ap as any).attendedCount || 0) / ((ap as any).sessions || 1)) * 100))}%` }}
                            />
                          </div>
                          {((ap as any).attendedCount || 0) >= ((ap as any).sessions || 1) && (
                            <p className="mt-3 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                              تعداد جلسات این کلاس به پایان رسید — دوره شما تمام شده است.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leave Requests */}
          {tab === 'leave' && (
            <div className="space-y-6">
              <div className="bg-background border rounded-2xl p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <FiUserX className="h-4 w-4 text-primary" /> درخواست غیبت موجه
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">دوره</label>
                    <select
                      value={leaveCourseId}
                      onChange={(e) => setLeaveCourseId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">انتخاب دوره...</option>
                      {data.enrollments.map((e) => (
                        <option key={e.courseId} value={e.courseId}>{e.courseName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">تاریخ غیبت</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={leaveDate}
                        onChange={(e) => setLeaveDate(e.target.value)}
                        placeholder="مثلاً ۱۴۰۵/۰۵/۱۵"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        onClick={() => setLeaveDate(todayFa())}
                        className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors shrink-0"
                        type="button"
                      >
                        امروز
                      </button>
                    </div>
                    {leaveDate === todayFa() && (
                      <p className="text-[11px] text-primary mt-1.5">امروز نمی‌توانید سر کلاس حاضر شوید؟ استاد در جریان قرار می‌گیرد.</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1 block">دلیل غیبت</label>
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      rows={2}
                      placeholder="دلیل غیبت خود را توضیح دهید..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addLeaveRequest}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  ثبت درخواست
                </button>
              </div>

              {data.leaveRequests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold">درخواست‌های من</h3>
                  {data.leaveRequests.map((l) => (
                    <div key={l.id} className="bg-background border rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{l.courseName} <span className="text-muted-foreground">— {l.date}</span></p>
                        <p className="text-xs text-muted-foreground mt-1">{l.reason}</p>
                        {(l as any).isToday && (
                          <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                            <FiAlertCircle className="h-3 w-3" /> غیبت امروز — به استاد اطلاع داده شد
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          l.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : l.status === 'approved'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {l.status === 'pending' ? 'در انتظار بررسی' : l.status === 'approved' ? 'تایید شده' : 'رد شده'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Materials */}
          {tab === 'materials' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <FiFileText className="h-5 w-5 text-primary" /> جزوه‌های دوره‌ها
                </h2>
                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="h-4 w-4" /> آپلود جزوه
                </button>
              </div>
              {data.materials.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiFileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">جزوه‌ای برای دوره‌های شما منتشر نشده است</p>
                  <p className="text-sm text-muted-foreground mt-1">با دکمه بالا جزوه خود را برای استاد ارسال کنید</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.materials.map((m) => (
                    <div key={m.id} className="bg-background border rounded-2xl p-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          {m.type === 'pdf' ? <FiFileText className="h-5 w-5 text-primary" /> : m.type === 'video' ? <FiYoutube className="h-5 w-5 text-primary" /> : m.type === 'link' ? <FiLink className="h-5 w-5 text-primary" /> : <FiFile className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{m.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {m.courseName} — {m.type === 'pdf' ? 'جزوه PDF' : m.type === 'video' ? 'ویدیو' : m.type === 'link' ? 'لینک' : 'فایل'} — {m.addedAt}
                            {m.studentId && <span className="text-primary"> — ارسال شما</span>}
                          </p>
                        </div>
                      </div>
                      <a
                        href={m.url === '#' ? undefined : m.url}
                        target={m.url === '#' ? undefined : '_blank'}
                        rel="noreferrer"
                        onClick={(e) => {
                          if (m.url === '#') {
                            e.preventDefault();
                            toast('فایل هنوز بارگذاری نشده است');
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          m.url === '#'
                            ? 'bg-muted/60 text-muted-foreground'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        <FiDownload className="h-4 w-4" />
                        دریافت
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Certificates */}
          {tab === 'certificates' && (
            <>
              {data.certificates.length === 0 ? (
                <div className="text-center py-16 bg-background border rounded-2xl">
                  <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-bold">گواهینامه‌ای ندارید</p>
                  <p className="text-sm text-muted-foreground mt-1">پس از اتمام موفق دوره، گواهینامه شما اینجا قرار می‌گیرد</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.certificates.map((c) => (
                    <div key={c.id} className="bg-gradient-to-l from-primary/10 to-secondary/10 border rounded-2xl p-6 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                        <FiAward className="h-7 w-7" />
                      </div>
                      <p className="font-bold">گواهینامه دوره {c.courseName}</p>
                      <p className="text-xs text-muted-foreground mt-2">به نام {c.studentName}</p>
                      <p className="text-xs text-muted-foreground">مدرس: {c.teacherName} — {c.date}</p>
                      <p className="text-[10px] text-muted-foreground mt-1" dir="ltr">{c.code}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Settings */}
          {tab === 'settings' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background border rounded-2xl p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-primary" /> اطلاعات شخصی
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">نام و نام خانوادگی</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={data.userInfo?.fullName || user.name}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">ایمیل</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={data.userInfo?.email || user.identifier}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">شماره موبایل</label>
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder={data.userInfo?.mobile || '09...'}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </div>

              <div className="bg-background border rounded-2xl p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <FiLock className="h-4 w-4 text-primary" /> تغییر رمز عبور
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-sm font-medium mb-1 block">رمز فعلی</label>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((s) => !s)}
                      className="absolute left-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrent ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="text-sm font-medium mb-1 block">رمز جدید</label>
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      className="absolute left-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">تکرار رمز جدید</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    تغییر رمز عبور
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{activeQuiz.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeQuiz.courseName} — {activeQuiz.questions.length} سوال
                </p>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {quizAnswers.every((a) => a !== -1) ? (
              <QuizResult
                quiz={activeQuiz}
                answers={quizAnswers}
                onClose={() => setActiveQuiz(null)}
                onRetry={() => setQuizAnswers(new Array(activeQuiz.questions.length).fill(-1))}
              />
            ) : (
              <div className="space-y-4">
                {activeQuiz.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="border rounded-xl p-4">
                    <p className="font-medium text-sm mb-3">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="grid gap-2">
                      {q.options.map((opt: string, oIdx: number) => (
                        <button
                          key={oIdx}
                          onClick={() =>
                            setQuizAnswers((prev) => prev.map((a, i) => (i === qIdx ? oIdx : a)))
                          }
                          className={`text-right px-3 py-2 rounded-lg border text-sm transition-colors ${
                            quizAnswers[qIdx] === oIdx
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const unanswered = quizAnswers.filter((a) => a === -1).length;
                    if (unanswered > 0) {
                      toast(`هنوز ${unanswered} سوال بدون پاسخ دارید`);
                      return;
                    }
                    const score = activeQuiz.questions.reduce(
                      (s: number, q: any, i: number) => s + (quizAnswers[i] === q.correctIndex ? 1 : 0),
                      0
                    );
                    db.addQuizAttempt({
                      quizId: activeQuiz.id,
                      quizTitle: activeQuiz.title,
                      courseId: activeQuiz.courseId,
                      studentId: user.id,
                      studentName: data.userInfo?.fullName || user.name,
                      score,
                      maxScore: activeQuiz.questions.length,
                      date: new Date().toLocaleDateString('fa-IR'),
                    });
                    if (score / activeQuiz.questions.length >= 0.6) {
                      const hasCert = db
                        .getCertificatesByStudent(user.id)
                        .some((c) => c.courseId === activeQuiz.courseId);
                      if (!hasCert) {
                        const course = db.getCourseById(activeQuiz.courseId);
                        db.addCertificate({
                          studentId: user.id,
                          studentName: data.userInfo?.fullName || user.name,
                          courseId: activeQuiz.courseId,
                          courseName: activeQuiz.courseName,
                          teacherName: course?.teacherName || '—',
                          date: new Date().toLocaleDateString('fa-IR'),
                          code: `VIR-${new Date().getTime().toString().slice(-6)}`,
                        });
                      }
                    }
                    setQuizAnswers((prev) => prev.map((_, i) => i + 999));
                    setRefreshKey((k) => k + 1);
                    toast.success('نتیجه آزمون ثبت شد');
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  ثبت پاسخ‌ها
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {showMaterialModal && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMaterialModal(false)}>
          <div className="bg-background border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold flex items-center gap-2">
                <FiUpload className="h-5 w-5 text-primary" /> آپلود جزوه
              </h3>
              <button onClick={() => setShowMaterialModal(false)} className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">عنوان جزوه</label>
                <input
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="مثلاً: جزوه جلسه سوم"
                  className="w-full px-3 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">دوره</label>
                <select
                  value={matCourseId}
                  onChange={(e) => setMatCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">انتخاب دوره...</option>
                  {data.enrollments.map((e) => (
                    <option key={e.courseId} value={e.courseId}>{e.courseName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">نوع فایل</label>
                <select
                  value={matType}
                  onChange={(e) => setMatType(e.target.value as 'pdf' | 'video' | 'link' | 'file')}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="pdf">جزوه PDF</option>
                  <option value="video">ویدیو</option>
                  <option value="link">لینک</option>
                  <option value="file">فایل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">لینک فایل</label>
                <input
                  value={matUrl}
                  onChange={(e) => setMatUrl(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full px-3 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="text-[11px] text-muted-foreground mt-1">اگر فایل هنوز منتشر نشده، این بخش را خالی بگذارید</p>
              </div>
              <button
                onClick={handleAddMaterial}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                ارسال جزوه
              </button>
            </div>
          </div>
        </div>
      )}

      {absentNoteId && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setAbsentNoteId(null)}>
          <div className="bg-background border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold flex items-center gap-2">
                <FiEdit3 className="h-5 w-5 text-primary" /> دلیل غیبت
              </h3>
              <button onClick={() => setAbsentNoteId(null)} className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">چرا سر کلاس حاضر نبودید؟ دلیل برای استاد نمایش داده می‌شود.</p>
            <textarea
              value={absentNoteText}
              onChange={(e) => setAbsentNoteText(e.target.value)}
              rows={4}
              placeholder="مثلاً: به دلیل بیماری نتوانستم در کلاس حاضر شوم..."
              className="w-full px-3 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <button
              onClick={saveAbsenceNote}
              disabled={!absentNoteText.trim()}
              className="mt-4 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ارسال دلیل به استاد
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ReviewCard({
  courseId,
  courseName,
  initialRating,
  initialComment,
  submitted,
  onSubmit,
}: {
  courseId: string;
  courseName: string;
  initialRating: number;
  initialComment: string;
  submitted: boolean;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  return (
    <div className="bg-background border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold">{courseName}</p>
        {submitted && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700">
            <FiCheckCircle className="h-3 w-3" /> نظر ثبت شده
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
          >
            ★
          </button>
        ))}
        <span className="text-sm text-muted-foreground mr-2">{rating > 0 ? `امتیاز ${rating} از ۵` : 'امتیاز بدهید'}</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="نظر خود را درباره این دوره بنویسید..."
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
      <button
        onClick={() => onSubmit(rating, comment)}
        disabled={rating === 0}
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiStar className="h-4 w-4" />
        {submitted ? 'به‌روزرسانی نظر' : 'ثبت نظر'}
      </button>
    </div>
  );
}

function QuizResult({
  quiz,
  answers,
  onClose,
  onRetry,
}: {
  quiz: any;
  answers: number[];
  onClose: () => void;
  onRetry: () => void;
}) {
  const score = quiz.questions.reduce(
    (s: number, q: any, i: number) => s + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const pct = Math.round((score / quiz.questions.length) * 100);
  const passed = pct >= 60;

  return (
    <div className="text-center py-6">
      <div
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
          passed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
        }`}
      >
        {pct}٪
      </div>
      <h3 className="text-xl font-bold mt-4">{passed ? 'آفرین، قبول شدید!' : 'دفعه بعد موفق می‌شوید'}</h3>
      <p className="text-muted-foreground mt-2">
        نتیجه شما: <span className="font-bold">{score}</span> از <span className="font-bold">{quiz.questions.length}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {passed ? 'گواهینامه این آزمون به پرونده شما اضافه شد' : 'پس از مرور مجدد، دوباره تلاش کنید'}
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg border font-medium hover:bg-muted/50 transition-colors"
        >
          آزمون مجدد
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  );
}
