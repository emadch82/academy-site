'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const values = [
  { icon: FiTarget, title: 'کیفیت', description: 'ارائه بهترین خدمات آموزشی با استانداردهای بین‌المللی' },
  { icon: FiEye, title: 'نوآوری', description: 'استفاده از جدیدترین متدهای آموزشی زبان' },
  { icon: FiHeart, title: 'تعهد', description: 'تعهد به موفقیت هر زبان‌آموز' },
  { icon: FiAward, title: 'برتری', description: 'تلاش برای رسیدن به بالاترین استانداردها' },
];

const stats = [
  { value: '۱۵+', label: 'سال سابقه' },
  { value: '+50', label: 'دانش‌آموز' },
  { value: '۸+', label: 'دپارتمان آموزشی' },
  { value: '۴', label: 'استاد مجرب' },
];

const teachers = [
  { name: 'نسیم خدابخش', role: 'موسس و مدیریت', qualifications: 'PhD Candidate in TEFL, MA in TEFL', image: '/images/nasim.jpg' },
  { name: 'غزال امیرسلیمانی', role: 'مدرس کودک و نوجوان', qualifications: 'TTC معتبر', image: '/images/female-avatar.png' },
  { name: 'زهرا مردانی', role: 'مدرس TTC و بزرگسال', qualifications: 'فوق لیسانس آموزش زبان, TESOL', image: '/images/zahra.jpg' },
  { name: 'سوگل سرشوقی', role: 'مدرس کودک و نوجوان', qualifications: 'BA in English Literature, TTC', image: '/images/female-avatar.png' },
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main ref={ref} className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 border border-primary/10 rounded-full"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              درباره ما
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              آشنایی با <span className="text-primary">آکادمی ویرا</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              آموزشگاه زبان ویرا با بیش از ۱۵ سال تجربه در ارائه خدمات آموزش زبان انگلیسی با کیفیت،
              تلاش می‌کند تا محیطی مناسب برای یادگیری و رشد حرفه‌ای زبان‌آموزان فراهم کند.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Motion Video */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border max-w-4xl mx-auto"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain"
            >
              <source src="/videos/about-motion.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
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
              className="bg-background/80 backdrop-blur-sm rounded-2xl border p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <FiTarget className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">ماموریت ما</h2>
              <p className="text-muted-foreground leading-relaxed">
                ارائه آموزش‌های با کیفیت و کاربردی زبان انگلیسی که زبان‌آموزان را برای ارتباط مؤثر در سطح بین‌المللی آماده کند. ما باور داریم که یادگیری زبان دریچه‌ای به جهان جدید است و با متدولوژی‌های نوین آموزشی، تجربه‌ای متفاوت از یادگیری ارائه می‌دهیم.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl border p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                <FiEye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">چشم‌انداز ما</h2>
              <p className="text-muted-foreground leading-relaxed">
                تبدیل شدن به برترین مرکز آموزش زبان انگلیسی در اصفهان با استفاده از فناوری‌های نوین و روش‌های آموزشی نوآورانه. هدف ما تربیت نسلی با مهارت‌های زبانی بالاست که بتوانند در سطح بین‌المللی ارتباط برقرار کنند.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">تیم <span className="text-primary">حرفه‌ای</span> ما</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-background rounded-2xl border overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-4 -mt-10 relative z-10">
                  <h3 className="font-bold">{teacher.name}</h3>
                  <p className="text-sm text-primary">{teacher.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ارزش‌های <span className="text-primary">ما</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-background/80 backdrop-blur-sm rounded-2xl border p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا <span className="text-primary">ویرا</span>؟</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'اساتید مجرب و متخصص زبان انگلیسی',
              'امکانات آموزشی پیشرفته',
              'دوره‌های متنوع برای تمام سنین (کودکان تا بزرگسالان)',
              'پشتیبانی مستمر از زبان‌آموزان',
              'مدرک TTC بین‌المللی',
              'هزینه مناسب و شرایط پرداخت',
              'انعطاف‌پذیری در برنامه کلاس‌ها',
              'کلاس‌های آنلاین و حضوری',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiCheckCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
