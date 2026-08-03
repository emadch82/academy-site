'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { db, initializeDB, type BlogPost } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const DEFAULT_CATEGORIES = ['یادگیری زبان', 'آموزش کودکان', 'مکالمه', 'آزمون آیلتس', 'TTC', 'فرهنگی'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const hydrated = useHydrated();

  useEffect(() => {
    initializeDB();
    setPosts(db.getBlogPosts().filter((p) => p.status === 'published'));
  }, []);

  const categories = useMemo(() => {
    const fromPosts = posts.map((p) => p.category).filter(Boolean);
    return ['همه', ...Array.from(new Set([...DEFAULT_CATEGORIES, ...fromPosts]))];
  }, [posts]);

  const filtered = selectedCategory === 'همه' ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold">اخبار و مقالات</h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mt-3">
            جدیدترین اخبار و مقالات آموزشی
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-nowrap gap-2 mb-10 justify-center overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-white/10 text-white/60 hover:bg-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.id}`} className="group block">
                <div className="bg-background rounded-2xl border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.imageUrl || '/images/blog2.jpg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{post.category}</span>
                    <h2 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><FiClock className="h-3 w-3" />{post.readTime || '۵ دقیقه'}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {!hydrated && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">در حال بارگذاری...</p>
        )}
        {hydrated && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">مقاله‌ای در این دسته‌بندی یافت نشد</p>
        )}
      </div>
    </main>
  );
}
