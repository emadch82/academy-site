'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiBookOpen, FiGrid, FiFileText, FiBell, FiMessageCircle, FiUsers, FiZap } from 'react-icons/fi';
import { CartDrawer } from '@/components/cart-drawer';
import { useWallet } from '@/contexts/wallet-context';
import { useCart } from '@/contexts/cart-context';
import { useNotifications } from '@/contexts/notification-context';

const navigation = [
  { name: 'خانه', href: '/' },
  { name: 'دوره‌ها', href: '/courses' },
  { name: 'بلاگ', href: '/blog' },
  { name: 'گالری', href: '/gallery' },
  { name: 'درباره ما', href: '/about' },
  { name: 'تماس با ما', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { balance } = useWallet();
  const { items } = useCart();
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FiBookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">نجوای قلم</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth & Cart */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/wallet" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
              <FiGrid className="h-4 w-4" />
              <span>{new Intl.NumberFormat('fa-IR').format(balance)}</span>
              <span className="text-xs text-muted-foreground">تومان</span>
            </Link>
            <Link href="/notifications" className="relative text-muted-foreground hover:text-primary transition-colors">
              <FiBell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -left-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>}
            </Link>
            <CartDrawer />
            <Link href="/auth/login" className="text-sm font-medium transition-colors hover:text-primary">ورود</Link>
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <FiUser className="ml-2 h-4 w-4" /> ثبت‌نام
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <div className="border-t mt-2 pt-2">
                <p className="px-3 py-1 text-xs text-muted-foreground font-medium">امکانات</p>
                {[
                  { name: 'کیف پول', href: '/wallet', icon: FiGrid },
                  { name: 'اعلان‌ها', href: '/notifications', icon: FiBell },
                  { name: 'چت پشتیبانی', href: '/chat', icon: FiMessageCircle },
                  { name: 'گروه‌های کلاسی', href: '/groups', icon: FiUsers },
                  { name: 'گواهینامه‌ها', href: '/certificates', icon: FiFileText },
                  { name: 'پیشنهادات', href: '/suggestions', icon: FiZap },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                    <item.icon className="h-4 w-4" /> {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Link href="/auth/login" className="flex-1 text-center px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted">ورود</Link>
                <Link href="/auth/register" className="flex-1 text-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">ثبت‌نام</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
