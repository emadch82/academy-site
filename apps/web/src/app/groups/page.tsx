'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiMessageCircle, FiSend, FiBookOpen } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB, Group } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function ClassGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const hydrated = useHydrated();

  const user = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = Cookies.get('amz_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; name: string; identifier: string; role: string };
    } catch {
      return null;
    }
  }, []);

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    if (user?.role === 'student') {
      setGroups(db.getGroupsByStudent(user.id));
    } else {
      setGroups(db.getGroups());
    }
  }, [hydrated, user?.id, user?.role, refreshKey]);

  if (!hydrated) return <main className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">در حال بارگذاری...</p></main>;

  const messages = selectedGroup ? db.getGroupMessages(selectedGroup) : [];

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;
    db.addGroupMessage({
      groupId: selectedGroup,
      senderId: user?.id || 'guest',
      senderName: user?.name || 'مهمان',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR'),
    });
    setMessageInput('');
    setRefreshKey((k) => k + 1);
  };

  if (selectedGroup) {
    const group = groups.find((g) => g.id === selectedGroup);
    const memberCount = group ? db.getStudentsByCourse(group.courseId).length : 0;
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24 max-w-3xl">
          <div className="bg-background border rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-l from-primary/10 to-secondary/10 p-4 flex items-center justify-between border-b">
              <div>
                <h1 className="font-bold">{group?.name}</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <FiUsers className="h-3 w-3" /> {memberCount} عضو — {group?.description}
                </p>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="text-sm text-muted-foreground hover:text-foreground">
                بازگشت به گروه‌ها
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <FiMessageCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm text-muted-foreground">اولین پیام را ارسال کنید</p>
                </div>
              ) : (
                messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        mine ? 'bg-primary text-primary-foreground rounded-bl-sm' : 'bg-background border rounded-br-sm'
                      }`}>
                        {!mine && <p className="text-[10px] font-bold text-primary mb-1">{m.senderName}</p>}
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${mine ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{m.timestamp}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t flex items-center gap-2">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={sendMessage}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowLeft className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold mb-2">گروه‌های کلاسی</h1>
            <p className="text-muted-foreground mb-10">
              {user ? 'گروه‌های دوره‌های شما' : 'برای دیدن گروه‌های دوره‌های خود وارد شوید'}
            </p>

            {groups.length === 0 ? (
              <div className="text-center py-16 bg-background border rounded-2xl">
                <FiUsers className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-bold">گروهی برای شما یافت نشد</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {user ? 'با ثبت‌نام در دوره‌ها به گروه آن اضافه می‌شوید' : <Link href="/auth/login" className="text-primary hover:underline">ورود به حساب کاربری</Link>}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((g) => {
                  const memberCount = db.getStudentsByCourse(g.courseId).length;
                  const msgCount = db.getGroupMessages(g.id).length;
                  return (
                    <motion.button
                      key={g.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedGroup(g.id)}
                      className="text-right bg-background border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <FiBookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{g.name}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><FiUsers className="h-3.5 w-3.5" /> {memberCount} عضو</span>
                        <span className="flex items-center gap-1"><FiMessageCircle className="h-3.5 w-3.5" /> {msgCount} پیام</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
