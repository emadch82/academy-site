'use client';

import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const departments = [
  {
    id: 'children',
    title: 'دوره‌های کودکان',
    description: 'آموزش زبان برای کودکان ۵ تا ۱۰ سال با بازی و کلاس‌های خلاقانه',
    icon: '🎮',
    color: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    ageRange: '۵ تا ۱۰ سال',
  },
  {
    id: 'junior',
    title: 'دوره‌های نوجوانان',
    description: 'برنامه‌های تخصصی برای نوجوانان ۱۴ تا ۱۶ سال',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    ageRange: '۱۴ تا ۱۶ سال',
  },
  {
    id: 'adult',
    title: 'دوره‌های بزرگسالان',
    description: 'آموزش زبان انگلیسی از پایه تا پیشرفته برای بزرگسالان',
    icon: '🎓',
    color: 'from-violet-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
  },
  {
    id: 'conversation',
    title: 'دوره‌های مکالمه SPO',
    description: 'تقویت مهارت‌های Listening و Speaking با روش SPO',
    icon: '💬',
    color: 'from-amber-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  },
  {
    id: 'ttc',
    title: 'دوره‌های TTC',
    description: 'تربیت مدرس با مدرک بین‌المللی',
    icon: '👨‍🏫',
    color: 'from-emerald-500 to-green-500',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
  },
  {
    id: 'moc',
    title: 'آزمون‌های MOC',
    description: 'آمادگی آزمون ماک آکادمیک آیلتس',
    icon: '✈️',
    color: 'from-sky-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
  },
  {
    id: 'online',
    title: 'دوره‌های آنلاین',
    description: 'آموزش آنلاین Virtual Learning از سراسر دنیا',
    icon: '💻',
    color: 'from-indigo-500 to-violet-500',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
  },
  {
    id: 'book-movie',
    title: 'معرفی کتاب و فیلم',
    description: 'معرفی کتاب و فیلم متناسب با سطح زبان هر فرد',
    icon: '📖',
    color: 'from-teal-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  },
];

function CourseCard({ course, index }: { course: typeof departments[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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
      initial={{ opacity: 0, y: 60, rotateX: -20 }}
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
        whileHover={{ scale: 1.02 }}
        className="group block cursor-pointer"
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
          {/* Course Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
            <div className="absolute top-4 right-4 text-4xl" style={{ transform: "translateZ(30px)" }}>
              {course.icon}
            </div>
            <div className="absolute bottom-4 left-4 right-4" style={{ transform: "translateZ(20px)" }}>
              <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-5" style={{ transform: "translateZ(10px)" }}>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between">
              <Link
                href={`/courses/${course.id}`}
                className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all"
              >
                اطلاعات بیشتر
                <FiArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedCourses() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
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
            دپارتمان‌های آموزشی
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            دوره‌های <span className="text-primary">آموزشی</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            متنوع‌ترین دوره‌های آموزش زبان انگلیسی برای تمام سنین
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
