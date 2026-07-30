'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiX, FiZoomIn } from 'react-icons/fi';

const galleryImages = [
  { id: 1, src: '/images/vira-slide2.jpg', alt: 'کلاس آموزشگاه زبان ویرا', category: 'آموزشگاه' },
  { id: 2, src: '/images/vira-slide1.jpg', alt: 'کتاب‌های American English File', category: 'کتاب‌ها' },
  { id: 3, src: '/images/vira-slide3.jpg', alt: 'کتاب‌های First Friends ویژه کودکان', category: 'کتاب‌ها' },
  { id: 4, src: '/images/vira-news.jpg', alt: 'آغاز ثبت نام ترم جدید', category: 'اخبار' },
  { id: 5, src: '/images/nasim.jpg', alt: 'نسیم خدابخش - موسس و مدیریت', category: 'اساتید' },
  { id: 6, src: '/images/zahra.jpg', alt: 'زهرا مردانی - مدرس TTC و بزرگسال', category: 'اساتید' },
  { id: 7, src: '/images/vira-logo.jpg', alt: 'لوگوی آموزشگاه زبان ویرا', category: 'آموزشگاه' },
  { id: 8, src: '/images/english.jpg', alt: 'محیط آموزشی', category: 'آموزشگاه' },
  { id: 9, src: '/images/speech.jpg', alt: 'کلاس مکالمه', category: 'کلاس‌ها' },
  { id: 10, src: '/images/about.jpg', alt: 'فضای آموزشگاه', category: 'آموزشگاه' },
];

const categories = ['همه', 'آموزشگاه', 'کتاب‌ها', 'کلاس‌ها', 'اساتید', 'اخبار'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [lightbox, setLightbox] = useState<typeof galleryImages[0] | null>(null);

  const filtered = selectedCategory === 'همه' ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <FiArrowRight className="ml-1 h-4 w-4" />
              بازگشت
            </Link>
            <h1 className="text-3xl font-bold">گالری تصاویر</h1>
            <p className="text-muted-foreground mt-2">تصاویر دوره‌ها و فعالیت‌های آموزشگاه</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 justify-start overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((img, index) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
              <button type="button" onClick={() => setLightbox(img)} className="group relative rounded-xl overflow-hidden aspect-video block w-full">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{img.alt}</p>
                  <p className="text-white/70 text-xs">{img.category}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>تصویری در این دسته‌بندی وجود ندارد</p>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} className="absolute top-4 left-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <FiX className="h-6 w-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} className="w-full rounded-xl" />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{lightbox.alt}</p>
              <p className="text-white/60 text-sm">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
