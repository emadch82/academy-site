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
} from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useInvoices } from '@/contexts/invoice-context';
import { formatPrice } from '@/lib/courses-data';

type Tab = 'courses' | 'homework' | 'attendance' | 'invoices';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'courses', label: 'دوره‌های من', icon: FiBookOpen },
  { id: 'homework', label: 'تکالیف', icon: FiEdit3 },
  { id: 'attendance', label: 'حاضری و غیاب', icon: FiCalendar },
  { id: 'invoices', label: 'فاکتورها', icon: FiDollarSign },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('courses');
  const { invoices } = useInvoices();

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
    };
  }, [user]);

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
                        <span>ارسال: {h.createdAt}</span>
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
                          <tr key={a.id} className="border-t">
                            <td className="px-5 py-3">{a.date}</td>
                            <td className="px-5 py-3">{db.getCourseById(a.courseId)?.title || '—'}</td>
                            <td className="px-5 py-3">
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
        </motion.div>
      </div>
    </main>
  );
}
