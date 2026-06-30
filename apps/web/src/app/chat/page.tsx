'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiMessageCircle, FiUser, FiBox } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  date: string;
}

const AUTO_REPLIES = [
  'سلام! چطور می‌تونم کمکتون کنم؟',
  'لطفاً صبر کنید، پشتیبانی در حال بررسی درخواست شماست.',
  'ممنون از پیامتون. به زودی پاسخ می‌دهیم.',
  'آیا سوال دیگه‌ای دارید؟',
  'خیلی خوب، درخواست شما ثبت شد.',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'سلام! به پشتیبانی آموزشگاه نجوای قلم خوش آمدید.', sender: 'support', date: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      text: input,
      sender: 'user',
      date: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const supportMsg: Message = {
        id: `s_${Date.now()}`,
        text: reply,
        sender: 'support',
        date: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, supportMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-6 border-b">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
            <FiArrowLeft className="ml-1 h-4 w-4" />
            بازگشت
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FiMessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold">پشتیبانی آنلاین</h1>
              <p className="text-xs text-green-500">آنلاین</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary/10' : 'bg-green-100'}`}>
              {msg.sender === 'user' ? <FiUser className="h-4 w-4 text-primary" /> : <FiBox className="h-4 w-4 text-green-600" />}
            </div>
            <div className={`max-w-[75%] ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
              <div className={`rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tl-sm' : 'bg-muted rounded-tr-sm'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{msg.date}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <FiBox className="h-4 w-4 text-green-600" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tr-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-background container mx-auto px-4 py-4 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="پیام خود را بنویسید..." />
          <button type="submit" disabled={!input.trim()} className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50">
            <FiSend className="h-5 w-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
