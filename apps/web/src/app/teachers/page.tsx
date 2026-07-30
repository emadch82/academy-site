'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiBookOpen, FiAward } from 'react-icons/fi';

const teachers = [
  {
    id: '1',
    name: 'نسیم خدابخش',
    specialty: 'مدیریت مجموعه',
    bio: 'موسس و مدیریت آکادمی زبان ویرا',
    qualifications: ['PhD Candidate in TEFL', 'MA in TEFL', 'BA in English Literature'],
    experience: 'بیش از ۱۰ سال سابقه تدریس',
    avatar: '/images/nasim.jpg',
  },
  {
    id: '2',
    name: 'غزال امیرسلیمانی',
    specialty: 'مدرس کودک و نوجوان',
    bio: 'مدرس تخصصی کودک و نوجوان با تجربه آموزش در محیط‌های خلاقانه',
    qualifications: ['TTC معتبر'],
    experience: 'بیش از ۳ سال سابقه تدریس کودک و نوجوان',
    avatar: '/images/female-avatar.png',
  },
  {
    id: '3',
    name: 'زهرا مردانی',
    specialty: 'مدرس TTC و بزرگسال',
    bio: 'مدرس TTC و بزرگسال با سابقه تدریس گسترده',
    qualifications: ['فوق لیسانس آموزش زبان انگلیسی', 'مدرک TESOL'],
    experience: 'بیش از ۱۰ سال سابقه تدریس',
    avatar: '/images/zahra.jpg',
  },
  {
    id: '4',
    name: 'سوگل سرشوقی',
    specialty: 'مدرس کودک و نوجوان',
    bio: 'مدرس تخصصی کودک و نوجوان با مدرک بین‌المللی',
    qualifications: ['BA in English Literature', 'TTC'],
    experience: 'بیش از ۷ سال سابقه تدریس',
    avatar: '/images/female-avatar.png',
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
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">پرسنل مجموعه</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              با مجرب‌ترین اساتید آموزش زبان انگلیسی در اصفهان آشنا شوید
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

      {/* Motion Video */}
      <div className="container mx-auto px-4 py-8">
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
            className="w-full h-auto max-h-[400px] object-cover"
          >
            <source src="/videos/teachers-motion.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Teachers Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl border overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                {/* Avatar */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                    <p className="text-sm text-primary-foreground/80">{teacher.specialty}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-muted-foreground">{teacher.bio}</p>

                  {/* Qualifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FiAward className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">مدارک</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.qualifications.map((q) => (
                        <span key={q} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t">
                    <FiBookOpen className="h-4 w-4" />
                    <span>{teacher.experience}</span>
                  </div>
                </div>
              </div>
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
