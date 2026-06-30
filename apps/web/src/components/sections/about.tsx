'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src="/images/about.jpg"
                alt="درباره آموزشگاه نجوای قلم"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold">درباره آموزشگاه نجوای قلم</h2>
              <p className="text-primary font-medium mt-2">مرکز تخصصی نخبه پروری</p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                آموزشگاه نجوای قلم با بیش از ۵ سال تجربه در زمینه آموزش، محیطی پرانرژی و حرفه‌ای برای یادگیری فراهم کرده است. ما باور داریم که هر فردی پتانسیل بی‌نظیری برای رشد و پیشرفت دارد.
              </p>
              <p>
                ماموریت ما کشف، پرورش و هدایت استعدادهاست. با تیمی از بهترین اساتید و برنامه‌های آموزشی به‌روز، به دانشجویان کمک می‌کنیم تا مسیر موفقیت خود را پیدا کنند.
              </p>
              <p>
                از هوش مصنوعی و طراحی سایت گرفته تا نقاشی و رباتیک، دوره‌های متنوعی را برای تمام سنین ارائه می‌دهیم.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              اطلاعات بیشتر
              <FiArrowLeft className="mr-1 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
