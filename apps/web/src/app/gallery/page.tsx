'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiX, FiZoomIn } from 'react-icons/fi';

const galleryImages = [
  { id: 1, src: '/images/gallery1.jpg', alt: 'هوش مصنوعی', category: 'هوش مصنوعی' },
  { id: 2, src: '/images/gallery2.jpg', alt: 'برنامه‌نویسی', category: 'برنامه‌نویسی' },
  { id: 3, src: '/images/gallery3.jpg', alt: 'طراحی وب', category: 'طراحی سایت' },
  { id: 4, src: '/images/gallery4.jpg', alt: 'آموزش زبان', category: 'زبان انگلیسی' },
  { id: 5, src: '/images/gallery5.jpg', alt: 'رباتیک', category: 'رباتیک' },
  { id: 6, src: '/images/gallery6.jpg', alt: 'فن بیان', category: 'فن بیان' },
  { id: 7, src: '/images/gallery7.jpg', alt: 'نقاشی', category: 'نقاشی' },
  { id: 8, src: '/images/gallery8.jpg', alt: 'مدیریت پروژه', category: 'مدیریت پروژه' },
  { id: 9, src: '/images/gallery9.jpg', alt: 'طراحی گرافیک', category: 'گرافیک' },
  { id: 10, src: '/images/gallery10.jpg', alt: 'یادگیری ماشین', category: 'هوش مصنوعی' },
  { id: 11, src: '/images/gallery11.jpg', alt: 'لاگ‌های کدنویسی', category: 'برنامه‌نویسی' },
  { id: 12, src: '/images/gallery12.jpg', alt: 'ارائه و سخنرانی', category: 'فن بیان' },
  { id: 13, src: '/images/gallery13.jpg', alt: 'پایتون', category: 'برنامه‌نویسی' },
  { id: 14, src: '/images/gallery14.jpg', alt: 'کارگاه آموزشی', category: 'کارگاه' },
  { id: 15, src: '/images/gallery15.jpg', alt: 'کار گروهی', category: 'کارگاه' },
];

const categories = ['همه', 'هوش مصنوعی', 'برنامه‌نویسی', 'طراحی سایت', 'زبان انگلیسی', 'رباتیک', 'فن بیان', 'نقاشی', 'مدیریت پروژه', 'گرافیک', 'کارگاه'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [lightbox, setLightbox] = useState<typeof galleryImages[0] | null>(null);

  const filtered = selectedCategory === 'همه' ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
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
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
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
