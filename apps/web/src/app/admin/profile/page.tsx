'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiSave,
  FiEye,
  FiEyeOff,
  FiShield,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { db, initializeDB } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);

  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    initializeDB();
    const raw = Cookies.get('amz_user');
    if (raw) {
      try {
        const cu = JSON.parse(raw);
        const full = db.getUserById(cu.id);
        if (full) {
          setUser(full);
          setFullName(full.fullName);
          setEmail(full.email);
          setMobile(full.mobile);
        }
      } catch {}
    }
  }, [hydrated]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  if (!user) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FiShield className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>کاربری یافت نشد</p>
      </div>
    );
  }

  const handleSaveInfo = () => {
    if (!fullName) {
      toast.error('نام را وارد کنید');
      return;
    }
    db.updateUser(user.id, { fullName, email, mobile });
    Cookies.set(
      'amz_user',
      JSON.stringify({ role: user.role, name: fullName, identifier: email || mobile, id: user.id }),
      { expires: 1 }
    );
    toast.success('اطلاعات به‌روزرسانی شد');
  };

  const handleChangePassword = () => {
    if (currentPassword !== user.password) {
      toast.error('رمز عبور فعلی اشتباه است');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('تکرار رمز عبور مطابقت ندارد');
      return;
    }
    db.updateUser(user.id, { password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('رمز عبور تغییر کرد');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">پروفایل</h1>
        <p className="text-sm text-muted-foreground mt-1">اطلاعات حساب خود را مدیریت کنید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border rounded-xl p-6"
        >
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FiUser className="h-5 w-5 text-primary" />
            اطلاعات شخصی
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {user.fullName?.charAt(0) || 'V'}
              </div>
              <div>
                <p className="font-bold">{user.fullName}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 bg-blue-100 text-blue-700">
                  {user.role === 'admin' ? 'مدیر' : 'مدرس'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">نام و نام خانوادگی</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">ایمیل</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full pr-9 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">شماره موبایل</label>
              <div className="relative">
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  dir="ltr"
                  className="w-full pr-9 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <button
              onClick={handleSaveInfo}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiSave className="h-4 w-4" />
              ذخیره اطلاعات
            </button>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background border rounded-xl p-6"
        >
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FiLock className="h-5 w-5 text-primary" />
            تغییر رمز عبور
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">رمز عبور فعلی</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pr-9 pl-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رمز عبور جدید</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-9 pl-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">تکرار رمز عبور جدید</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-9 pl-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <FiLock className="h-4 w-4" />
              تغییر رمز عبور
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
