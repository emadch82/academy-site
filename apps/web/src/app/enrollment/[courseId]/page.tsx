'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiCreditCard,
  FiBookOpen,
  FiCheckCircle,
} from 'react-icons/fi';
import { getCourseById, formatPrice } from '@/lib/courses-data';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل نامعتبر است'),
  email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;

const paymentMethods = [
  { id: 'online', label: 'پرداخت آنلاین', icon: FiCreditCard, description: 'پرداخت امن از طریق درگاه بانکی' },
  { id: 'installment', label: 'اقساطی', icon: FiBookOpen, description: 'پرداخت در ۳ قسط مساوی' },
  { id: 'inperson', label: 'حضوری', icon: FiUser, description: 'پرداخت در محل آموزشگاه' },
];

export default function EnrollmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = getCourseById(courseId);
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('online');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
  });

  if (!course) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">دوره یافت نشد</h1>
          <Link href="/courses" className="text-primary hover:underline">
            بازگشت به لیست دوره‌ها
          </Link>
        </div>
      </main>
    );
  }

  const onSubmit = () => {
    if (step === 3) {
      setIsSubmitted(true);
    } else {
      setStep(step + 1);
    }
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
          <h1 className="text-2xl font-bold mb-4">ثبت‌نام با موفقیت انجام شد!</h1>
          <p className="text-muted-foreground mb-2">
            ثبت‌نام شما در دوره <span className="font-medium text-foreground">{course.title}</span> با موفقیت ثبت شد.
          </p>
          <p className="text-muted-foreground mb-8">
            همکاران ما در اسرع وقت با شما تماس خواهند گرفت.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/courses"
              className="bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              مشاهده سایر دوره‌ها
            </Link>
            <Link
              href="/"
              className="border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <FiArrowRight className="ml-1 h-4 w-4" />
            بازگشت به صفحه دوره
          </Link>

          <h1 className="text-2xl font-bold mb-2">ثبت‌نام در دوره</h1>
          <p className="text-muted-foreground mb-8">{course.title}</p>

          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s ? <FiCheck className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-background rounded-xl border p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-lg font-bold mb-6">اطلاعات شخصی</h2>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">نام</label>
                        <div className="relative">
                          <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            {...register('firstName')}
                            className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="نام خود را وارد کنید"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">نام خانوادگی</label>
                        <div className="relative">
                          <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            {...register('lastName')}
                            className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="نام خانوادگی"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
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
                      <label className="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                      <div className="relative">
                        <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          {...register('email')}
                          className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="example@email.com"
                          dir="ltr"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      مرحله بعد
                      <FiArrowLeft className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-lg font-bold mb-6">تایید اطلاعات دوره</h2>
                  <div className="bg-muted/50 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FiBookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{course.teacher}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span>{course.sessions} جلسه</span>
                          <span>{course.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-muted-foreground">هزینه دوره</span>
                      <span className="font-medium">{formatPrice(course.price)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-muted-foreground">تعداد جلسات</span>
                      <span className="font-medium">{course.sessions} جلسه</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">مبلغ قابل پرداخت</span>
                      <span className="font-bold text-primary text-lg">{formatPrice(course.price)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      مرحله قبل
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      مرحله بعد
                      <FiArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-lg font-bold mb-6">روش پرداخت</h2>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-4 rounded-lg border text-right transition-all ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">مبلغ قابل پرداخت</span>
                      <span className="font-bold text-primary text-xl">{formatPrice(course.price)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      مرحله قبل
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onSubmit}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      تایید و ثبت‌نام
                      <FiCheck className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
