'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { db, initializeDB, type User } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('تکرار رمز عبور مطابقت ندارد');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    initializeDB();
    const existing = db.getUsers().find((u) => u.email === formData.email || u.mobile === formData.mobile);
    if (existing) {
      toast.error('ایمیل یا موبایل قبلاً ثبت شده است');
      setLoading(false);
      return;
    }

    const newUser = db.addUser({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role: 'student',
      status: 'active',
      joinDate: new Date().toLocaleDateString('fa-IR'),
    });

    db.logActivity({ type: 'register', userId: newUser.id, userName: newUser.fullName, detail: 'ثبت‌نام جدید در سیستم' });

    const token = `amz_student_${Date.now()}`;
    Cookies.set('amz_access', token, { expires: 1 });
    Cookies.set('amz_user', JSON.stringify({
      role: 'student',
      name: newUser.fullName,
      identifier: newUser.email,
      id: newUser.id,
    }), { expires: 1 });

    setLoading(false);
    setStep('success');
    toast.success('ثبت‌نام با موفقیت انجام شد');

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-background rounded-2xl border p-8 shadow-lg">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">ثبت‌نام موفق!</h1>
            <p className="text-muted-foreground mb-4">
              حساب کاربری شما با موفقیت ایجاد شد.
            </p>
            <p className="text-sm text-muted-foreground">
              در حال انتقال به پنل کاربری...
            </p>
            <div className="mt-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="text-2xl font-bold">آموزشگاه زبان ویرا</span>
          </Link>
          <p className="text-muted-foreground mt-2">حساب کاربری جدید ایجاد کنید</p>
        </div>

        {/* Register Form */}
        <div className="bg-background rounded-2xl border p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <div className="relative">
                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="لطفا نام و نام خانوادگی خود را وارد نمایید"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="لطفا ایمیل خود را وارد نمایید"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <div className="relative">
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
                  placeholder="لطفا شماره موبایل خود را وارد نمایید"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-10 pl-10 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="لطفا رمز عبور خود را وارد نمایید"
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="لطفا رمز عبور را مجدداً وارد نمایید"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  در حال ثبت‌نام...
                </>
              ) : (
                'ثبت‌نام'
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            وارد شوید
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
