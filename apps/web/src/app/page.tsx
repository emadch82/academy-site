'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiBookOpen, FiAward, FiCalendar, FiStar, FiPhone, FiMapPin, FiCheck, FiSend, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

const departments = [
  { id: 'children', title: 'کودکان', icon: '🎮', color: 'from-pink-500 to-rose-500', desc: '۵ تا ۱۰ سال - آموزش با بازی', age: '۵-۱۰ سال' },
  { id: 'junior', title: 'نوجوانان', icon: '📚', color: 'from-blue-500 to-cyan-500', desc: '۱۴ تا ۱۶ سال - برنامه تخصصی', age: '۱۴-۱۶ سال' },
  { id: 'adult', title: 'بزرگسالان', icon: '🎓', color: 'from-violet-500 to-purple-500', desc: 'از پایه تا پیشرفته' },
  { id: 'conversation', title: 'مکالمه SPO', icon: '💬', color: 'from-amber-500 to-orange-500', desc: 'فقط Listening و Speaking' },
  { id: 'ttc', title: 'تربیت مدرس', icon: '👨‍🏫', color: 'from-emerald-500 to-green-500', desc: 'مدرک بین‌المللی TTC' },
  { id: 'moc', title: 'آزمون MOC', icon: '✈️', color: 'from-sky-500 to-blue-500', desc: 'ماک آیلتس آکادمیک' },
  { id: 'online', title: 'آنلاین', icon: '💻', color: 'from-indigo-500 to-violet-500', desc: 'Virtual Learning' },
  { id: 'book-movie', title: 'کتاب و فیلم', icon: '📖', color: 'from-teal-500 to-cyan-500', desc: 'معرفی متناسب با سطح' },
];

const teachers = [
  { name: 'نسیم خدابخش', role: 'مدیریت مجموعه', qual: 'PhD Candidate in TEFL', img: '/images/nasim.jpg' },
  { name: 'غزال امیرسلیمانی', role: 'مدرس کودک و نوجوان', qual: 'TTC معتبر', img: '/images/ghazal.jpg' },
  { name: 'زهرا مردانی', role: 'مدرس TTC و بزرگسال', qual: 'فوق لیسانس, TESOL', img: '/images/zahra.jpg' },
  { name: 'سوگل سرشوقی', role: 'مدرس کودک و نوجوان', qual: 'BA in English Lit, TTC', img: '/images/sogol.jpg' },
];

const testimonials = [
  { name: 'سارا محمدی', course: 'مکالمه SPO', text: 'کلاس‌های SPO خیلی به مکالمه‌ام کمک کرد. بهترین آموزشگاه زبانی که رفتم.' },
  { name: 'علی رضایی', course: 'بزرگسالان', text: 'خانم مردانی واقعا استاد خوبی هستند. پیشرفت چشمگیری در زبان داشتم.' },
  { name: 'مریم حسینی', course: 'کودکان', text: 'پسرم عاشق کلاس‌های ویرا شده. خانم امیرسلیمانی محیط خلاقانه‌ای درست کرده.' },
];

/* ─── Mobile: Scroll-Snap Sections ─── */

function MobileHome() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [transitionOpacity, setTransitionOpacity] = useState(0);
  const [transitionBlur, setTransitionBlur] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const SECTIONS = [
    { start: 0, end: 4 },
    { start: 4, end: 7.5 },
    { start: 7.5, end: 11 },
    { start: 11, end: 14.5 },
    { start: 14.5, end: 18 },
    { start: 18, end: 21.5 },
    { start: 21.5, end: 25 },
  ];

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroVideoRef.current;
    if (video) {
      try {
        video.playbackRate = 0.7;
      } catch {
        video.playbackRate = 1;
      }
    }
    if (hero) hero.playbackRate = 1;
    const timer = setTimeout(() => setShowButtons(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroVideoRef.current;
    const scrollEl = scrollRef.current;
    if (!video || !scrollEl) return;

    let scrollTimer: NodeJS.Timeout | null = null;
    let lastSection = -1;
    let activeIdx = 0;

    const triggerTransition = () => {
      setTransitionOpacity(0.7);
      setTransitionBlur(6);
      setTimeout(() => { setTransitionOpacity(0); setTransitionBlur(0); }, 250);
    };

    const findSection = () => {
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          return i;
        }
      }
      return 0;
    };

    const onTimeUpdate = () => {
      if (activeIdx === 0) return;
      const seg = SECTIONS[activeIdx];
      if (!seg) return;
      if (video.currentTime >= seg.end - 0.1 || video.currentTime < seg.start - 0.2) {
        video.currentTime = seg.start;
      }
    };
    const onEnded = () => {
      if (activeIdx === 0) return;
      const seg = SECTIONS[activeIdx];
      if (!seg) return;
      video.currentTime = seg.start;
      const p = video.play();
      if (p) p.catch(() => {});
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    const onStall = () => {
      const v = videoRef.current;
      if (!v || heroVisible || v.paused) return;
      if (v.readyState >= 2) {
        const p = v.play();
        if (p) p.catch(() => {});
      }
    };
    video.addEventListener('waiting', onStall);
    video.addEventListener('canplay', onStall);

    const switchToHero = () => {
      setHeroVisible(true);
      video.pause();
      if (hero) {
        hero.currentTime = 0;
        hero.play().catch(() => {});
      }
    };

    const switchToMain = (idx: number) => {
      setHeroVisible(false);
      if (hero) hero.pause();
      const v = videoRef.current;
      if (!v) return;
      const seg = SECTIONS[idx];
      if (!seg) return;
      const tryPlay = () => {
        const p = v.play();
        if (p) p.catch(() => {});
      };
      v.currentTime = seg.start;
      if (v.readyState >= 2) {
        tryPlay();
      } else {
        const once = () => {
          v.removeEventListener('canplay', once);
          tryPlay();
        };
        v.addEventListener('canplay', once);
      }
    };

    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      const idx = findSection();

        if (idx === 0) {
          if (!heroVisible) switchToHero();
          if (hero && hero.paused) hero.play().catch(() => {});
        } else if (heroVisible) {
          switchToMain(idx);
        }

      if (idx !== lastSection) {
        if (lastSection !== -1) triggerTransition();
        lastSection = idx;
        activeIdx = idx;

        if (idx !== 0 && heroVisible) {
          switchToMain(idx);
        }
      }

      scrollTimer = setTimeout(() => {
        const current = findSection();
        if (current === 0 && hero && hero.paused && hero.readyState >= 2) {
          hero.play().catch(() => {});
        }
      }, 500);
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });

    video.currentTime = 0;
    video.pause();
    if (hero) {
      hero.currentTime = 0;
      hero.play().catch(() => {});
    }

    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('waiting', onStall);
      video.removeEventListener('canplay', onStall);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <div ref={scrollRef} className="h-screen overflow-y-auto" style={{ scrollSnapType: 'y proximity' }}>
      {/* Fixed Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Hero HD video (section 0) */}
        <video
          ref={heroVideoRef}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          poster="/motion/poster_sec0.jpg"
          style={{
            willChange: 'transform',
            filter: `blur(${transitionBlur}px)`,
            transition: 'filter 0.3s ease, opacity 0.4s ease',
            opacity: heroVisible ? 1 : 0,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/motion/hero_combined_web.mp4" type="video/mp4" />
        </video>
        {/* Main combined video (sections 1-6) */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          poster="/motion/poster_sec1.jpg"
          style={{
            willChange: 'transform',
            filter: `blur(${transitionBlur}px)`,
            transition: 'filter 0.3s ease, opacity 0.4s ease',
            opacity: heroVisible ? 0 : 1,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/motion/vira_final_web.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: transitionOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
      </div>

      {/* Snap Sections */}
      <div className="relative z-10">
        {/* HERO */}
        <div ref={(el) => { sectionRefs.current[0] = el; }} className="min-h-screen w-full relative px-4" style={{ scrollSnapAlign: 'start' }}>
          {/* Top: badge only (before VIRA fades) */}
          <div className={`absolute left-0 right-0 text-center px-4 transition-all duration-1000 ease-in-out top-[15%] ${showButtons ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              ثبت‌نام دوره‌های جدید آغاز شد
            </div>
          </div>
          {/* Bottom: text + buttons (before VIRA fades) */}
          <div className={`absolute left-0 right-0 text-center px-4 transition-all duration-1000 ease-in-out top-[55%] ${showButtons ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="inline-flex flex-col items-center gap-3">
              <p className="text-sm text-white/80 leading-relaxed">
                آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته
                <br />
                با بهترین اساتید در اصفهان
              </p>
              <div className="inline-flex flex-col gap-2.5 w-64">
                <Link href="/courses" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-xl">
                  ثبت‌نام دوره‌ها
                  <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105">
                  <FiPhone className="h-4 w-4" />
                  ۰۳۱-۳۷۷۵۹۵۵۶
                </Link>
              </div>
            </div>
          </div>
          {/* After VIRA fades: everything slides up to center */}
          <motion.div
            initial={{ opacity: 0, y: 90, scale: 0.94 }}
            animate={showButtons ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 90, scale: 0.94 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 text-center ${showButtons ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              ثبت‌نام دوره‌های جدید آغاز شد
            </div>
            <div className="inline-flex flex-col items-center gap-3">
              <p className="text-sm text-white/80 leading-relaxed">
                آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته
                <br />
                با بهترین اساتید در اصفهان
              </p>
              <div className="inline-flex flex-col gap-2.5 w-64">
                <Link href="/courses" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-xl">
                  ثبت‌نام دوره‌ها
                  <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105">
                  <FiPhone className="h-4 w-4" />
                  ۰۳۱-۳۷۷۵۹۵۵۶
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* STATS */}
        <div ref={(el) => { sectionRefs.current[1] = el; }} className="min-h-screen w-full flex items-center justify-center px-4" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full">
            <h2 className="text-xl font-black text-white text-center mb-6">
              آموزشگاه زبان ویرا در <span className="text-primary">یک نگاه</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FiCalendar, value: '۱۵+', label: 'سال سابقه', color: 'from-blue-500 to-cyan-500' },
                { icon: FiUsers, value: '۵۰+', label: 'دانش‌آموز', color: 'from-violet-500 to-purple-500' },
                { icon: FiBookOpen, value: '۸', label: 'دپارتمان', color: 'from-amber-500 to-orange-500' },
                { icon: FiAward, value: '۴', label: 'استاد مجرب', color: 'from-emerald-500 to-green-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                  <div className={`inline-flex h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} items-center justify-center mb-2 shadow-lg`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-xs text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEPARTMENTS */}
        <div ref={(el) => { sectionRefs.current[2] = el; }} className="min-h-screen w-full flex items-center justify-center px-4" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full">
            <h2 className="text-xl font-black text-white text-center mb-2">
              دپارتمان‌های <span className="text-primary">آموزشی</span>
            </h2>
            <p className="text-white/60 text-center mb-4 text-xs">دوره‌های متنوع برای تمام سنین و سطوح</p>
            <div className="grid grid-cols-2 gap-2">
              {departments.map((d) => (
                <Link key={d.id} href={`/courses/${d.id}`} className="block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
                  <div className={`inline-flex h-9 w-9 rounded-lg bg-gradient-to-br ${d.color} items-center justify-center mb-1 text-lg shadow-lg`}>
                    {d.icon}
                  </div>
                  <h3 className="text-xs font-bold text-white mb-0.5">{d.title}</h3>
                  <p className="text-[10px] text-white/60 line-clamp-2">{d.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* TEACHERS */}
        <div ref={(el) => { sectionRefs.current[3] = el; }} className="min-h-screen w-full flex items-center justify-center px-4" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full">
            <h2 className="text-xl font-black text-white text-center mb-2">
              تیم <span className="text-primary">حرفه‌ای</span> ما
            </h2>
            <p className="text-white/60 text-center mb-4 text-xs">اساتید مجرب با مدارک بین‌المللی</p>
            <div className="grid grid-cols-2 gap-3">
              {teachers.map((t) => (
                <div key={t.name} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-full animate-pulse opacity-50 blur-md" />
                    <img src={t.img} alt={t.name} className="relative w-20 h-20 object-cover rounded-full border-2 border-white/30" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{t.name}</h3>
                  <p className="text-[10px] text-primary font-medium mb-1">{t.role}</p>
                  <p className="text-[9px] text-white/50">{t.qual}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div ref={(el) => { sectionRefs.current[4] = el; }} className="min-h-screen w-full flex items-center justify-center px-4" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5">
            <h2 className="text-lg font-black text-white mb-3">
              درباره <span className="text-primary">آکادمی ویرا</span>
            </h2>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              آموزشگاه زبان ویرا با بیش از ۱۵ سال سابقه درخشان در خیابان رودکی اصفهان، یکی از معتبرترین مراکز آموزش زبان انگلیسی است.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['اساتید مجرب', 'کلاس‌های تعاملی', 'مدرک TTC', 'پشتیبانی ۲۴ ساعته'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-white/80">
                  <FiCheck className="h-3 w-3 text-primary shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="text-3xl font-black bg-gradient-to-l from-blue-400 via-primary to-purple-400 bg-clip-text text-transparent">۱۵+</div>
              <div className="text-xs text-white/80">سال تجربه درخشان</div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div ref={(el) => { sectionRefs.current[5] = el; }} className="min-h-screen w-full flex items-center justify-center px-4" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full">
            <h2 className="text-xl font-black text-white text-center mb-2">
              نظرات <span className="text-primary">دانش‌آموزان</span>
            </h2>
            <p className="text-white/60 text-center mb-4 text-xs">تجربه واقعی زبان‌آموزان ما</p>
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/80 mb-2 leading-relaxed">{t.text}</p>
                  <div className="border-t border-white/10 pt-2">
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-primary">{t.course}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div ref={(el) => { sectionRefs.current[6] = el; }} className="min-h-screen w-full flex items-center justify-start px-4 pt-20" style={{ scrollSnapAlign: 'start' }}>
          <div className="w-full space-y-3">
            <h2 className="text-xl font-black text-white">
              تماس <span className="text-primary">با ما</span>
            </h2>
            <p className="text-white/60 text-xs">برای مشاوره و ثبت‌نام با ما در تماس باشید</p>
            {[
              { icon: FiPhone, text: '۰۳۱-۳۷۷۵۹۵۵۶', label: 'تلفن' },
              { icon: FiMapPin, text: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84)', label: 'آدرس' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50">{c.label}</div>
                  <div className="text-xs text-white font-medium">{c.text}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-1">
              {[
                { icon: FiInstagram, color: 'from-pink-500 to-rose-500' },
                { icon: FaWhatsapp, color: 'from-green-500 to-emerald-500' },
                { icon: FaTelegram, color: 'from-sky-500 to-blue-500' },
              ].map((s, i) => (
                <a key={i} href="#" className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 scroll-hint">
        <div className="animate-bounce flex flex-col items-center gap-1">
          <span className="text-[10px] text-white/50">اسکرول کنید</span>
          <div className="w-5 h-7 rounded-full border border-white/30 flex justify-center pt-1">
            <div className="w-1 h-1.5 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Desktop: Scroll Video ─── */
function DesktopHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onReady = () => {
      video.currentTime = 0;
      video.pause();
      setVideoDuration(video.duration);
    };
    video.addEventListener('loadedmetadata', onReady);
    if (video.readyState >= 1) onReady();
    return () => video.removeEventListener('loadedmetadata', onReady);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        const v = videoRef.current;
        if (v && videoDuration) {
          v.currentTime = progress * videoDuration;
        }
        rafRef.current = 0;
      });
    }
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1.1, 1, 1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.08], [0, -60]);
  const statsOpacity = useTransform(scrollYProgress, [0.07, 0.12, 0.19, 0.24], [0, 1, 1, 0]);
  const statsY = useTransform(scrollYProgress, [0.07, 0.12, 0.19, 0.24], [40, 0, 0, -40]);
  const deptOpacity = useTransform(scrollYProgress, [0.22, 0.27, 0.34, 0.39], [0, 1, 1, 0]);
  const deptY = useTransform(scrollYProgress, [0.22, 0.27, 0.34, 0.39], [40, 0, 0, -40]);
  const teacherOpacity = useTransform(scrollYProgress, [0.37, 0.42, 0.49, 0.54], [0, 1, 1, 0]);
  const teacherY = useTransform(scrollYProgress, [0.37, 0.42, 0.49, 0.54], [40, 0, 0, -40]);
  const aboutOpacity = useTransform(scrollYProgress, [0.52, 0.57, 0.64, 0.69], [0, 1, 1, 0]);
  const aboutY = useTransform(scrollYProgress, [0.52, 0.57, 0.64, 0.69], [40, 0, 0, -40]);
  const testOpacity = useTransform(scrollYProgress, [0.67, 0.72, 0.82, 0.87], [0, 1, 1, 0]);
  const testY = useTransform(scrollYProgress, [0.67, 0.72, 0.82, 0.87], [40, 0, 0, -40]);
  const contactOpacity = useTransform(scrollYProgress, [0.87, 0.92, 0.96, 1], [0, 1, 1, 0]);
  const contactY = useTransform(scrollYProgress, [0.87, 0.92, 0.96, 1], [40, 0, 0, -40]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main ref={containerRef} style={{ height: "800vh" }}>
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video ref={videoRef} muted playsInline preload="auto" poster="/motion/poster_hero_hd.jpg" style={{ willChange: 'transform' }} className="scroll-video w-full h-full object-cover">
            <source src="/motion/VIRA_language_institute_animation_1080p_202607281703_gwr_video_mvp.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-10 pointer-events-none">
        <div className="container mx-auto px-4 relative w-full pointer-events-auto">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-sm font-medium text-white mb-8">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                ثبت‌نام دوره‌های جدید آغاز شد
              </div>
              <div className="h-32 md:h-48" />
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
                آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته
                <br />
                با بهترین اساتید در اصفهان
              </p>
              <div className="flex flex-row gap-4 justify-center">
                <Link href="/courses" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-8 py-4 text-sm font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-xl">
                  ثبت‌نام دوره‌ها
                  <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-8 py-4 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105">
                  <FiPhone className="h-4 w-4" />
                  ۰۳۱-۳۷۷۵۹۵۵۶
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: statsOpacity, y: statsY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-12">
                آموزشگاه زبان ویرا در <span className="text-primary">یک نگاه</span>
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { icon: FiCalendar, value: '۱۵+', label: 'سال سابقه', color: 'from-blue-500 to-cyan-500' },
                  { icon: FiUsers, value: '۵۰+', label: 'دانش‌آموز', color: 'from-violet-500 to-purple-500' },
                  { icon: FiBookOpen, value: '۸', label: 'دپارتمان', color: 'from-amber-500 to-orange-500' },
                  { icon: FiAward, value: '۴', label: 'استاد مجرب', color: 'from-emerald-500 to-green-500' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                    <div className={`inline-flex h-14 w-14 rounded-xl bg-gradient-to-br ${s.color} items-center justify-center mb-4 shadow-lg`}>
                      <s.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-sm text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: deptOpacity, y: deptY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-5xl px-4">
              <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-4">
                دپارتمان‌های <span className="text-primary">آموزشی</span>
              </h2>
              <p className="text-white/60 text-center mb-10 max-w-lg mx-auto">دوره‌های متنوع برای تمام سنین و سطوح</p>
              <div className="grid grid-cols-4 gap-4">
                {departments.map((d) => (
                  <Link key={d.id} href={`/courses/${d.id}`} className="block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center hover:bg-white/20 transition-all hover:scale-105 hover:border-white/40">
                    <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${d.color} items-center justify-center mb-3 text-2xl shadow-lg`}>
                      {d.icon}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{d.title}</h3>
                    <p className="text-xs text-white/60 line-clamp-2">{d.desc}</p>
                    {d.age && <span className="inline-block mt-2 text-[10px] bg-white/10 rounded-full px-2 py-0.5 text-white/80">{d.age}</span>}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: teacherOpacity, y: teacherY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-4">
                تیم <span className="text-primary">حرفه‌ای</span> ما
              </h2>
              <p className="text-white/60 text-center mb-10">اساتید مجرب با مدارک بین‌المللی</p>
              <div className="grid grid-cols-4 gap-5">
                {teachers.map((t) => (
                  <div key={t.name} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all hover:scale-105 flex flex-col h-full">
                    <div className="relative min-h-[240px] overflow-hidden">
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-4 -mt-8 relative">
                      <h3 className="text-sm font-bold text-white">{t.name}</h3>
                      <p className="text-xs text-primary">{t.role}</p>
                      <p className="text-[10px] text-white/50 mt-1">{t.qual}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: aboutOpacity, y: aboutY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4 grid grid-cols-2 gap-8 items-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-4">
                  درباره <span className="text-primary">آکادمی ویرا</span>
                </h2>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  آموزشگاه زبان ویرا با بیش از ۱۵ سال سابقه درخشان در خیابان رودکی اصفهان، یکی از معتبرترین مراکز آموزش زبان انگلیسی است.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mb-6">
                  ما با بهره‌گیری از مجرب‌ترین اساتید و مدرن‌ترین متدهای آموزشی، محیطی پویا و خلاقانه برای یادگیری زبان فراهم کرده‌ایم.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['اساتید مجرب', 'کلاس‌های تعاملی', 'مدرک TTC', 'پشتیبانی ۲۴ ساعته'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                      <FiCheck className="h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                <div className="text-6xl font-black bg-gradient-to-l from-blue-400 via-primary to-purple-400 bg-clip-text text-transparent mb-2">۱۵+</div>
                <div className="text-lg text-white/80 mb-6">سال تجربه درخشان</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">۸+</div>
                    <div className="text-xs text-white/60">دپارتمان</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">۵۰+</div>
                    <div className="text-xs text-white/60">دانش‌آموز</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: testOpacity, y: testY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-4">
                نظرات <span className="text-primary">دانش‌آموزان</span>
              </h2>
              <p className="text-white/60 text-center mb-10">تجربه واقعی زبان‌آموزان ما</p>
              <div className="grid grid-cols-3 gap-5">
                {testimonials.map((t) => (
                  <div key={t.name} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <FiStar key={j} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-white/80 mb-4 leading-relaxed">{t.text}</p>
                    <div className="border-t border-white/10 pt-3">
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-primary">{t.course}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: contactOpacity, y: contactY }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4 grid grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white mb-2">
                  تماس <span className="text-primary">با ما</span>
                </h2>
                <p className="text-white/60 text-sm mb-6">برای مشاوره و ثبت‌نام با ما در تماس باشید</p>
                {[
                  { icon: FiPhone, text: '۰۳۱-۳۷۷۵۹۵۵۶', label: 'تلفن' },
                  { icon: FiMapPin, text: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84)', label: 'آدرس' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <c.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50">{c.label}</div>
                      <div className="text-sm text-white font-medium">{c.text}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  {[
                    { icon: FiInstagram, color: 'from-pink-500 to-rose-500' },
                    { icon: FaWhatsapp, color: 'from-green-500 to-emerald-500' },
                    { icon: FaTelegram, color: 'from-sky-500 to-blue-500' },
                  ].map((s, i) => (
                    <a key={i} href="#" className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white hover:scale-110 transition-transform`}>
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <form onSubmit={e => e.preventDefault()} className="space-y-4">
                  <input type="text" placeholder="نام و نام خانوادگی" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" placeholder="ایمیل" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="tel" placeholder="تلفن" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <textarea rows={3} placeholder="پیام شما..." className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-l from-primary to-primary/80 text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2">
                    <FiSend className="h-4 w-4" />
                    ارسال پیام
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div style={{ width: progressWidth }} className="h-full bg-gradient-to-r from-primary via-blue-500 to-secondary" />
      </div>

      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.02], [1, 0]) }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden sm:flex"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/60">اسکرول کنید</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

/* ─── Main Component ─── */
export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background" />
    );
  }

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
