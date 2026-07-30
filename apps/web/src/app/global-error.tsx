'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">خطایی رخ داد</h2>
          <p className="text-muted-foreground mb-6">متأسفانه مشکلی پیش آمده است.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
