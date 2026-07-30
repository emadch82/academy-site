'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Visual - Motion Video */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            style={{ perspective: "1000px" }}
          >
            <div className="relative">
              {/* Main video */}
              <motion.div
                style={{ y, rotateX }}
                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/images/about-poster.jpg"
                >
                  <source src="/motion/Motion_graphics_for_language_school_202607281714_gwr_video_mvp.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </motion.div>

              {/* Experience badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-center text-white">
                  <div className="text-4xl font-bold">۱۵+</div>
                  <div className="text-sm opacity-90">سال تجربه</div>
                </div>
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl backdrop-blur-sm border border-secondary/20"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              >
                درباره ما
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                آشنایی با <span className="text-primary">آکادمی ویرا</span>
              </h2>
              <p className="text-primary font-medium text-lg">مرکز تخصصی آموزش زبان انگلیسی</p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                آموزشگاه زبان ویرا با بیش از ۱۵ سال سابقه درخشان در زمینه آموزش زبان انگلیسی، یکی از معتبرترین مراکز زبان در اصفهان است. ما با بهره‌گیری از مجرب‌ترین اساتید و مدرن‌ترین متدهای آموزشی، محیطی پویا و خلاقانه برای یادگیری زبان فراهم کرده‌ایم.
              </p>
              <p>
                تیم حرفه‌ای ما با تمرکز بر نیازهای هر زبان‌آموز، برنامه‌های آموزشی متنوعی را از دوره‌های کودکان تا آموزش‌های تخصصی بزرگسالان ارائه می‌دهد.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                'اساتید بین‌المللی',
                'کلاس‌های تعاملی',
                'ضمانت بازگشت وجه',
                'پشتیبانی ۲۴ ساعته',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FiCheck className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              اطلاعات بیشتر
              <FiArrowLeft className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
