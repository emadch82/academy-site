'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiBookOpen, FiHeart, FiShield, FiTrendingUp } from 'react-icons/fi';

const advantages = [
  {
    icon: FiUsers,
    title: 'اساتید مجرب',
    description: 'تیمی از بهترین و مجرب‌ترین اساتید هر حوزه',
  },
  {
    icon: FiAward,
    title: 'گواهینامه معتبر',
    description: 'ارائه گواهینامه معتبر پس از اتمام دوره',
  },
  {
    icon: FiBookOpen,
    title: 'محتوای به‌روز',
    description: 'سرفصل‌های آموزشی مطابق با استانداردهای روز دنیا',
  },
  {
    icon: FiHeart,
    title: 'محیط صمیمی',
    description: 'یادگیری در فضایی پرانرژی و دوستانه',
  },
  {
    icon: FiShield,
    title: 'پشتیبانی مستمر',
    description: 'حمایت و راهنمایی حتی پس از اتمام دوره',
  },
  {
    icon: FiTrendingUp,
    title: 'نخبه‌پروری',
    description: 'برنامه‌های ویژه برای شکوفایی استعدادها',
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">چرا نجوای قلم؟</h2>
          <p className="text-muted-foreground mt-2">مزایای یادگیری در آموزشگاه ما</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-background rounded-xl border p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary/50">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
