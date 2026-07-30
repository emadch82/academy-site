'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowLeft, FiPlay } from 'react-icons/fi';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="relative overflow-hidden min-h-screen flex items-center" id="home">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl"
        />
        
        {/* Floating 3D shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotateY: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotateX: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-10 w-16 h-16 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full backdrop-blur-sm border border-secondary/20"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        />
        <motion.div
          animate={{ y: [-15, 15, -15], rotateZ: [0, 360] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg backdrop-blur-sm border border-primary/10"
        />
      </div>

      <motion.div style={{ y, opacity, scale }} className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              ثبت‌نام دوره‌های جدید آغاز شد
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-7xl font-bold tracking-tight leading-tight"
            >
              آموزشگاه زبان
              <br />
              <span className="bg-gradient-to-l from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                ویرا
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته با بهترین اساتید
              <br />
              محیطی پرانرژی و حرفه‌ای برای یادگیری در اصفهان
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary/80 px-8 py-4 text-sm font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
              >
                ثبت‌نام دوره‌ها
                <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border bg-background/50 backdrop-blur-sm px-8 py-4 text-sm font-medium hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              >
                <FiPlay className="h-4 w-4 group-hover:scale-110 transition-transform" />
                مشاوره رایگان
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { value: '+۱۵', label: 'سال سابقه' },
                { value: '۵۰', label: 'دانش‌آموز' },
                { value: '۸', label: 'دپارتمان' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Video/Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
            style={{ perspective: "1000px" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster="/images/hero-poster.jpg"
              >
                <source src="/motion/VIRA_language_institute_animation_1080p_202607281703_gwr_video_mvp.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-bold">ثبت‌نام موفق</div>
                  <div className="text-xs text-muted-foreground">+۵۰۰۰ دانش‌آموز</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -top-4 -left-4 bg-background/80 backdrop-blur-sm rounded-xl shadow-xl p-3 border border-border/50"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-white text-xs">★</span>
                </div>
                <div className="text-xs font-medium">امتیاز ۴.۹/۵</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
