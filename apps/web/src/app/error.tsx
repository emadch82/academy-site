'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-primary">خطا</div>
        <h1 className="text-2xl font-bold">مشکلی پیش آمد</h1>
        <p className="text-muted-foreground">
          متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
