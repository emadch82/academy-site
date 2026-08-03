'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useCart } from '@/contexts/cart-context';
import { db, initializeDB } from '@/lib/store';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addPurchased, clearCart } = useCart();
  const amount = searchParams.get('amount') || '0';
  const orderId = searchParams.get('orderId') || '';

  const [step, setStep] = useState<'card' | 'done'>('card');
  const [showOtp, setShowOtp] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [cardOtpSent, setCardOtpSent] = useState(false);
  const [cardOtpCode, setCardOtpCode] = useState('');
  const [cardOtpInput, setCardOtpInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setCaptchaCode(code);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const isCardFilled = card.number.replace(/\s/g, '').length >= 16 && card.expiry.length >= 5 && card.cvv.length >= 3;

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCardFilled) {
      toast.error('لطفاً تمام فیلدهای کارت را پر کنید');
      return;
    }
    if (!cardOtpSent) {
      toast.error('ابتدا رمز دوم را دریافت کنید');
      return;
    }
    if (cardOtpInput !== cardOtpCode) {
      toast.error('رمز دوم اشتباه است');
      return;
    }
    if (captchaInput !== captchaCode) {
      toast.error('کد اهراز هویت اشتباه است');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const pending = localStorage.getItem('pendingPurchase');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          addPurchased(data.courses, data.orderId);
          localStorage.removeItem('pendingPurchase');
          clearCart();
          initializeDB();
          const userCookie = Cookies.get('amz_user');
          const u = userCookie ? JSON.parse(userCookie) : null;
          db.addTransaction({
            userId: u?.id || 'guest',
            userName: u?.name || 'ناشناس',
            type: 'income',
            amount: Number(amount),
            description: `پرداخت آنلاین - ${data.courses.length} دوره`,
            date: new Date().toLocaleDateString('fa-IR'),
            status: 'completed',
            paymentMethod: 'آنلاین',
          });
          data.courses.forEach((c: { id: string; title: string; price: number }) => {
            db.logActivity({ type: 'purchase', userId: u?.id || 'guest', userName: u?.name || 'ناشناس', detail: `خرید دوره «${c.title}»`, meta: `${c.price.toLocaleString('fa-IR')} تومان` });
            if (u?.id) {
              const storeCourse = db.getCourseByDataId(c.id) || db.getCourses().find((sc) => sc.title === c.title);
              if (storeCourse) {
                db.addEnrollment({
                  studentId: u.id,
                  studentName: u.name || c.title,
                  courseId: storeCourse.id,
                  courseName: storeCourse.title,
                  date: new Date().toLocaleDateString('fa-IR'),
                  status: 'confirmed',
                  amount: c.price,
                });
              }
            }
          });
        } catch {}
      }
      setLoading(false);
      setStep('done');
      toast.success('پرداخت با موفقیت انجام شد');
    }, 2000);
  };

  const sendCardOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCardOtpCode(code);
    setCardOtpSent(true);
    toast.success('رمز دوم ارسال شد');
    console.log('%c🔑 رمز دوم کارت: ' + code, 'color: white; background: #16a34a; padding: 10px 20px; border-radius: 8px; font-size: 20px; font-weight: bold;');
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50/30 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-background rounded-2xl border p-8 shadow-lg">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">پرداخت موفق!</h1>
            <p className="text-muted-foreground mb-2">مبلغ {Number(amount).toLocaleString('fa-IR')} تومان</p>
            <p className="text-muted-foreground mb-6">شماره سفارش: {orderId}</p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">فیش پرداخت شما ثبت شد و پس از تایید، دسترسی دوره فعال خواهد شد.</p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
            >
              مشاهده دوره‌ها
              <FiArrowRight className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/checkout" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <FiArrowRight className="ml-1 h-4 w-4" />
            بازگشت به تکمیل خرید
          </Link>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiLock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">پرداخت امن</h1>
          <p className="text-muted-foreground mt-1">مبلغ قابل پرداخت: <span className="font-bold text-primary">{Number(amount).toLocaleString('fa-IR')} تومان</span></p>
        </div>

        <div className="bg-background rounded-2xl border p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1 rounded-full bg-primary" />
            <div className="flex-1 h-1 rounded-full bg-muted" />
          </div>

          <form onSubmit={handleCardSubmit} className="space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <FiCreditCard className="h-5 w-5 text-primary" />
              اطلاعات کارت بانکی
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">شماره کارت</label>
              <input
                type="text"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                className="w-full h-12 rounded-xl border bg-background px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="6104 3378 XXXX XXXX"
                dir="ltr"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">تاریخ انقضا</label>
                <input
                  type="text"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className="w-full h-12 rounded-xl border bg-background px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  placeholder="MM/YY"
                  dir="ltr"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV2</label>
                <input
                  type="text"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  className="w-full h-12 rounded-xl border bg-background px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  placeholder="123"
                  dir="ltr"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="pr-4">
              <label className="block text-sm font-medium mb-2">رمز دوم</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showOtp ? 'text' : 'password'}
                    value={cardOtpInput}
                    onChange={(e) => setCardOtpInput(e.target.value)}
                    className="w-full h-12 rounded-xl border bg-background px-4 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder={cardOtpSent ? 'رمز دوم را وارد کنید' : 'ابتدا دریافت کنید'}
                    dir="ltr"
                    maxLength={6}
                    required
                    disabled={!cardOtpSent}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOtp ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={sendCardOtp}
                  disabled={!isCardFilled}
                  className="shrink-0 px-4 h-12 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cardOtpSent ? 'ارسال مجدد' : 'دریافت رمز'}
                </button>
              </div>
              {cardOtpSent && (
                <p className="text-xs text-muted-foreground mt-2">
                  رمز دوم: <span className="font-mono font-bold text-primary">{cardOtpCode}</span> (کنسول F12)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">کد اهراز هویت</label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full h-12 rounded-xl border bg-background px-4 text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="کد را وارد کنید"
                    maxLength={5}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="shrink-0 px-3 h-12 rounded-xl bg-muted border font-mono font-bold text-lg tracking-[0.2em] hover:bg-muted/80 transition-colors select-none"
                >
                  {captchaCode}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <FiLock className="h-5 w-5" />
                  پرداخت
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <FiLock className="h-3 w-3 text-green-500" />
              اطلاعات کارت شما کاملاً محرمانه است
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
