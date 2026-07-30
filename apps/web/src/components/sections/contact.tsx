'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPhone, FiMapPin, FiInstagram, FiSend, FiClock, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            تماس با ما
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            ارتباط <span className="text-primary">با ما</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            برای مشاوره و ثبت‌نام با ما در تماس باشید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: FiMapPin,
                  title: 'آدرس',
                  content: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84) جنب خیریه شجره طیبه، بن بست شادی',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: FiPhone,
                  title: 'تلفن',
                  content: '۰۳۱-۳۷۷۵۹۵۵۶',
                  gradient: 'from-violet-500 to-purple-500',
                },
                {
                  icon: FiClock,
                  title: 'ساعات کاری',
                  content: 'شنبه تا پنجشنبه - ۹ صبح تا ۸ شب',
                  gradient: 'from-amber-500 to-orange-500',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-background/80 backdrop-blur-sm rounded-xl border p-5 transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: FiInstagram, href: '#', color: 'from-pink-500 to-rose-500', label: 'اینستاگرام' },
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
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl border p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="نام خود را وارد کنید"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ایمیل</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">شماره تماس</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="09121234567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">پیام شما</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    placeholder="پیام خود را بنویسید..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
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
                      <FiSend className="h-4 w-4" />
                      ارسال پیام
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
