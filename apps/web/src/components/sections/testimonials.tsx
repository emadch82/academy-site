'use client';

import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const testimonials = [
  {
    id: '1',
    name: 'رضا حسینی',
    course: 'برنامه‌نویسی وب',
    rating: 5,
    comment: 'دوره بسیار عالی بود و استاد توضیحات خیلی خوبی دادند. ممنونم از تیم آموزشگاه.',
  },
  {
    id: '2',
    name: 'مریم عباسی',
    course: 'طراحی گرافیک',
    rating: 5,
    comment: 'بهترین آموزشگاهی که تا حالا رفتم. کیفیت آموزش عالی و پشتیبانی عالی.',
  },
  {
    id: '3',
    name: 'امیر رضایی',
    course: 'هوش مصنوعی',
    rating: 4,
    comment: 'محتوای دوره خیلی کامل بود و به خوبی بازار کار را پوشش می‌دهد.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">نظرات دانشجویان</h2>
          <p className="text-muted-foreground mt-2">آنچه دانشجویان ما می‌گویند</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-background rounded-xl border p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <FiMessageSquare className="h-8 w-8 text-primary/20" />
                </div>

                <p className="text-muted-foreground flex-1">{testimonial.comment}</p>

                <div className="flex items-center gap-1 mt-4">
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

                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.course}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
