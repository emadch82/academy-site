'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';

const testimonials = [
  {
    id: '1',
    name: 'سارا محمدی',
    course: 'دوره مکالمه',
    rating: 5,
    comment: 'بهترین آموزشگاه زبانی که تا حالا رفتم. کلاس‌های SPO خیلی به مکالمه‌ام کمک کرد. خیلی ممنونم از تیم ویرا.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'علی رضایی',
    course: 'دوره بزرگسالان',
    rating: 5,
    comment: 'دوره بزرگسالان ویرا عالی بود. خانم مردانی واقعا استاد خوبی هستند. پیشرفت چشمگیری داشتم.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    name: 'مریم حسینی',
    course: 'دوره کودکان',
    rating: 5,
    comment: 'پسرم عاشق کلاس‌های ویرا شده. خانم امیرسلیمانی محیط بسیار صمیمی و خلاقانه‌ای درست کرده.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '4',
    name: 'امیر کریمی',
    course: 'دوره TTC',
    rating: 5,
    comment: 'دوره TTC ویرا واقعا حرفه‌ای بود. خانم مردانی با مدرک TESOL واقعا بهترین مدرس هستند.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
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
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, z: 50 }}
        className="group"
      >
        <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
          {/* Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 left-6"
            style={{ transform: "translateZ(20px)" }}
          >
            <FaQuoteRight className="h-16 w-16 text-primary" />
          </motion.div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4" style={{ transform: "translateZ(15px)" }}>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-muted-foreground leading-relaxed mb-6 relative z-10" style={{ transform: "translateZ(10px)" }}>
            {testimonial.comment}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 pt-4 border-t" style={{ transform: "translateZ(15px)" }}>
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <div className="text-sm font-bold">{testimonial.name}</div>
              <div className="text-xs text-primary">{testimonial.course}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-40 h-40 border border-primary/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-60 h-60 border border-secondary/10 rounded-full"
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
            نظرات دانش‌آموزان
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            آنچه <span className="text-primary">دانش‌آموزان</span> ما می‌گویند
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تجربه واقعی دانش‌آموزان ما از یادگیری در آکادمی ویرا
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
