'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiAward, FiCalendar } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, label: 'دنبال‌کننده', value: 900, suffix: '+', display: '۹۰۰+' },
  { icon: FiBookOpen, label: 'دانشجو', value: 500, suffix: '+', display: '۵۰۰+' },
  { icon: FiAward, label: 'دوره آموزشی', value: 10, suffix: '+', display: '۱۰+' },
  { icon: FiCalendar, label: 'سال تجربه', value: 5, suffix: '+', display: '۵+' },
];

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">
                {stat.display}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
