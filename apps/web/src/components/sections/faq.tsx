'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
    answer: 'برای ثبت‌نام در دوره‌ها ابتدا در سامانه عضو شوید، سپس دوره مورد نظر خود را انتخاب و فرآیند ثبت‌نام را تکمیل کنید. پس از پرداخت هزینه، ثبت‌نام شما نهایی می‌شود.',
  },
  {
    question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
    answer: 'بله، برای برخی دوره‌ها امکان پرداخت اقساطی وجود دارد. برای اطلاعات بیشتر با ما تماس بگیرید.',
  },
  {
    question: 'شرایط دریافت گواهینامه چیست؟',
    answer: 'برای دریافت گواهینامه باید در تمام جلسات شرکت کنید، تکالیف را تحویل دهید و در آزمون پایانی نمره قبولی بگیرید.',
  },
  {
    question: 'آیا دوره‌ها ضبط می‌شوند؟',
    answer: 'بله، تمام جلسات آنلاین ضبط می‌شوند و پس از برگزاری، در پنل دانشجو قابل دانلود هستند.',
  },
  {
    question: 'چگونه با استاد ارتباط برقرار کنم؟',
    answer: 'شما می‌توانید از طریق سیستم پیام‌رسانی داخلی سامانه با اساتید در ارتباط باشید.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">سوالات متداول</h2>
          <p className="text-muted-foreground mt-2">پاسخ سوالات رایج شما</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-background rounded-xl border overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-right"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <FiChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-4 text-muted-foreground border-t">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
