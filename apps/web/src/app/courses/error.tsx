'use client';

import Link from 'next/link';

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-red-500">خطا</div>
        <h1 className="text-2xl font-bold">مشکلی پیش آمد</h1>
        <p className="text-muted-foreground">
          در بارگذاری اطلاعات دوره مشکلی پیش آمده است.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            تلاش مجدد
          </button>
          <Link
            href="/courses"
            className="px-6 py-3 rounded-xl bg-muted font-medium hover:bg-muted/80 transition-colors"
          >
            لیست دوره‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
