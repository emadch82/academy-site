'use client';

import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl font-bold text-primary">۴۰۴</div>
        <h1 className="text-2xl font-bold">صفحه یافت نشد</h1>
        <p className="text-muted-foreground">
          صفحه مورد نظر در پنل مدیریت وجود ندارد.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
}
