'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowRight, FiArrowLeft, FiShoppingCart, FiCheckCircle, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/courses-data';

export default function CartPage() {
  const { items, removeItem, clearCart, totalItems, totalPrice, purchased } = useCart();

  if (items.length === 0 && purchased.length === 0) {
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
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/courses"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <FiArrowRight className="ml-1 h-4 w-4" />
              ادامه خرید
            </Link>

            {/* Cart Items */}
            {items.length > 0 && (
              <>
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
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/courses/${item.course.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-bold text-lg line-clamp-1">{item.course.title}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">{item.course.teacher}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.course.category} • {item.course.sessions} جلسه</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xl font-bold text-primary">{formatPrice(item.course.price)}</p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.course.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-background rounded-2xl border p-6 sticky top-24 shadow-lg">
                      <h2 className="text-lg font-bold mb-6">خلاصه سفارش</h2>
                      <div className="space-y-3 mb-6">
                        {items.map((item) => (
                          <div key={item.course.id} className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1 ml-2">{item.course.title}</span>
                            <span className="font-medium shrink-0">{formatPrice(item.course.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">مبلغ قابل پرداخت</span>
                          <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                      <Link
                        href="/checkout"
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all"
                      >
                        <FiCreditCard className="h-5 w-5" />
                        تکمیل خرید
                      </Link>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FiShield className="h-4 w-4 text-green-500 shrink-0" />
                          <span>پرداخت امن و مطمئن</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FiTruck className="h-4 w-4 text-orange-500 shrink-0" />
                          <span>دسترسی فوری به دوره</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Purchased Courses */}
            {purchased.length > 0 && (
              <div className={items.length > 0 ? 'mt-12' : ''}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold">دوره‌های خریداری شده</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchased.map((item, index) => (
                    <motion.div
                      key={item.course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-background rounded-2xl border p-4 hover:shadow-md transition-shadow"
                    >
                      <Link href={`/courses/${item.course.id}`} className="block">
                        <img
                          src={item.course.imageUrl}
                          alt={item.course.title}
                          className="w-full h-40 rounded-xl object-cover mb-3"
                        />
                        <h3 className="font-bold line-clamp-1">{item.course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.course.teacher}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold text-primary">{formatPrice(item.course.price)}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">خریداری شده</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
