'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { db, initializeDB } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      db.logActivity({ type: 'login', userId: user.id, userName: user.fullName, detail: 'ورود به سیستم با رمز عبور' });

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
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="text-2xl font-bold">آموزشگاه زبان ویرا</span>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-background rounded-2xl border p-8 shadow-lg">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="لطفا ایمیل یا شماره موبایل خود را وارد نمایید"
                  required
                />
              </div>
            </div>

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
