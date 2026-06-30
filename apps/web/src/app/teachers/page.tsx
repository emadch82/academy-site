'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiBookOpen, FiUsers } from 'react-icons/fi';

const teachers = [
  {
    id: '1',
    name: 'دکتر محمد احمدی',
    specialty: 'برنامه‌نویسی وب',
    bio: 'بیش از ۱۰ سال تجربه در برنامه‌نویسی وب و آموزش',
    rating: 4.9,
    students: 1250,
    courses: 12,
    qualifications: ['دکترای کامپیوتر', '_MCIA Certified'],
    avatar: '/teachers/teacher1.jpg',
  },
  {
    id: '2',
    name: 'سارا رضایی',
    specialty: 'طراحی گرافیک',
    bio: 'طراح گرافیک حرفه‌ای با سابقه کار در برندهای بزرگ',
    rating: 4.8,
    students: 980,
    courses: 8,
    qualifications: ['کارشناسی ارشد طراحی', 'Adobe Certified'],
    avatar: '/teachers/teacher2.jpg',
  },
  {
    id: '3',
    name: 'علی محمدی',
    specialty: 'مدیریت پروژه',
    bio: 'مشاور مدیریت پروژه با تجربه بین‌المللی',
    rating: 4.7,
    students: 750,
    courses: 6,
    qualifications: ['PMP', 'PRINCE2', 'MBA'],
    avatar: '/teachers/teacher3.jpg',
  },
  {
    id: '4',
    name: 'زهرا کریمی',
    specialty: 'هوش مصنوعی',
    bio: 'پژوهشگر هوش مصنوعی و یادگیری عمیق',
    rating: 4.9,
    students: 1100,
    courses: 10,
    qualifications: ['دکترای AI', 'Google AI Certified'],
    avatar: '/teachers/teacher4.jpg',
  },
  {
    id: '5',
    name: 'امین قاسمی',
    specialty: 'بازاریابی دیجیتال',
    bio: 'متخصص بازاریابی آنلاین و سئو',
    rating: 4.7,
    students: 890,
    courses: 7,
    qualifications: ['Google Analytics', 'HubSpot Certified'],
    avatar: '/teachers/teacher5.jpg',
  },
  {
    id: '6',
    name: 'لیلا نوری',
    specialty: 'زبان انگلیسی',
    bio: 'مدرس بین‌المللی زبان انگلیسی با TESOL',
    rating: 4.5,
    students: 1560,
    courses: 9,
    qualifications: ['TESOL', 'IELTS 8.5'],
    avatar: '/teachers/teacher6.jpg',
  },
];

export default function TeachersPage() {
  const [search, setSearch] = useState('');

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.includes(search) ||
      t.specialty.includes(search)
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">اساتید مجرب</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              با بهترین اساتید بازار کار یاد بگیرید
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-xl border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                placeholder="جستجوی استاد..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/teachers/${teacher.id}`} className="group block">
                <div className="bg-background rounded-xl border p-6 transition-all hover:shadow-lg hover:border-primary/50">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{teacher.specialty}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{teacher.bio}</p>

                  {/* Qualifications */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.qualifications.slice(0, 2).map((q) => (
                      <span key={q} className="text-xs bg-muted px-2 py-1 rounded">
                        {q}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500">
                        <FiStar className="h-4 w-4 fill-current" />
                        <span className="font-medium">{teacher.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">امتیاز</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiUsers className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{teacher.students.toLocaleString('fa-IR')}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">دانشجو</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiBookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{teacher.courses}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">دوره</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">استادی یافت نشد</p>
          </div>
        )}
      </div>
    </main>
  );
}
