'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiMessageCircle, FiUser, FiBox } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB, type Chat, type ChatMessage } from '@/lib/store';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userCookie = typeof window !== 'undefined' ? Cookies.get('amz_user') : null;
  const user = userCookie ? JSON.parse(userCookie) : null;

  useEffect(() => {
    initializeDB();
    if (user?.id) {
      let existing = db.getChats().find((c: Chat) => c.userId === user.id && c.status === 'open');
      if (!existing) {
        existing = db.addChat({
          userId: user.id,
          userName: user.name || 'کاربر',
          subject: 'پشتیبانی عمومی',
          status: 'open',
          unreadCount: 0,
          createdAt: formatNow(),
          updatedAt: formatNow(),
        });
      }
      setChatId(existing.id);
      setMessages(db.getChatMessages(existing.id));
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(() => {
      const newMsgs = db.getChatMessages(chatId);
      setMessages(newMsgs);
    }, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  function formatNow() {
    const now = new Date();
    return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  const sendMessage = () => {
    if (!input.trim() || !chatId) return;
    db.addChatMessage({
      chatId,
      sender: 'user',
      senderName: user?.name || 'کاربر',
      text: input.trim(),
      timestamp: formatNow(),
    });
    db.updateChat(chatId, { updatedAt: formatNow() });
    setInput('');
    setMessages(db.getChatMessages(chatId));
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
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
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FiMessageCircle className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>پیام خود را ارسال کنید تا پشتیبانی پاسخ دهد</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary/10' : 'bg-green-100'}`}>
              {msg.sender === 'user' ? <FiUser className="h-4 w-4 text-primary" /> : <FiBox className="h-4 w-4 text-green-600" />}
            </div>
            <div className={`max-w-[75%] ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
              <div className={`rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tl-sm' : 'bg-muted rounded-tr-sm'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
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
