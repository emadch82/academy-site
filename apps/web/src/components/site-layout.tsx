'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const HIDE_LAYOUT_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/admin', '/teacher'];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const hideLayout = HIDE_LAYOUT_PATHS.some((p) => pathname.startsWith(p));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
