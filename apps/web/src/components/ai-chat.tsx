'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiUser } from 'react-icons/fi';
import { useDrawer } from '@/contexts/drawer-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const WELCOME_MESSAGE = 'سلام! 👋 من دستیار هوش مصنوعی نجوای قلم هستم. چطور می‌تونم کمکتون کنم؟';

const DEFAULT_RESPONSE = 'ممنون از پیامتون! برای اطلاعات بیشتر با شماره ۰۹۱۳۳۲۳۹۶۷۲ تماس بگیرید یا فرم مشاوره رایگان رو پر کنید.';

const responses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['دوره', 'دوره‌ها', 'دوره ها', 'courses', 'class', 'کلاس'],
    response: `آموزشگاه نجوای قلم دوره‌های متنوعی ارائه می‌دهد:

۱. 🤖 هوش مصنوعی - ساخت تصویر، تولید ویدیو، تولید موسیقی
۲. 💻 طراحی سایت - HTML, CSS, JavaScript
۳. 🖥️ برنامه‌نویسی - Python, Java
۴. 🌐 زبان انگلیسی - کارگاه مکالمه آزاد
۵. 🎤 فن بیان - ارائه‌دهندگی حرفه‌ای
۶. 📊 ICDL - مهارت‌های کامپیوتر
۷. 🎨 نقاشی و خوشنویسی - هنرهای تجسمی
۸. 🤖 رباتیک - طراحی و ساخت ربات
۹. 📚 استعدادیابی - ویژه کودکان و نوجوانان

برای اطلاعات بیشتر درباره هر دوره، اسمش رو بنویسید.`,
  },
  {
    keywords: ['قیمت', 'هزینه', 'تعرفه', 'پول', 'price', 'cost', 'ریال', 'تومان', 'پرداخت'],
    response: `هزینه دوره‌ها بسته به نوع دوره متفاوت است.

برای اطلاع از قیمت دقیق دوره‌ها با شماره ۰۹۱۳۳۲۳۹۶۷۲ تماس بگیرید.

همچنین امکان پرداخت اقساطی برای برخی دوره‌ها وجود دارد.`,
  },
  {
    keywords: ['ثبت‌نام', 'ثبت نام', 'enroll', 'عضویت', 'عضو شدن', 'ثبت'],
    response: `برای ثبت‌نام در دوره‌ها:

۱. در سامانه سایت عضو شوید
۲. دوره مورد نظر خود را انتخاب کنید
۳. فرآیند ثبت‌نام را تکمیل کنید
۴. هزینه را پرداخت کنید
۵. ثبت‌نام شما نهایی می‌شود

برای راهنمایی بیشتر با ما تماس بگیرید.`,
  },
  {
    keywords: ['آدرس', 'مکان', 'کجاست', 'location', 'address', 'کجا', 'آدرس آموزشگاه'],
    response: `آدرس آموزشگاه نجوای قلم:

📍 اصفهان، سپاهان‌شهر، بلوار غدیر، خیابان ایثار، طبقه فوقانی باشگاه شاهین`,
  },
  {
    keywords: ['تلفن', 'تماس', 'شماره', 'phone', 'contact', 'تماس بگیرید', 'شماره تلفن', 'موبایل'],
    response: `راه‌های تماس با ما:

📞 تلفن ثابت: ۰۳۱۳۶۵۱۲۸۱۴
📱 موبایل: ۰۹۱۳۳۲۳۹۶۷۲ | ۰۹۱۳۴۶۴۷۷۹۳
💬 ایتا: @najvaaca

ما منتظر تماس شما هستیم!`,
  },
  {
    keywords: ['هوش مصنوعی', 'ai', 'Artificial Intelligence', 'chatgpt', 'midjourney', 'دیپ فیک'],
    response: `دوره هوش مصنوعی نجوای قلم:

🤖 ساخت تصویر با هوش مصنوعی (Midjourney, DALL-E)
🎬 تولید ویدیو با هوش مصنوعی
🎵 تولید موسیقی با هوش مصنوعی
📝 تولید محتوای دیجیتال
🧠 آشنایی با ChatGPT و ابزارهای مشابه

این دوره به شما یاد می‌دهد چگونه از ابزارهای هوش مصنوعی به صورت حرفه‌ای استفاده کنید.

برای ثبت‌نام با ما تماس بگیرید.`,
  },
  {
    keywords: ['گواهینامه', 'مدرک', 'certificate', 'certificate', 'امتحان', 'آزمون'],
    response: `شرایط دریافت گواهینامه:

✅ شرکت در تمام جلسات
✅ تحویل تکالیف
✅ قبولی در آزمون پایانی

گواهینامه پایان دوره پس از تکمیل شرایط بالا صادر می‌شود.`,
  },
  {
    keywords: ['اساتید', 'استاد', 'مدرس', 'teacher', 'instructor', 'کی تدریس'],
    response: `اساتید آموزشگاه نجوای قلم همگی از مجرب‌ترین و متخصص‌ترین اساتید در حوزه تخصصی خود هستند.

برای اطلاعات بیشتر درباره اساتید هر دوره، با ما تماس بگیرید.`,
  },
  {
    keywords: ['ساعات', 'ساعت کلاس', 'schedule', 'زمان', 'روزهای کلاس', 'کی کلاس دارید'],
    response: `زمان‌بندی کلاس‌ها بسته به نوع دوره متفاوت است.

برای اطلاع از زمان دقیق کلاس‌ها با شماره ۰۹۱۳۳۲۳۹۶۷۲ تماس بگیرید.

همچنین می‌توانید به صورت آنلاین در دوره‌ها شرکت کنید.`,
  },
  {
    keywords: ['آنلاین', 'حضوری', 'online', 'offline', 'Remote'],
    response: `آموزشگاه نجوای قلم هم دوره‌های حضوری و هم دوره‌های آنلاین برگزار می‌کند.

دوره‌های آنلاین از طریق پلتفرم اختصاصی آموزشگاه برگزار می‌شوند و تمام جلسات ضبط شده و در پنل دانشجو قابل دانلود هستند.

برای اطلاعات بیشتر با ما تماس بگیرید.`,
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  for (const item of responses) {
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return item.response;
      }
    }
  }

  return DEFAULT_RESPONSE;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/50"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/50"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/50"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const { isCartOpen } = useDrawer();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      hasInitialized.current = true;
      setMessages([
        {
          id: generateId(),
          text: WELCOME_MESSAGE,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(trimmed);
      const botMessage: Message = {
        id: generateId(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [inputValue, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:left-6 sm:w-[400px] sm:h-[600px] z-50 sm:rounded-2xl bg-background border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FiCpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">چت با هوش مصنوعی 🤖</h3>
                  <p className="text-xs opacity-80">آموزشگاه نجوای قلم</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="بستن"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <FiCpu className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tl-sm'
                        : 'bg-muted rounded-tr-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                      <FiUser className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <FiCpu className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background shrink-0">
              <div className="flex items-center gap-2" dir="ltr">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 h-12 rounded-xl border bg-muted px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  disabled={isTyping}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  aria-label="ارسال"
                >
                  <FiSend className="h-5 w-5 -rotate-45" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!(isMobile && isCartOpen) && (
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 flex items-center justify-center transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'بستن چت' : 'باز کردن چت'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FiX className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FiMessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      )}
    </>
  );
}
