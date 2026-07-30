'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiInstagram, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

const footerLinks = {
  departments: [
    { name: 'دوره کودکان', href: '/courses/children' },
    { name: 'دوره نوجوانان', href: '/courses/junior' },
    { name: 'دوره بزرگسالان', href: '/courses/adult' },
    { name: 'دوره مکالمه', href: '/courses/conversation' },
    { name: 'دوره TTC', href: '/courses/ttc' },
  ],
  quickLinks: [
    { name: 'صفحه اصلی', href: '/' },
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
    { name: 'بلاگ', href: '/blog' },
    { name: 'گالری', href: '/gallery' },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <footer className={`relative pt-20 pb-8 overflow-hidden ${
      isHome
        ? 'bg-white/5 backdrop-blur-2xl border-t border-white/10'
        : 'bg-muted/30'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 border border-primary/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 border border-secondary/5 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <div>
                <span className={`text-xl font-bold block ${isHome ? 'text-white' : 'text-foreground'}`}>آموزشگاه زبان ویرا</span>
                <span className={`text-xs ${isHome ? 'text-white/50' : 'text-muted-foreground'}`}>Vira Language Academy</span>
              </div>
            </Link>
            <p className={`text-sm leading-relaxed ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}>
              آموزشگاه زبان ویرا با بیش از ۱۵ سال سابقه درخشان در خیابان رودکی اصفهان، بهترین مرکز آموزش زبان انگلیسی برای تمام سنین. ما با تیمی مجرب و محیطی پرانرژی، بهترین تجربه یادگیری را برای شما فراهم می‌کنیم.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FiInstagram, href: 'https://www.instagram.com/vira.language.academy/', color: 'from-pink-500 to-rose-500', label: 'instagram' },
                { icon: FaWhatsapp, href: 'https://wa.me/989132019139', color: 'from-green-500 to-emerald-500', label: 'whatsapp' },
                { icon: FaTelegram, href: 'https://t.me/Nasimkhs', color: 'from-sky-500 to-blue-500', label: 'telegram' },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className={`h-10 w-10 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow`}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-bold mb-6 ${isHome ? 'text-white' : 'text-foreground'}`}>دپارتمان‌ها</h4>
            <ul className="space-y-3">
              {footerLinks.departments.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm hover:text-primary transition-colors flex items-center gap-2 group ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-bold mb-6 ${isHome ? 'text-white' : 'text-foreground'}`}>دسترسی سریع</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm hover:text-primary transition-colors flex items-center gap-2 group ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-bold mb-6 ${isHome ? 'text-white' : 'text-foreground'}`}>تماس با ما</h4>
            <div className="space-y-4">
              <a href="tel:031-37759556" className={`flex items-center gap-3 text-sm hover:text-primary transition-colors ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiPhone className="h-4 w-4 text-primary" />
                </div>
                <span>۰۳۱-۳۷۷۵۹۵۵۶</span>
              </a>
              <div className={`flex items-start gap-3 text-sm ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiMapPin className="h-4 w-4 text-primary" />
                </div>
                <span>اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84)</span>
              </div>
              <div className={`flex items-center gap-3 text-sm ${isHome ? 'text-white/60' : 'text-muted-foreground'}`}>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiMail className="h-4 w-4 text-primary" />
                </div>
                <span>info@viraacademyesf.ir</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t pt-8 ${isHome ? 'border-white/10' : 'border-border'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${isHome ? 'text-white/50' : 'text-muted-foreground'}`}>
              تمام حقوق مادی و معنوی این وب سایت متعلق به آموزشگاه زبان ویرا می‌باشد
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
