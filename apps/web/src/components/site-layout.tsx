'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import AIChat from '@/components/ai-chat';

const HIDE_LAYOUT_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/admin'];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = HIDE_LAYOUT_PATHS.some((p) => pathname.startsWith(p));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <AIChat />
    </>
  );
}
