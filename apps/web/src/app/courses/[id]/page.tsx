'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiStar,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
  FiAward,
  FiShoppingCart,
  FiCheck,
} from 'react-icons/fi';
import { getCourseById, getRelatedCourses, formatPrice, courses } from '@/lib/courses-data';
import { db, initializeDB, type Course as DbCourse } from '@/lib/store';
import { useCart } from '@/contexts/cart-context';
import { ReviewForm } from '@/components/review-form';
import { ReviewsList } from '@/components/reviews-list';
import { useReviews } from '@/contexts/reviews-context';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useHydrated } from '@/hooks/use-hydrated';

type StaticCourse = ReturnType<typeof getCourseById>;
type MergedCourse = (StaticCourse & { dbId?: string }) | undefined;

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const staticCourse = getCourseById(id);
  const [course, setCourse] = useState<MergedCourse>(staticCourse);
  const { addItem, isInCart, isPurchased } = useCart();
  const { getAverageRating, getReviewCount } = useReviews();
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    initializeDB();
    const dbCourse: DbCourse | undefined =
      db.getCourseByDataId(id) || db.getCourses().find((c) => c.id === id) || (staticCourse ? db.getCourses().find((c) => c.title === staticCourse.title) : undefined);
    if (!dbCourse) return;
    const merged: MergedCourse = {
      ...(staticCourse || ({} as NonNullable<typeof staticCourse>)),
      dbId: dbCourse.id,
      id: staticCourse?.id || id,
      title: dbCourse.title,
      teacher: dbCourse.teacherName,
      price: dbCourse.price,
      category: dbCourse.category || staticCourse?.category || 'عمومی',
      level: dbCourse.level || staticCourse?.level,
      imageUrl: dbCourse.imageUrl || staticCourse?.imageUrl || '/images/ai.jpg',
      description: staticCourse?.description || dbCourse.title,
      fullDescription: staticCourse?.fullDescription || dbCourse.title,
      schedule: staticCourse?.schedule || dbCourse.duration || '',
    };
    setCourse(merged);
  }, [hydrated, id]);

  const handleAddToCart = () => {
    if (!course) return;
    if (!Cookies.get('amz_access')) {
      toast.error('برای افزودن به سبد خرید ابتدا وارد شوید');
      router.push('/auth/login');
      return;
    }
    const added = addItem(course);
    if (added) {
      toast.success('دوره به سبد خرید اضافه شد');
    } else {
      toast('این دوره قبلاً در سبد خرید شماست', { icon: '🛒' });
    }
  };

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

  const relatedCourses = getRelatedCourses(course.id, course.category, 3);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/courses"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت به لیست دوره‌ها
            </Link>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">
                  {course.category}
                </span>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground text-lg mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <FiUsers className="h-4 w-4" />
                    <span>{course.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4" />
                    <span>{course.sessions} جلسه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiStar className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating} از ۵</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBookOpen className="h-4 w-4" />
                    <span>{course.sessions} جلسه آموزشی</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {course.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs px-3 py-1.5 rounded-full"
                    >
                      <FiCheckCircle className="h-3 w-3" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-80 shrink-0">
                <div className="bg-background rounded-2xl border p-6 sticky top-24 shadow-lg">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-primary mb-1">{formatPrice(course.price)}</p>
                    <p className="text-sm text-muted-foreground">هزینه کل دوره</p>
                  </div>

                  <div className="space-y-3 mb-6 bg-muted/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <FiCalendar className="h-4 w-4 text-primary shrink-0" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FiClock className="h-4 w-4 text-primary shrink-0" />
                      <span>{course.sessions} جلسه</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FiAward className="h-4 w-4 text-primary shrink-0" />
                      <span>مدرک معتبر</span>
                    </div>
                  </div>

                  {course && isPurchased(course.id) ? (
                    <div className="flex items-center justify-center gap-2 w-full bg-green-500/10 text-green-600 py-3.5 rounded-xl font-bold text-lg">
                      <FiCheckCircle className="h-5 w-5" />
                      خریداری شده
                    </div>
                  ) : course && isInCart(course.id) ? (
                    <Link
                      href="/cart"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                      <FiCheck className="h-5 w-5" />
                      مشاهده در سبد خرید
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                    >
                      <FiShoppingCart className="h-5 w-5" />
                      افزودن به سبد خرید
                    </button>
                  )}

                  <Link
                    href={`/enrollment/${course.id}`}
                    className="block w-full text-center border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors mt-3"
                  >
                    ثبت‌نام سریع
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">توضیحات دوره</h2>
            <div className="bg-background rounded-xl border p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed">{course.fullDescription}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">سرفصل‌های دوره</h2>
            <div className="bg-background rounded-xl border p-6 mb-8">
              <div className="space-y-3">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="bg-primary/10 text-primary text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">پیش‌نیازها</h2>
            <div className="bg-background rounded-xl border p-6 mb-8">
              <p className="text-muted-foreground">{course.prerequisites}</p>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">نظرات کاربران</h2>
            <ReviewForm courseId={course.dbId || course.id} onReviewAdded={() => setReviewRefresh((r) => r + 1)} />
            <ReviewsList courseId={course.dbId || course.id} refreshKey={reviewRefresh} />
          </motion.div>

          {relatedCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">دوره‌های مرتبط</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCourses.map((rc) => (
                  <Link key={rc.id} href={`/courses/${rc.id}`} className="group block">
                    <div className="bg-background rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={rc.imageUrl}
                          alt={rc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1 text-sm">
                          {rc.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{rc.teacher}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold text-primary">{formatPrice(rc.price)}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FiStar className="h-3 w-3 text-yellow-500" />
                            {rc.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
