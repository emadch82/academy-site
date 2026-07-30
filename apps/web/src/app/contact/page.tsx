'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram, FaInstagram } from 'react-icons/fa';
import { AutoPlayVideo } from '@/components/auto-play-video';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 border border-primary/10 rounded-full"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center md:pl-24 flex flex-col justify-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                ارتباط <span className="text-primary">با ما</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                برای مشاوره، ثبت‌نام یا هرگونه سوال با ما در تماس باشید
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 rounded-2xl overflow-hidden border w-full"
            >
              <AutoPlayVideo src="/videos/contact-motion.mp4" className="w-full h-auto object-contain" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">اطلاعات تماس</h2>
                <p className="text-muted-foreground">
                  ما همیشه آماده پاسخگویی به سوالات شما هستیم.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: FiPhone,
                    title: 'تلفن',
                    content: '۰۳۱-۳۷۷۵۹۵۵۶',
                    gradient: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: FiMapPin,
                    title: 'آدرس',
                    content: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84) جنب خیریه شجره طیبه، بن بست شادی، موسسه زبان ویرا',
                    gradient: 'from-violet-500 to-purple-500',
                  },
                  {
                    icon: FiClock,
                    title: 'ساعات کاری',
                    content: 'شنبه تا پنجشنبه: ۹:۰۰ - ۲۰:۰۰',
                    gradient: 'from-amber-500 to-orange-500',
                  },
                  {
                    icon: FiMail,
                    title: 'ایمیل',
                    content: 'info@viraacademyesf.ir',
                    gradient: 'from-emerald-500 to-green-500',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-4 bg-background/80 backdrop-blur-sm rounded-xl border p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {[
                  { icon: FaInstagram, href: '#', color: 'from-pink-500 to-rose-500', label: 'اینستاگرام' },
                  { icon: FaWhatsapp, href: '#', color: 'from-green-500 to-emerald-500', label: 'واتساپ' },
                  { icon: FaTelegram, href: '#', color: 'from-sky-500 to-blue-500', label: 'تلگرام' },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-background/80 backdrop-blur-sm rounded-2xl border p-8 shadow-xl space-y-6">
                <h2 className="text-2xl font-bold">ارسال پیام</h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">ایمیل</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">تلفن</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">موضوع</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="registration">ثبت‌نام</option>
                    <option value="consultation">مشاوره</option>
                    <option value="support">پشتیبانی</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">پیام</label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white transition-all duration-300 ${
                    submitted
                      ? 'bg-green-500'
                      : 'bg-gradient-to-l from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25'
                  }`}
                >
                  {submitted ? (
                    <>
                      <FiCheck className="h-5 w-5" />
                      پیام شما ارسال شد
                    </>
                  ) : (
                    <>
                      <FiSend className="h-5 w-5" />
                      ارسال پیام
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
