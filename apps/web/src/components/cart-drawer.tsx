'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiArrowLeft, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/contexts/cart-context';
import { useDrawer } from '@/contexts/drawer-context';
import { formatPrice } from '@/lib/courses-data';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, totalItems, totalPrice } = useCart();
  const { setCartOpen } = useDrawer();

  const openDrawer = () => { setIsOpen(true); setCartOpen(true); };
  const closeDrawer = () => { setIsOpen(false); setCartOpen(false); };

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openDrawer}
        className="relative p-2 rounded-lg hover:bg-muted transition-all group"
      >
        <FiShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shadow-md"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Portal-style drawer rendered at body level */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div
            style={{ zIndex: 9999, display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(var(--background))', top: 0, right: 0, height: '100dvh', width: '100%', maxWidth: 420, position: 'fixed' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b shrink-0" style={{ backgroundColor: 'hsl(var(--background))' }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">سبد خرید</h2>
                  <p className="text-xs text-muted-foreground">{totalItems} دوره</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ minHeight: 300 }}>
                  <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
                    <FiShoppingCart className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <p className="font-medium text-lg mb-2">سبد خرید خالی است</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    دوره‌های مورد علاقه‌تان را به سبد اضافه کنید
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    مشاهده دوره‌ها
                    <FiArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.course.id}
                      className="flex gap-3 rounded-xl p-3 border transition-colors group"
                      style={{ backgroundColor: 'hsl(var(--muted))' }}
                    >
                      <Link
                        href={`/courses/${item.course.id}`}
                        onClick={closeDrawer}
                        className="shrink-0"
                      >
                        <img
                          src={item.course.imageUrl}
                          alt={item.course.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/courses/${item.course.id}`}
                onClick={closeDrawer}
                            className="text-sm font-bold hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.course.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.course.teacher}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {item.course.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.course.sessions} جلسه
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(item.course.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.course.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-5 space-y-4 shrink-0" style={{ backgroundColor: 'hsl(var(--background))' }}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">تعداد دوره‌ها</span>
                    <span className="font-medium">{totalItems} دوره</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">جمع کل</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  تکمیل خرید
                  <FiArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 w-full border text-primary py-3 rounded-xl font-medium hover:bg-primary/5 transition-colors text-sm"
                >
                  مشاهده سبد خرید
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
