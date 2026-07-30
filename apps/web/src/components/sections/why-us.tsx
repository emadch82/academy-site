'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiAward, FiBookOpen, FiHeart, FiShield, FiGlobe } from 'react-icons/fi';

const advantages = [
  {
    icon: FiUsers,
    title: 'اساتید مجرب',
    description: 'تیمی از مجرب‌ترین اساتید زبان انگلیسی با مدارک بین‌المللی',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiAward,
    title: 'مدرک TTC',
    description: 'ارائه مدرک بین‌المللی TTC پس از اتمام دوره تربیت مدرس',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: FiBookOpen,
    title: '۸ دپارتمان آموزشی',
    description: 'دوره‌های متنوع از کودکان تا بزرگسالان و مکالمه',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: FiHeart,
    title: 'محیط صمیمی',
    description: 'یادگیری در فضایی پرانرژی و دوستانه در اصفهان',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: FiShield,
    title: 'کلاس‌های SPO',
    description: 'دوره‌های فقط مکالمه با تمرکز بر Listening و Speaking',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: FiGlobe,
    title: 'آموزش آنلاین',
    description: 'امکان یادگیری از سراسر دنیا به صورت Virtual Learning',
    gradient: 'from-sky-500 to-blue-500',
  },
];

function AdvantageCard({ item, index }: { item: typeof advantages[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05, z: 50 }}
        className="group cursor-pointer"
      >
        <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border p-8 text-center h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 overflow-hidden">
          {/* Hover gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          {/* Icon */}
          <motion.div
            whileHover={{ rotateY: 360 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg`}
            style={{ transform: "translateZ(30px)" }}
          >
            <item.icon className="h-8 w-8 text-white" />
          </motion.div>

          {/* Content */}
          <div style={{ transform: "translateZ(20px)" }}>
            <h3 className="text-lg font-bold mb-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>

          {/* Decorative corner */}
          <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhyUsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            چرا ویرا؟
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            مزایای <span className="text-primary">یادگیری</span> در آموزشگاه ما
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            با انتخاب ویرا، تجربه‌ای متفاوت از یادگیری زبان انگلیسی داشته باشید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {advantages.map((item, index) => (
            <AdvantageCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
