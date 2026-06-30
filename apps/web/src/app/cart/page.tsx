'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowRight, FiArrowLeft, FiShoppingCart, FiPlus, FiMinus, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/courses-data';

export default function CartPage() {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="h-14 w-14 text-primary/40" />
            </div>
            <h1 className="text-3xl font-bold mb-3">سبد خرید خالی است</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              دوره‌های مورد علاقه خود را پیدا کنید و به سبد خرید اضافه کنید.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              مشاهده دوره‌ها
              <FiArrowLeft className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/courses"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <FiArrowRight className="ml-1 h-4 w-4" />
              ادامه خرید
            </Link>

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">سبد خرید ({totalItems})</h1>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiTrash2 className="h-4 w-4" />
                خالی کردن
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-background rounded-2xl border p-4 sm:p-5 flex gap-4 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/courses/${item.course.id}`} className="shrink-0">
                      <img
                        src={item.course.imageUrl}
                        alt={item.course.title}
                        className="w-28 h-24 sm:w-36 sm:h-28 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/courses/${item.course.id}`}
                          className="font-bold text-base hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.course.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{item.course.teacher}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                            {item.course.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.course.sessions} جلسه
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(item.course.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.course.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-background rounded-2xl border p-6 sticky top-24 shadow-lg">
                  <h2 className="text-lg font-bold mb-6">خلاصه سفارش</h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.course.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[180px]">{item.course.title}</span>
                        <span className="font-medium shrink-0">{formatPrice(item.course.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">تعداد دوره‌ها</span>
                      <span className="font-medium">{totalItems} دوره</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-bold">جمع کل</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] mt-6"
                  >
                    تکمیل خرید
                    <FiArrowLeft className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/courses"
                    className="flex items-center justify-center gap-2 w-full border text-primary py-3 rounded-xl font-medium hover:bg-primary/5 transition-colors mt-3"
                  >
                    ادامه خرید
                    <FiArrowLeft className="h-4 w-4" />
                  </Link>

                  {/* Trust badges */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FiShield className="h-4 w-4 text-green-500 shrink-0" />
                      <span>پرداخت امن و مطمئن</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FiCreditCard className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>امکان پرداخت اقساطی</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FiTruck className="h-4 w-4 text-orange-500 shrink-0" />
                      <span>دسترسی فوری به دوره</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
