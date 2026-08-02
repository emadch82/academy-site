'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiBookOpen, FiGrid, FiFileText, FiBell, FiMessageCircle, FiUsers, FiZap, FiLogOut, FiShield } from 'react-icons/fi';
import Cookies from 'js-cookie';
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
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { balance } = useWallet();
  const { items } = useCart();
  const { unreadCount } = useNotifications();

  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raw = Cookies.get('amz_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const btn = menuBtnRef.current;
    if (!btn) return;
    const handler = (e: TouchEvent) => {
      e.stopPropagation();
      setMobileMenuOpen(prev => !prev);
    };
    btn.addEventListener('touchend', handler, { capture: true, passive: false });
    return () => btn.removeEventListener('touchend', handler, { capture: true } as EventListenerOptions);
  }, []);

  const logout = () => {
    Cookies.remove('amz_access');
    Cookies.remove('amz_user');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full pointer-events-auto transition-all duration-300 ${
        isHome
          ? scrolled
            ? 'bg-black/60 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
          : scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-primary/5'
            : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-shadow">
                <span className="text-lg md:text-2xl font-bold text-white">V</span>
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <span className={`text-lg md:text-xl font-bold block leading-tight ${isHome ? 'text-white' : ''}`}>آموزشگاه زبان ویرا</span>
              <span className={`text-xs ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}>Vira Language Academy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg group ${
                  isHome
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-8 transition-all duration-300 ${isHome ? 'bg-white' : 'bg-primary'}`} />
              </Link>
            ))}
          </nav>

          {/* Auth & Cart */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/wallet" className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'hover:text-primary hover:bg-primary/5'}`}>
              <FiGrid className="h-4 w-4" />
              <span>{new Intl.NumberFormat('fa-IR').format(balance)}</span>
              <span className={`text-xs ${isHome ? 'text-white/50' : 'text-muted-foreground'}`}>تومان</span>
            </Link>
            <Link href="/notifications" className={`relative transition-colors p-2 rounded-lg ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              <FiBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
            <CartDrawer />
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link href="/admin" className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'hover:text-primary hover:bg-primary/5'}`}>
                    <FiShield className="h-4 w-4" />
                    پنل مدیریت
                  </Link>
                )}
                <span className="text-sm font-medium">{user.name}</span>
                <button onClick={logout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                  <FiLogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'hover:text-primary hover:bg-primary/5'}`}>
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary/80 px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105"
                >
                  <FiUser className="h-4 w-4" />
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <CartDrawer />
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className={`inline-flex items-center justify-center rounded-lg p-2.5 min-w-[44px] min-h-[44px] transition-colors active:scale-95 ${isHome ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:bg-muted'}`}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`lg:hidden fixed inset-0 top-14 z-40 overflow-y-auto ${isHome ? 'bg-black/95' : 'bg-background'}`}
          >
            <div className="px-6 py-8">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-4 text-lg font-bold rounded-xl transition-colors ${isHome ? 'text-white active:bg-white/10' : 'active:bg-primary/5 active:text-primary'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-4 pt-4">
                  <p className={`px-4 py-2 text-xs font-medium ${isHome ? 'text-white/40' : 'text-muted-foreground'}`}>امکانات</p>
                  {[
                    { name: 'کیف پول', href: '/wallet', icon: FiGrid },
                    { name: 'اعلان‌ها', href: '/notifications', icon: FiBell },
                    { name: 'چت پشتیبانی', href: '/chat', icon: FiMessageCircle },
                    { name: 'گواهینامه‌ها', href: '/certificates', icon: FiFileText },
                    { name: 'پیشنهادات', href: '/suggestions', icon: FiZap },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${isHome ? 'text-white/80 active:bg-white/10 active:text-white' : 'active:bg-primary/5 active:text-primary'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Link href="/admin" className={`flex-1 text-center py-3 text-sm font-medium border rounded-xl transition-colors ${isHome ? 'border-white/20 text-white active:bg-white/10' : 'active:bg-muted'}`} onClick={() => setMobileMenuOpen(false)}>
                          پنل مدیریت
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex-1 text-center py-3 text-sm font-medium bg-red-500 text-white rounded-xl active:bg-red-600 transition-colors">
                        خروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className={`flex-1 text-center py-3 text-sm font-medium border rounded-xl transition-colors ${isHome ? 'border-white/20 text-white active:bg-white/10' : 'active:bg-muted'}`} onClick={() => setMobileMenuOpen(false)}>
                        ورود
                      </Link>
                      <Link href="/auth/register" className="flex-1 text-center py-3 text-sm font-medium bg-gradient-to-l from-primary to-primary/80 text-primary-foreground rounded-xl active:shadow-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                        ثبت‌نام
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
