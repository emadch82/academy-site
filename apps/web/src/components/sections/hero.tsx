'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium">
              <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              ثبت‌نام دوره‌های جدید آغاز شد
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              آموزشگاه
              <br />
              <span className="text-primary">نجوای قلم</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              مرکز تخصصی نخبه پروری در اصفهان
              <br />
              با لذت یاد بگیر، رشد کن و آینده‌ات رو رقم بزن
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                ثبت‌نام دوره‌ها
                <FiArrowLeft className="mr-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border px-8 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                <FiMessageCircle className="ml-2 h-4 w-4" />
                مشاوره رایگان
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+۹۰۰</div>
                <div className="text-xs text-muted-foreground">دنبال‌کننده</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+۵۰۰</div>
                <div className="text-xs text-muted-foreground">دانشجو</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+۱۰</div>
                <div className="text-xs text-muted-foreground">دوره آموزشی</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+۵</div>
                <div className="text-xs text-muted-foreground">سال تجربه</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <img
                src="/images/hero.jpg"
                alt="آموزشگاه نجوای قلم"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -right-4 bg-background rounded-lg shadow-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-medium">ثبت‌نام موفق</div>
                  <div className="text-xs text-muted-foreground">+۵۰۰ دانشجو</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
