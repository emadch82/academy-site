'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiEdit3,
  FiAward,
  FiFileText,
  FiClock,
  FiUserCheck,
  FiStar,
  FiMessageCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiBookOpen,
} from 'react-icons/fi';

const teacherLinks = [
  { icon: FiHome, label: 'داشبورد', href: '/teacher' },
  { icon: FiUsers, label: 'دانش‌آموزان من', href: '/teacher/students' },
  { icon: FiCalendar, label: 'حاضری و غیاب', href: '/teacher/attendance' },
  { icon: FiEdit3, label: 'تکالیف', href: '/teacher/homework' },
  { icon: FiAward, label: 'آزمون‌ها', href: '/teacher/quiz' },
  { icon: FiFileText, label: 'جزوات دوره‌ها', href: '/teacher/materials' },
  { icon: FiClock, label: 'برنامه کلاسی', href: '/teacher/schedule' },
  { icon: FiUserCheck, label: 'درخواست‌های غیبت', href: '/teacher/leave-requests' },
  { icon: FiCalendar, label: 'رزرو کلاس', href: '/teacher/appointments' },
  { icon: FiStar, label: 'نظرات دوره‌ها', href: '/teacher/reviews' },
  { icon: FiMessageCircle, label: 'چت پشتیبانی', href: '/teacher/chats' },
  { icon: FiBookOpen, label: 'پروفایل', href: '/teacher/profile' },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);

  useEffect(() => {
    const raw = Cookies.get('amz_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    if (user && !isTeacher) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    }
  }, [user, isTeacher, router]);

  if (user && !isTeacher) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Top Bar */}
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
          <Link href="/teacher" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FiBookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">پنل استاد</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              Cookies.remove('amz_access');
              Cookies.remove('amz_user');
              router.push('/auth/login');
            }}
            className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg"
          >
            <FiLogOut className="h-4 w-4" />
            خروج از پنل
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FiBookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user?.name || 'استاد'}</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 h-full w-64 shrink-0 border-l bg-background z-30 transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {teacherLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
