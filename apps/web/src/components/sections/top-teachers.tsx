'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiArrowLeft } from 'react-icons/fi';

const teachers = [
  {
    id: '1',
    name: 'دکتر محمد احمدی',
    specialty: 'برنامه‌نویسی وب',
    rating: 4.9,
    students: 1250,
    courses: 12,
    avatar: '/teachers/teacher1.jpg',
  },
  {
    id: '2',
    name: 'سارا رضایی',
    specialty: 'طراحی گرافیک',
    rating: 4.8,
    students: 980,
    courses: 8,
    avatar: '/teachers/teacher2.jpg',
  },
  {
    id: '3',
    name: 'علی محمدی',
    specialty: 'مدیریت پروژه',
    rating: 4.7,
    students: 750,
    courses: 6,
    avatar: '/teachers/teacher3.jpg',
  },
  {
    id: '4',
    name: 'زهرا کریمی',
    specialty: 'هوش مصنوعی',
    rating: 4.9,
    students: 1100,
    courses: 10,
    avatar: '/teachers/teacher4.jpg',
  },
];

export function TopTeachers() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold">اساتید برتر</h2>
            <p className="text-muted-foreground mt-2">بهترین اساتید با تجربه بالا</p>
          </div>
          <Link
            href="/teachers"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            مشاهده همه
            <FiArrowLeft className="mr-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/teachers/${teacher.id}`} className="group block">
                <div className="bg-background rounded-xl border p-6 text-center transition-all hover:shadow-lg hover:border-primary/50">
                  {/* Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary">
                      {teacher.name.charAt(0)}
                    </div>
                  </div>

                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{teacher.specialty}</p>

                  <div className="flex items-center justify-center gap-1 mt-3">
                    <FiStar className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{teacher.rating}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <div className="text-lg font-bold">{teacher.students.toLocaleString('fa-IR')}</div>
                      <div className="text-xs text-muted-foreground">دانشجو</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{teacher.courses}</div>
                      <div className="text-xs text-muted-foreground">دوره</div>
                    </div>
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
