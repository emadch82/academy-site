'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

const faqCategories = [
  {
    name: 'عمومی',
    questions: [
      {
        q: 'آموزشگاه هوشمند چیست؟',
        a: 'آموزشگاه هوشمند یک سامانه جامع آموزشی است که امکان برگزاری دوره‌های حضوری، آنلاین و آفلاین را فراهم می‌کند.',
      },
      {
        q: 'چگونه می‌توانم با شما تماس بگیرم؟',
        a: 'شما می‌توانید از طریق تلفن، ایمیل یا فرم تماس با ما در ارتباط باشید.',
      },
    ],
  },
  {
    name: 'ثبت‌نام',
    questions: [
      {
        q: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
        a: 'برای ثبت‌نام ابتدا در سامانه عضو شوید، سپس دوره مورد نظر را انتخاب و فرآیند ثبت‌نام را تکمیل کنید.',
      },
      {
        q: 'آیا امکان پرداخت اقساطی وجود دارد؟',
        a: 'بله، برای برخی دوره‌ها امکان پرداخت اقساطی وجود دارد. با ما تماس بگیرید.',
      },
      {
        q: 'شرایط لغو ثبت‌نام چیست؟',
        a: 'تا ۷۲ ساعت پس از ثبت‌نام امکان لغو با بازگشت کامل وجه وجود دارد.',
      },
    ],
  },
  {
    name: 'دوره‌ها',
    questions: [
      {
        q: 'آیا دوره‌ها ضبط می‌شوند؟',
        a: 'بله، تمام جلسات آنلاین ضبط می‌شوند و پس از برگزاری قابل دانلود هستند.',
      },
      {
        q: 'سطح دوره‌ها چگونه است؟',
        a: 'دوره‌ها در سطوح مبتدی، متوسط و پیشرفته ارائه می‌شوند.',
      },
      {
        q: 'آیا گواهینامه صادر می‌شود؟',
        a: 'بله، پس از تکمیل دوره و قبولی در آزمون پایانی گواهینامه معتبر صادر می‌شود.',
      },
    ],
  },
  {
    name: 'مالی',
    questions: [
      {
        q: 'روش‌های پرداخت چیست؟',
        a: 'از طریق درگاه آنلاین بانکی، کارت به کارت و واریز نقدی امکان پرداخت وجود دارد.',
      },
      {
        q: 'آیا امکان بازگشت وجه وجود دارد؟',
        a: 'تا ۷۲ ساعت پس از ثبت‌نام با شرایط خاص امکان بازگشت وجه وجود دارد.',
      },
      {
        q: 'آیا کد تخفیف دارید؟',
        a: 'بله، در مناسبت‌های مختلف کدهای تخفیف ارائه می‌شود. ما را در شبکه‌های اجتماعی دنبال کنید.',
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.includes(search) || q.a.includes(search)
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">سوالات متداول</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              پاسخ سوالات رایج شما در اینجا آمده است
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-xl border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                  placeholder="جستجوی سوال..."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-12">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">{category.name}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const key = `${category.name}-${index}`;
                  const isOpen = openIndex === key;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-background rounded-xl border overflow-hidden"
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-5 text-right"
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                      >
                        <span className="font-medium">{faq.q}</span>
                        <FiChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 mr-4 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 text-muted-foreground border-t">
                              <p className="pt-4 leading-relaxed">{faq.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <FiSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">سوالی یافت نشد</p>
              <p className="text-muted-foreground">عبارت جستجو را تغییر دهید</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
