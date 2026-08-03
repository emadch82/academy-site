'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAward, FiDownload, FiCheckCircle } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB, Certificate } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const hydrated = useHydrated();

  const user = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = Cookies.get('amz_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; name: string; identifier: string; role: string };
    } catch {
      return null;
    }
  }, []);

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    if (user?.id) {
      setCertificates(db.getCertificatesByStudent(user.id));
    } else {
      setCertificates([]);
    }
  }, [hydrated, user?.id]);

  if (!hydrated) return <main className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">در حال بارگذاری...</p></main>;

  const downloadCertificate = (cert: Certificate) => {
    const text = `
╔══════════════════════════════════════════╗
║         آموزشگاه زبان ویرا              ║
║     گواهینامه پایان دوره                 ║
╚══════════════════════════════════════════╝

شماره: ${cert.code}
تاریخ: ${cert.date}

این گواهی به شناسایی می‌کند که

${cert.studentName}

دوره "${cert.courseName}" را با موفقیت به پایان رسانده است.

مدرس دوره: ${cert.teacherName}

تاریخ صدور: ${cert.date}
آموزشگاه زبان ویرا
    `;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowLeft className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold mb-2">گواهینامه‌های من</h1>
            <p className="text-muted-foreground mb-10">گواهینامه‌های پایان دوره شما</p>

            {!user ? (
              <div className="text-center py-16 bg-background border rounded-2xl">
                <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-bold mb-2">ابتدا وارد شوید</p>
                <Link href="/auth/login" className="text-primary hover:underline text-sm">ورود به حساب کاربری</Link>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-16 bg-background border rounded-2xl">
                <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-bold">گواهینامه‌ای ندارید</p>
                <p className="text-sm text-muted-foreground mt-2">پس از اتمام موفق دوره، گواهینامه شما اینجا نمایش داده می‌شود</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background border rounded-2xl p-6 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FiAward className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-bold">دوره {cert.courseName}</h2>
                    <p className="text-xs text-muted-foreground mt-2">به نام {cert.studentName}</p>
                    <p className="text-xs text-muted-foreground">مدرس: {cert.teacherName}</p>
                    <p className="text-xs text-muted-foreground mt-1">تاریخ: {cert.date}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <FiCheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">معتبر</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1" dir="ltr">{cert.code}</p>
                    <button
                      onClick={() => downloadCertificate(cert)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <FiDownload className="h-4 w-4" />
                      دانلود گواهینامه
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
