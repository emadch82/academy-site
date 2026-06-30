'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiUser,
  FiPhone,
  FiClock,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiBookOpen,
} from 'react-icons/fi';
import { courses } from '@/lib/courses-data';

const consultationSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل نامعتبر است'),
  courseId: z.string().min(1, 'لطفاً یک دوره را انتخاب کنید'),
  preferredTime: z.string().min(1, 'لطفاً زمان مورد نظر را انتخاب کنید'),
  message: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

const timeSlots = [
  'صبح (۹ الی ۱۲)',
  'ظهر (۱۲ الی ۱۵)',
  'عصر (۱۵ الی ۱۸)',
  'شب (۱۸ الی ۲۱)',
];

export default function ConsultationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = (data: ConsultationForm) => {
    console.log('Consultation form:', data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">درخواست شما ثبت شد!</h1>
          <p className="text-muted-foreground mb-8">
            همکاران ما در اسرع وقت با شما تماس خواهند گرفت. از توجه شما متشکریم.
          </p>
          <a
            href="/"
            className="block bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            بازگشت به صفحه اصلی
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">مشاوره رایگان</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              برای انتخاب بهترین دوره متناسب با نیازهایتان، فرم زیر را تکمیل کنید تا کارشناسان ما با شما تماس بگیرند
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-background rounded-xl border p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                <div className="relative">
                  <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    {...register('name')}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">شماره موبایل</label>
                <div className="relative">
                  <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    {...register('phone')}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">دوره مورد علاقه</label>
                <div className="relative">
                  <FiBookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    {...register('courseId')}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                  >
                    <option value="">یک دوره را انتخاب کنید</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.courseId && (
                  <p className="text-destructive text-xs mt-1">{errors.courseId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">زمان مورد نظر برای تماس</label>
                <div className="relative">
                  <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    {...register('preferredTime')}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                  >
                    <option value="">زمان مورد نظر را انتخاب کنید</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferredTime && (
                  <p className="text-destructive text-xs mt-1">{errors.preferredTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">پیام شما (اختیاری)</label>
                <div className="relative">
                  <FiMessageSquare className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="سوالات یا توضیحات خود را بنویسید..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <FiSend className="h-4 w-4" />
                ارسال درخواست مشاوره
              </button>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl border p-4 text-center">
              <FiPhone className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">تماس تلفنی</p>
              <p className="text-xs text-muted-foreground mt-1" dir="ltr">021-12345678</p>
            </div>
            <div className="bg-background rounded-xl border p-4 text-center">
              <FiClock className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">ساعات کاری</p>
              <p className="text-xs text-muted-foreground mt-1">شنبه تا پنجشنبه ۹ الی ۱۸</p>
            </div>
            <div className="bg-background rounded-xl border p-4 text-center">
              <FiMessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">مشاوره رایگان</p>
              <p className="text-xs text-muted-foreground mt-1">بدون هیچ هزینه‌ای</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
