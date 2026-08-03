'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import { db, initializeDB, type BlogPost } from '@/lib/store';
import { blogPosts as staticPosts } from '@/lib/blog-data';
import { useHydrated } from '@/hooks/use-hydrated';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const hydrated = useHydrated();

  useEffect(() => {
    initializeDB();
    const found = db.getBlogPostById(id);
    setPost(found && found.status === 'published' ? found : null);
  }, [id]);

  const fallback = staticPosts.find((p) => p.id === id) || null;
  const current = post || fallback;

  if (hydrated && !current) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
          <Link href="/blog" className="text-primary hover:underline">بازگشت به بلاگ</Link>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت به بلاگ
            </Link>
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">{current.category}</span>
            <h1 className="text-3xl font-bold mb-4">{current.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><FiUser className="h-4 w-4" />{current.author}</span>
              <span className="flex items-center gap-1"><FiCalendar className="h-4 w-4" />{current.date}</span>
              <span className="flex items-center gap-1"><FiClock className="h-4 w-4" />{current.readTime || '۵ دقیقه'}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="rounded-2xl overflow-hidden mb-8">
          <img src={current.imageUrl || '/images/blog2.jpg'} alt={current.title} className="w-full h-64 md:h-80 object-cover" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          {current.content.split('\n').map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
