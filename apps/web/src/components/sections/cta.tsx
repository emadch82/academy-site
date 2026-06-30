'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPhone } from 'react-icons/fi';

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12 md:p-16"
        >
          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              آماده شروع یادگیری هستید؟
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              همین الان ثبت‌نام کنید و مسیر موفقیت خود را شروع کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 text-sm font-medium hover:bg-background/90 transition-colors"
              >
                ثبت‌نام دوره‌ها
                <FiArrowLeft className="mr-2 h-4 w-4" />
              </Link>
              <Link
                href="tel:09133239672"
                className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 text-primary-foreground px-8 py-3 text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                <FiPhone className="ml-2 h-4 w-4" />
                ۰۹۱۳۳۲۳۹۶۷۲
              </Link>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 left-0 h-full w-full opacity-10">
            <div className="absolute top-10 right-10 h-40 w-40 rounded-full border-2 border-primary-foreground" />
            <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full border-2 border-primary-foreground" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
