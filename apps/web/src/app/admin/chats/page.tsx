'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiUser, FiClock, FiCheck, FiSearch, FiSend, FiTrash2, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type Chat, type ChatMessage } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDB();
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
      markAsRead(selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  function loadData() {
    const allChats = db.getChats();
    setChats(allChats.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }

  function loadMessages(chatId: string) {
    setMessages(db.getChatMessages(chatId));
  }

  function markAsRead(chatId: string) {
    const chat = db.getChatById(chatId);
    if (chat && chat.unreadCount > 0) {
      db.updateChat(chatId, { unreadCount: 0 });
      loadData();
    }
  }

  function handleSendMessage() {
    if (!newMessage.trim() || !selectedChatId) return;

    const now = new Date();
    const ts = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    db.addChatMessage({
      chatId: selectedChatId,
      sender: 'admin',
      senderName: 'پشتیبانی',
      text: newMessage.trim(),
      timestamp: ts,
    });

    setNewMessage('');
    loadMessages(selectedChatId);
    loadData();
    toast.success('پیام ارسال شد');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function handleArchiveChat(chatId: string) {
    const chat = db.getChatById(chatId);
    if (!chat) return;

    db.updateChat(chatId, { status: chat.status === 'open' ? 'closed' : 'open' });
    loadData();
    toast.success(chat.status === 'open' ? 'مکالمه بسته شد' : 'مکالمه باز شد');
  }

  function handleDeleteChat(chatId: string) {
    db.deleteChat(chatId);
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
      setMessages([]);
    }
    loadData();
    toast.success('مکالمه حذف شد');
  }

  const filtered = chats.filter(
    (c) => c.userName.includes(search) || c.subject.includes(search)
  );

  const openChats = chats.filter((c) => c.status === 'open');
  const totalUnread = chats.reduce((a, c) => a + c.unreadCount, 0);
  const selectedChat = chats.find((c) => c.id === selectedChatId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">چت پشتیبانی</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'کل مکالمات', value: chats.length.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10', icon: FiMessageCircle },
          { label: 'باز', value: openChats.length.toString(), color: 'text-green-500', bg: 'bg-green-500/10', icon: FiMessageCircle },
          { label: 'خوانده نشده', value: totalUnread.toString(), color: 'text-red-500', bg: 'bg-red-500/10', icon: FiMessageCircle },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-background rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[50vh] lg:h-[calc(100vh-300px)]">
        <div className="bg-background rounded-xl border overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 rounded-lg border bg-background pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="جستجو بر اساس نام کاربر..."
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">مکالمه‌ای یافت نشد</div>
            )}
            {filtered.map((chat) => {
              const lastMsg = db.getChatMessages(chat.id).slice(-1)[0];
              return (
                <div
                  key={chat.id}
                  className={`w-full text-right p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${selectedChatId === chat.id ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <FiUser className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => setSelectedChatId(chat.id)}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{chat.userName}</span>
                        <div className="flex items-center gap-1">
                          {chat.status === 'closed' && <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">بسته</span>}
                          {chat.unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{chat.unreadCount}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{lastMsg?.text ?? chat.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {chat.updatedAt}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleArchiveChat(chat.id); }}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title={chat.status === 'open' ? 'بستن مکالمه' : 'باز کردن مکالمه'}
                      >
                        <FiCheck className={`h-4 w-4 ${chat.status === 'open' ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="حذف مکالمه"
                      >
                        <FiTrash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-background rounded-xl border flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedChat.userName}</p>
                    <p className="text-xs text-muted-foreground">{selectedChat.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${selectedChat.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedChat.status === 'open' ? 'باز' : 'بسته'}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'admin' ? 'bg-primary/20' : 'bg-muted'}`}>
                      <FiUser className={`h-4 w-4 ${msg.sender === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className={`rounded-xl px-4 py-3 max-w-[70%] ${msg.sender === 'admin' ? 'bg-primary/10 rounded-tl-sm' : 'bg-muted rounded-tr-sm'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{msg.senderName}</span>
                        <span className="text-[10px] text-muted-foreground mr-2">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 h-10 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="پاسخ خود را بنویسید..."
                    disabled={selectedChat.status === 'closed'}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || selectedChat.status === 'closed'}
                    className="bg-primary text-primary-foreground px-4 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiSend className="h-4 w-4" />
                    ارسال
                  </button>
                </div>
                {selectedChat.status === 'closed' && (
                  <p className="text-xs text-muted-foreground mt-2">این مکالمه بسته شده است. برای ارسال پیام ابتدا آن را باز کنید.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FiMessageCircle className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>یک مکالمه را انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
