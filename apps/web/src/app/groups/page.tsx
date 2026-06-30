'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiMessageCircle, FiSend, FiBookOpen, FiHash } from 'react-icons/fi';

const MOCK_GROUPS = [
  { id: '1', name: 'هوش مصنوعی - سطح ۱', members: 12, description: 'گروه کلاس هوش مصنوعی', unread: 3 },
  { id: '2', name: 'طراحی سایت - سطح ۲', members: 10, description: 'گروه کلاس طراحی سایت', unread: 0 },
  { id: '3', name: 'زبان انگلیسی - مکالمه', members: 15, description: 'گروه کلاس زبان', unread: 7 },
  { id: '4', name: 'رباتیک - ویژه', members: 8, description: 'گروه کلاس رباتیک', unread: 1 },
];

const MOCK_MESSAGES: Record<string, { id: string; sender: string; text: string; time: string }[]> = {
  '1': [
    { id: 'm1', sender: 'استاد رضایی', text: 'سلام بچه‌ها. تکالیف هفته بعد رو آپلود کردم.', time: '۱۰:۳۰' },
    { id: 'm2', sender: 'امیر', text: 'ممنون استاد', time: '۱۰:۳۵' },
    { id: 'm3', sender: 'سارا', text: 'استاد آیا امتحان هفته آینده داریم؟', time: '۱۱:۰۰' },
  ],
  '3': [
    { id: 'm4', sender: 'استاد نوری', text: 'Good morning everyone!', time: '۰۹:۰۰' },
    { id: 'm5', sender: 'رضا', text: 'Good morning teacher!', time: '۰۹:۰۵' },
  ],
};

type Tab = 'list' | 'chat';

export default function ClassGroupsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const groupMessages = selectedGroup ? MOCK_MESSAGES[selectedGroup] || [] : [];

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;
    setMessageInput('');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowLeft className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold">گروه‌های کلاسی</h1>
            <p className="text-muted-foreground mt-2">گفتگو و تبادل نظر با همکلاسی‌ها</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {activeTab === 'list' ? (
          <div className="space-y-4">
            {MOCK_GROUPS.map((group, i) => (
              <motion.button key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => { setSelectedGroup(group.id); setActiveTab('chat'); }} className="w-full bg-background rounded-2xl border p-5 flex items-center gap-4 hover:shadow-lg transition-all text-right">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FiBookOpen className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{group.name}</h3>
                    {group.unread > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{group.unread}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><FiUsers className="h-3 w-3" /> {group.members} عضو</p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-background rounded-2xl border overflow-hidden flex flex-col h-[50vh] lg:h-[calc(100vh-280px)]">
            <div className="border-b p-4 flex items-center gap-3">
              <button type="button" onClick={() => setActiveTab('list')} className="text-muted-foreground hover:text-primary transition-colors"><FiArrowLeft className="h-5 w-5" /></button>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><FiBookOpen className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-bold text-sm">{MOCK_GROUPS.find((g) => g.id === selectedGroup)?.name}</h3>
                <p className="text-xs text-muted-foreground">{MOCK_GROUPS.find((g) => g.id === selectedGroup)?.members} عضو</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {groupMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FiMessageCircle className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p>هنوز پیامی ارسال نشده</p>
                </div>
              ) : (
                groupMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{msg.sender[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm mt-1 bg-muted rounded-xl rounded-tr-sm px-3 py-2">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-4">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="flex-1 h-10 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="پیام بنویسید..." />
                <button type="submit" disabled={!messageInput.trim()} className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50"><FiSend className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
