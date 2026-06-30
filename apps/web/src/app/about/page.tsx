'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const values = [
  { icon: FiTarget, title: 'کیفیت', description: 'ارائه بهترین خدمات آموزشی' },
  { icon: FiEye, title: 'نوآوری', description: 'استفاده از جدیدترین متدهای آموزشی' },
  { icon: FiHeart, title: 'تعهد', description: 'تعهد به موفقیت دانشجویان' },
  { icon: FiAward, title: 'برتری', description: 'تلاش برای رسیدن به بالاترین استانداردها' },
];

const stats = [
  { value: '۱۵+', label: 'سال تجربه' },
  { value: '۵۰۰۰+', label: 'دانشجو' },
  { value: '۱۰۰+', label: 'دوره آموزشی' },
  { value: '۵۰+', label: 'استاد مجرب' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">درباره ما</h1>
            <p className="text-lg text-muted-foreground">
              آموزشگاه هوشمند با بیش از ۱۵ سال تجربه در ارائه خدمات آموزشی با کیفیت،
              تلاش می‌کند تا محیطی مناسب برای یادگیری و رشد حرفه‌ای فراهم کند.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl border p-8"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FiTarget className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">ماموریت ما</h2>
              <p className="text-muted-foreground leading-relaxed">
                ارائه آموزش‌های با کیفیت و کاربردی که دانشجویان را برای ورود به بازار کار
                و پیشرفت حرفه‌ای آماده کند. ما باور داریم که یادگیری مادام‌العمر کلید موفقیت است.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl border p-8"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FiEye className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">چشم‌انداز ما</h2>
              <p className="text-muted-foreground leading-relaxed">
                تبدیل شدن به برترین مرکز آموزشی در کشور با استفاده از فناوری‌های نوین
                و روش‌های آموزشی نوآورانه. هدف ما تربیت نیروی متخصص برای آینده است.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ارزش‌های ما</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا ما؟</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'اساتید مجرب و متخصص',
              'امکانات آموزشی پیشرفته',
              'دوره‌های متنوع و کاربردی',
              'پشتیبانی مستمر',
              'گواهینامه معتبر',
              'هزینه مناسب',
              'انعطاف‌پذیری در برنامه‌ها',
              'ارتباط نزدیک با بازار کار',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <FiCheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
