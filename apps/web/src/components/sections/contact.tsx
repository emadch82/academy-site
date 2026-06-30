'use client';

import { motion } from 'framer-motion';
import { FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi';

export function ContactSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">تماس با ما</h2>
          <p className="text-muted-foreground mt-2">برای مشاوره و ثبت‌نام با ما در تماس باشید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            viewport={{ once: true }}
          >
            <a href="tel:03136512814" className="block bg-background rounded-xl border p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary/50">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <FiPhone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">تلفن</h3>
              <p className="text-muted-foreground text-sm">۰۳۱۳۶۵۱۲۸۱۴</p>
            </a>
          </motion.div>

          {/* Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <a href="tel:09133239672" className="block bg-background rounded-xl border p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary/50">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <FiPhone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">موبایل</h3>
              <p className="text-muted-foreground text-sm">۰۹۱۳۳۲۳۹۶۷۲ | ۰۹۱۳۴۶۴۷۷۹۳</p>
            </a>
          </motion.div>

          {/* Eitaa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a href="https://eitaa.com/najvaaca" target="_blank" rel="noopener noreferrer" className="block bg-background rounded-xl border p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary/50">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <FiMessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ایتا</h3>
              <p className="text-muted-foreground text-sm">@najvaaca</p>
            </a>
          </motion.div>
        </div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <div className="bg-background rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FiMapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">آدرس</h3>
                <p className="text-muted-foreground text-sm">
                  اصفهان، سپاهان‌شهر، بلوار غدیر، خیابان ایثار، طبقه فوقانی باشگاه شاهین
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
