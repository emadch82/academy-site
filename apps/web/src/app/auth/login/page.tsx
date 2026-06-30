'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiPhone, FiKey, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { db, initializeDB } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    initializeDB();
    const user = db.getUserByCredentials(formData.identifier, formData.password);

    if (user) {
      const token = `amz_${user.role}_${Date.now()}`;
      Cookies.set('amz_access', token, { expires: 1 });
      Cookies.set('amz_user', JSON.stringify({ role: user.role, name: user.fullName, identifier: user.email || user.mobile, id: user.id }), { expires: 1 });

      toast.success(`خوش آمدید، ${user.fullName}`);

      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      toast.error('نام کاربری یا رمز عبور اشتباه است');
    }

    setLoading(false);
  };

  const handleSendOtp = () => {
    if (!otpPhone) {
      toast.error('شماره موبایل را وارد کنید');
      return;
    }
    initializeDB();
    const user = db.getUsers().find((u) => u.mobile === otpPhone);
    if (!user) {
      toast.error('کاربری با این شماره یافت نشد');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setOtpStep('code');
    console.log('%c🔑 کد OTP شما: ' + code, 'color: white; background: #2563eb; padding: 10px 20px; border-radius: 8px; font-size: 20px; font-weight: bold;');
    console.log('%cشماره: ' + otpPhone, 'color: #666; font-size: 14px;');
    toast.success('کد تأیید ارسال شد (کنسول مرورگر را چک کنید)');
  };

  const handleVerifyOtp = () => {
    if (!otpCode) {
      toast.error('کد تأیید را وارد کنید');
      return;
    }
    if (otpCode !== generatedCode) {
      toast.error('کد تأیید اشتباه است');
      return;
    }

    const user = db.getUsers().find((u) => u.mobile === otpPhone);
    if (user) {
      const token = `amz_${user.role}_${Date.now()}`;
      Cookies.set('amz_access', token, { expires: 1 });
      Cookies.set('amz_user', JSON.stringify({ role: user.role, name: user.fullName, identifier: user.mobile, id: user.id }), { expires: 1 });
      toast.success(`ورود با موفقیت، ${user.fullName}`);
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      toast.error('کاربری با این شماره یافت نشد');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <FiBookOpen className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">آموزشگاه نجوای قلم</span>
          </Link>
          <p className="text-muted-foreground mt-2">برای دسترسی به پنل وارد شوید</p>
        </div>

        {/* Login Form */}
        <div className="bg-background rounded-2xl border p-8 shadow-lg">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'password' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <FiLock className="inline ml-1.5 h-4 w-4" />
              رمز عبور
            </button>
            <button
              type="button"
              onClick={() => { setMode('otp'); setOtpStep('phone'); setOtpCode(''); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'otp' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <FiKey className="inline ml-1.5 h-4 w-4" />
              کد یکبار مصرف
            </button>
          </div>

          {mode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">ایمیل یا موبایل</label>
                <div className="relative">
                  <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="ایمیل یا شماره موبایل"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رمز عبور</label>
                <div className="relative">
                  <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pr-10 pl-10 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">مرا به خاطر بسپار</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <FiLock className="h-4 w-4" />
                    ورود
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {otpStep === 'phone' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">شماره موبایل</label>
                    <div className="relative">
                      <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="09123456789"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    ارسال کد تأیید
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      کد ۶ رقمی به شماره <span className="font-medium text-foreground">{otpPhone}</span> ارسال شد
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">کد را در کنسول (Console) مرورگر ببینید (F12)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">کد تأیید</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="۱۲۳۴۵۶"
                      maxLength={6}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setOtpStep('phone'); setOtpCode(''); }}
                      className="flex-1 py-3 rounded-lg border font-medium hover:bg-muted transition-colors"
                    >
                      بازگشت
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                      تأیید و ورود
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-sm text-primary hover:underline"
                  >
                    ارسال مجدد کد
                  </button>
                </>
              )}
            </div>
          )}

          {/* Demo Accounts Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-dashed">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <FiShield className="h-3 w-3" />
              حساب‌های دمو:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-mono bg-background px-1.5 py-0.5 rounded">admin@najvaaca.ir</span> / <span className="font-mono bg-background px-1.5 py-0.5 rounded">admin</span> → پنل ادمین</p>
              <p><span className="font-mono bg-background px-1.5 py-0.5 rounded">rezaei@najvaaca.ir</span> / <span className="font-mono bg-background px-1.5 py-0.5 rounded">teacher</span> → پنل معلم</p>
              <p><span className="font-mono bg-background px-1.5 py-0.5 rounded">ali@gmail.com</span> / <span className="font-mono bg-background px-1.5 py-0.5 rounded">user</span> → پنل دانشجو</p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          حساب کاربری ندارید؟{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
