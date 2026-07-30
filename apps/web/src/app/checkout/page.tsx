'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiUser, FiPhone, FiMail, FiCreditCard, FiShield, FiLock, FiTag, FiDownload } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { useCart } from '@/contexts/cart-context';
import { useDiscount } from '@/contexts/discount-context';
import { useWallet } from '@/contexts/wallet-context';
import { useInvoices } from '@/contexts/invoice-context';
import { formatPrice } from '@/lib/courses-data';
import { db, initializeDB } from '@/lib/store';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, addPurchased } = useCart();
  const { applyCode } = useDiscount();
  const { balance, deduct, canAfford } = useWallet();
  const { invoices, addInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountResult, setDiscountResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    nationalCode: '',
    paymentMethod: 'online',
    note: '',
  });

  useEffect(() => {
    const raw = Cookies.get('amz_user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setForm((prev) => ({ ...prev, fullName: user.name || '', email: user.identifier || '', phone: user.phone || '' }));
      } catch {}
    }
  }, []);

  const finalPrice = totalPrice - (discountResult?.valid ? discountResult.discount : 0);

  if (items.length === 0 && !isDone) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <FiCreditCard className="h-12 w-12 text-primary/40" />
            </div>
            <h1 className="text-2xl font-bold mb-4">سبد خرید خالی است</h1>
            <p className="text-muted-foreground mb-8">ابتدا دوره‌های مورد نظر خود را به سبد خرید اضافه کنید.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              مشاهده دوره‌ها
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  if (isDone) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto"
          >
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">ثبت‌نام با موفقیت انجام شد!</h1>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              ثبت‌نام شما با موفقیت ثبت شد.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              هماهنگی‌های لازم از طریق تلفن با شما تماس گرفته خواهد شد.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  const inv = invoices.find((i) => i.id === lastInvoiceId);
                  if (inv) {
                    const text = `فاکتور خرید - آموزشگاه زبان ویرا\nتاریخ: ${inv.date}\nشماره: ${inv.orderId}\n\n${inv.items.map((it) => `${it.title}: ${formatPrice(it.price)}`).join('\n')}\n\nجمع: ${formatPrice(inv.subtotal)}\nتخفیف: ${formatPrice(inv.discount)}\nپرداختی: ${formatPrice(inv.total)}\nروش: ${inv.paymentMethod === 'online' ? 'آنلاین' : inv.paymentMethod === 'wallet' ? 'کیف پول' : inv.paymentMethod === 'installment' ? 'اقساطی' : 'نقدی'}`;
                    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `invoice-${inv.orderId}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                className="px-8 py-3 rounded-xl border font-medium hover:bg-muted transition-colors flex items-center gap-2"
              >
                <FiDownload className="h-4 w-4" /> دانلود فاکتور
              </button>
              <Link
                href="/courses"
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
              >
                دوره‌های دیگر
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      toast.error('لطفاً نام و شماره تماس را وارد کنید');
      return;
    }
    setIsSubmitting(true);

    if (form.paymentMethod === 'online') {
      const orderId = `ORD-${Date.now()}`;
      localStorage.setItem('pendingPurchase', JSON.stringify({
        courses: items.map((item) => item.course),
        orderId,
        total: finalPrice,
      }));
      setTimeout(() => {
        router.push(`/payment?amount=${finalPrice}&orderId=${orderId}`);
        setIsSubmitting(false);
      }, 500);
      return;
    }

    if (form.paymentMethod === 'wallet') {
      if (!canAfford(finalPrice)) {
        toast.error('موجودی کیف پول کافی نیست');
        setIsSubmitting(false);
        return;
      }
      deduct(finalPrice, `خرید ${items.length} دوره`);
    }

    const invoice = addInvoice({
      orderId: `ORD-${Date.now()}`,
      items: items.map((item) => ({ title: item.course.title, price: item.course.price, quantity: 1 })),
      subtotal: totalPrice,
      discount: discountResult?.valid ? discountResult.discount : 0,
      total: finalPrice,
      paymentMethod: form.paymentMethod,
      customerName: form.fullName,
      customerPhone: form.phone,
      customerEmail: form.email || undefined,
      nationalCode: form.nationalCode || undefined,
    });
    addPurchased(items.map((item) => item.course), invoice.orderId);
    initializeDB();
    const userCookie = Cookies.get('amz_user');
    const u = userCookie ? JSON.parse(userCookie) : null;
    db.addTransaction({
      userId: u?.id || 'guest',
      userName: u?.name || form.fullName,
      type: 'income',
      amount: finalPrice,
      description: `خرید ${items.length} دوره - ${items.map((i) => i.course.title).join(', ')}`,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'completed',
      paymentMethod: form.paymentMethod === 'online' ? 'آنلاین' : form.paymentMethod === 'wallet' ? 'کیف پول' : 'نقدی',
    });
    items.forEach((item) => {
      db.logActivity({ type: 'purchase', userId: u?.id || 'guest', userName: u?.name || 'ناشناس', detail: `خرید دوره «${item.course.title}»`, meta: `${item.course.price.toLocaleString('fa-IR')} تومان` });
    });
    setLastInvoiceId(invoice.id);
    clearCart();
    setIsDone(true);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت به سبد خرید
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FiLock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">تکمیل خرید</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="bg-background rounded-2xl border p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FiUser className="h-5 w-5 text-primary" />
                      اطلاعات شخصی
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">نام و نام خانوادگی *</label>
                        <input
                          type="text"
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          className="w-full h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                          placeholder="نام کامل خود را وارد کنید"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FiPhone className="inline ml-1 h-4 w-4" />
                          شماره تماس *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                          placeholder="۰۹۱۳..."
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FiMail className="inline ml-1 h-4 w-4" />
                          ایمیل (اختیاری)
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                          placeholder="email@example.com"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">کد ملی (اختیاری)</label>
                        <input
                          type="text"
                          value={form.nationalCode}
                          onChange={(e) => setForm({ ...form, nationalCode: e.target.value })}
                          className="w-full h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                          placeholder="۱۲۳۴۵۶۷۸۹۰"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-background rounded-2xl border p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FiCreditCard className="h-5 w-5 text-primary" />
                      روش پرداخت
                    </h2>
                    <div className="space-y-3">
                      {[
                        { value: 'online', label: 'پرداخت آنلاین', desc: 'پرداخت از طریق درگاه بانکی', color: 'text-blue-500' },
                        { value: 'wallet', label: `پرداخت با کیف پول (${formatPrice(balance)} تومان)`, desc: 'پرداخت از موجودی کیف پول', color: 'text-purple-500' },
                        { value: 'cash', label: 'پرداخت نقدی', desc: 'پرداخت در محل آموزشگاه', color: 'text-green-500' },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.paymentMethod === method.value
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/30 hover:bg-muted/30'
                          } ${method.value === 'wallet' && !canAfford(finalPrice) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.value}
                            checked={form.paymentMethod === method.value}
                            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                            className="accent-primary w-4 h-4"
                            disabled={method.value === 'wallet' && !canAfford(finalPrice)}
                          />
                          <FiCreditCard className={`h-5 w-5 ${method.color}`} />
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="bg-background rounded-2xl border p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FiTag className="h-5 w-5 text-primary" />
                      کد تخفیف
                    </h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        placeholder="کد تخفیف را وارد کنید"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!discountCode) return;
                          const result = applyCode(discountCode, totalPrice);
                          setDiscountResult(result);
                          if (result.valid) toast.success(result.message);
                          else toast.error(result.message);
                        }}
                        className="px-6 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                      >
                        اعمال
                      </button>
                    </div>
                    {discountResult && discountResult.valid && (
                      <p className="text-sm text-green-600 mt-3">تخفیف: {formatPrice(discountResult.discount)} تومان</p>
                    )}
                  </div>

                  {/* Note */}
                  <div className="bg-background rounded-2xl border p-6">
                    <h2 className="text-lg font-bold mb-4">توضیحات (اختیاری)</h2>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow min-h-[100px] resize-none"
                      placeholder="سوال یا توضیحی دارید؟ اینجا بنویسید..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <FiLock className="h-5 w-5" />
                        ثبت سفارش
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <FiShield className="h-4 w-4 text-green-500" />
                    <span>اطلاعات شما محرمانه و امن نگهداری می‌شود</span>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-background rounded-2xl border p-6 sticky top-24 shadow-lg">
                  <h2 className="text-lg font-bold mb-6">خلاصه سفارش</h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.course.id} className="flex gap-3">
                        <img
                          src={item.course.imageUrl}
                          alt={item.course.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.course.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.course.teacher}</p>
                          <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.course.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">جمع کل</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {discountResult?.valid && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>تخفیف ({discountResult.message})</span>
                        <span>-{formatPrice(discountResult.discount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-bold text-lg">مبلغ قابل پرداخت</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(finalPrice)}</span>
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
