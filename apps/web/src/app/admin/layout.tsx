'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  FiHome,
  FiUsers,
  FiShield,
  FiLogOut,
  FiMenu,
  FiX,
  FiUserCheck,
  FiBookOpen,
  FiDollarSign,
  FiTag,
  FiBell,
  FiBarChart2,
  FiMessageSquare,
  FiClock,
  FiFileText,
  FiImage,
  FiSettings,
  FiEdit3,
} from 'react-icons/fi';

const sidebarLinks = [
  { icon: FiHome, label: 'داشبورد', href: '/admin' },
  { icon: FiUsers, label: 'مدیریت کاربران', href: '/admin/users' },
  { icon: FiUserCheck, label: 'مدیریت اساتید', href: '/admin/teachers' },
  { icon: FiBookOpen, label: 'دوره‌ها', href: '/admin/courses' },
  { icon: FiDollarSign, label: 'مدیریت مالی', href: '/admin/finance' },
  { icon: FiTag, label: 'کدهای تخفیف', href: '/admin/discounts' },
  { icon: FiBell, label: 'اعلان‌ها', href: '/admin/notifications' },
  { icon: FiMessageSquare, label: 'پیشنهادات', href: '/admin/suggestions' },
  { icon: FiBarChart2, label: 'گزارشات', href: '/admin/reports' },
  { icon: FiClock, label: 'گزارش فعالیت‌ها', href: '/admin/activity-log' },
  { icon: FiFileText, label: 'بلاگ', href: '/admin/blog' },
  { icon: FiEdit3, label: 'مدیریت محتوا (CMS)', href: '/admin/cms' },
  { icon: FiImage, label: 'گالری', href: '/admin/gallery' },
  { icon: FiSettings, label: 'تنظیمات', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && !isAdmin) {
      if (user.role === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/profile');
      }
    }
  }, [user, isAdmin, router]);

  if (user && !isAdmin) {
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
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FiShield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">پنل مدیریت</span>
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
              <FiShield className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user?.name || 'مدیر سیستم'}</span>
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
            {sidebarLinks.map((link) => {
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
