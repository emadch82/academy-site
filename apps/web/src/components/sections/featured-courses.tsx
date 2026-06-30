'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { courses, formatPrice } from '@/lib/courses-data';

const featuredIds = ['ai-course', 'web-design', 'programming', 'english', 'public-speaking', 'icdl', 'painting', 'robotics', 'talent'];

export function FeaturedCourses() {
  const featured = courses.filter(c => featuredIds.includes(c.id)).slice(0, 9);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold">دوره‌های آموزشی</h2>
            <p className="text-muted-foreground mt-2">تمام دوره‌های آموزشگاه نجوای قلم</p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            مشاهده همه
            <FiArrowLeft className="mr-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/courses/${course.id}`} className="group block">
                <div className="bg-background rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                  {/* Course Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                      {course.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
