'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { blogPosts } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold">اخبار و مقالات</h1>
            <p className="text-muted-foreground mt-2">جدیدترین اخبار و مقالات آموزشی</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.id}`} className="group block">
                <div className="bg-background rounded-2xl border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{post.category}</span>
                    <h2 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><FiClock className="h-3 w-3" />{post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
