'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiUsers, FiBookOpen, FiAward, FiCalendar } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, label: 'دانش‌آموز', value: 50, suffix: '+', display: '۵۰+' },
  { icon: FiBookOpen, label: 'سابقه', value: 15, suffix: '+', display: '۱۵+' },
  { icon: FiAward, label: 'دپارتمان', value: 8, suffix: '+', display: '۸+' },
  { icon: FiCalendar, label: 'سال فعالیت', value: 15, suffix: '+', display: '۱۵+' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const persianDigits = count.toLocaleString('fa-IR');
  return <span ref={ref}>{persianDigits}{suffix}</span>;
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateX: [0, 5, 0], rotateY: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className="text-center group"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotateY: 10 }}
                className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 shadow-lg group-hover:shadow-primary/25 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-primary" />
              </motion.div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
