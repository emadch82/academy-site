'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiStar, FiUsers, FiArrowLeft, FiArrowRight, FiShoppingCart, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { courses, formatPrice } from '@/lib/courses-data';
import { useCart } from '@/contexts/cart-context';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const categories = ['همه', 'کودکان', 'نوجوانان', 'بزرگسالان', 'مکالمه', 'TTC', 'آزمون', 'فرهنگی', 'آنلاین'];

export default function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const { addItem, removeItem, isInCart, isPurchased } = useCart();

  const requireAuth = (callback: () => void) => {
    if (!Cookies.get('amz_access')) {
      toast.error('برای افزودن به سبد خرید ابتدا وارد شوید');
      router.push('/auth/login');
      return;
    }
    callback();
  };

  const handleAddToCart = (e: React.MouseEvent, course: typeof courses[0]) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      const added = addItem(course);
      if (added) {
        toast.success('به سبد خرید اضافه شد');
      } else {
        toast('در سبد خرید موجود است', { icon: '🛒' });
      }
    });
  };

  const handleRemoveFromCart = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(courseId);
    toast.success('از سبد حذف شد');
  };

  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title.includes(search) ||
      course.teacher.includes(search) ||
      course.description.includes(search);
    const matchCategory = selectedCategory === 'همه' || course.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                <FiArrowRight className="h-4 w-4" />
                بازگشت
              </Link>
              <div className="w-16 shrink-0 hidden sm:block" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center md:text-right flex flex-col justify-center w-full"
          >
            <h1 className="text-2xl sm:text-4xl font-bold">دپارتمان‌های آموزشی آموزشگاه زبان ویرا</h1>
            <p className="text-muted-foreground max-w-lg mt-3">
              از بین دوره‌های متنوع، دوره مناسب خود را پیدا کنید
            </p>

            <div className="mt-6 w-full">
              <div className="relative">
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-xl border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                  placeholder="جستجو در دوره‌ها..."
                />
              </div>
            </div>

            <div className="flex flex-nowrap gap-2 mt-4 justify-start overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 rounded-2xl overflow-hidden border w-full"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain"
            >
              <source src="/videos/courses-motion.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/courses/${course.id}`} className="group block h-full">
                <div className="bg-background rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                      {course.category}
                    </div>
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur text-xs px-2 py-1 rounded-full">
                      {course.sessions} جلسه
                    </div>
                    {isPurchased(course.id) && (
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                        <FiCheckCircle className="h-3 w-3" />
                        خریداری شده
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {course.description}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FiUsers className="h-3 w-3" />
                      {course.teacher}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {course.sessions} جلسه
                      </div>
                      <div className="flex items-center gap-1">
                        <FiStar className="h-3 w-3 text-yellow-500" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                      {isPurchased(course.id) ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-500/10 text-green-600 text-sm font-bold">
                          <FiCheckCircle className="h-4 w-4" />
                          خریداری شده
                        </div>
                      ) : isInCart(course.id) ? (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFromCart(e, course.id)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-500 text-white text-sm font-bold hover:bg-red-500 transition-colors"
                        >
                          <FiCheck className="h-4 w-4" />
                          در سبد خرید (حذف)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, course)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all hover:shadow-md active:scale-[0.98]"
                        >
                          <FiShoppingCart className="h-4 w-4" />
                          افزودن به سبد خرید
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <FiSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">دوره‌ای یافت نشد</p>
            <p className="text-muted-foreground mt-1">فیلترها یا عبارت جستجو را تغییر دهید</p>
          </div>
        )}
      </div>
    </main>
  );
}
