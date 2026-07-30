'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAward, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { useWallet } from '@/contexts/wallet-context';

interface Certificate {
  id: string;
  courseName: string;
  studentName: string;
  date: string;
  grade: string;
}

const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'CERT-001', courseName: 'دوره مکالمه SPO', studentName: 'کاربر نمونه', date: '۱۴۰۵/۰۴/۱۵', grade: 'عالی' },
  { id: 'CERT-002', courseName: 'دوره بزرگسالان - سطح Intermediate', studentName: 'کاربر نمونه', date: '۱۴۰۵/۰۳/۲۰', grade: 'خوب' },
  { id: 'CERT-003', courseName: 'دوره کودکان - First Friends', studentName: 'کاربر نمونه', date: '۱۴۰۵/۰۲/۱۰', grade: 'عالی' },
];

export default function CertificatesPage() {
  const [certificates] = useState<Certificate[]>(MOCK_CERTIFICATES);

  const downloadCertificate = (cert: Certificate) => {
    const text = `
╔══════════════════════════════════════════╗
║         آموزشگاه زبان ویرا              ║
║     گواهینامه پایان دوره                 ║
╚══════════════════════════════════════════╝

شماره: ${cert.id}
تاریخ: ${cert.date}

این گواهی به شناسایی می‌کند که

${cert.studentName}

دوره "${cert.courseName}" را با موفقیت به پایان رسانده است.

نمره: ${cert.grade}

تاریخ صدور: ${cert.date}
آموزشگاه زبان ویرا
    `;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.id}.txt`;
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
            <h1 className="text-3xl font-bold">گواهینامه‌های من</h1>
            <p className="text-muted-foreground mt-2">گواهینامه‌های دوره‌های تکمیل شده</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {certificates.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <FiAward className="h-12 w-12 text-primary/40" />
            </div>
            <h2 className="text-xl font-bold mb-4">هنوز گواهینامه‌ای ندارید</h2>
            <p className="text-muted-foreground mb-8">دوره‌های خود را تکمیل کنید تا گواهینامه دریافت کنید.</p>
            <Link href="/courses" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all inline-block">
              مشاهده دوره‌ها
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-background rounded-2xl border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <FiAward className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{cert.courseName}</h3>
                    <p className="text-xs text-muted-foreground">{cert.id}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ صدور:</span>
                    <span>{cert.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نمره:</span>
                    <span className="text-green-600 font-medium">{cert.grade}</span>
                  </div>
                </div>
                <button type="button" onClick={() => downloadCertificate(cert)} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all">
                  <FiDownload className="h-4 w-4" />
                  دانلود گواهینامه
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
