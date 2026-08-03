'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { db, initializeDB } from '@/lib/store';

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsContextType {
  getCourseReviews: (courseId: string) => Review[];
  addReview: (courseId: string, userName: string, rating: number, comment: string) => boolean;
  hasUserReviewed: (courseId: string, userId: string) => boolean;
  getAverageRating: (courseId: string) => number;
  getReviewCount: (courseId: string) => number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function faDateToISO(fa: string): string {
  if (!fa) return new Date().toISOString();
  if (!isNaN(new Date(fa).getTime())) return new Date(fa).toISOString();
  let en = fa;
  PERSIAN_DIGITS.forEach((d, i) => {
    en = en.split(d).join(String(i));
  });
  const parts = en.split('/');
  if (parts.length !== 3) return new Date().toISOString();
  const [y, m, d] = parts.map((p) => p.padStart(2, '0'));
  return `${y}-${m}-${d}T12:00:00`;
}

function toContextReview(r: {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}): Review {
  return {
    id: r.id,
    courseId: r.courseId,
    userId: r.studentId,
    userName: r.studentName,
    rating: r.rating,
    comment: r.comment,
    createdAt: faDateToISO(r.date),
  };
}

function migrateLegacyReviews() {
  const saved = localStorage.getItem('course-reviews');
  if (!saved) return;
  try {
    const legacy = JSON.parse(saved) as { courseId: string; userId: string; userName: string; rating: number; comment: string; createdAt: string }[];
    legacy.forEach((r) => {
      const exists = db.getReviews().some(
        (x) => x.courseId === r.courseId && x.rating === r.rating && x.comment === r.comment
      );
      if (!exists) {
        db.addReview({
          courseId: r.courseId,
          courseName: db.getCourseById(r.courseId)?.title || '',
          studentId: r.userId || 'guest',
          studentName: r.userName || 'کاربر',
          rating: r.rating,
          comment: r.comment,
          date: new Date().toLocaleDateString('fa-IR'),
        });
      }
    });
  } catch {}
  localStorage.removeItem('course-reviews');
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    initializeDB();
    migrateLegacyReviews();
    setReviews(db.getReviews().map(toContextReview));
  }, []);

  const getCourseReviews = useCallback(
    (courseId: string) =>
      reviews
        .filter((r) => r.courseId === courseId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews]
  );

  const addReview = useCallback((courseId: string, userName: string, rating: number, comment: string) => {
    const raw = Cookies.get('amz_user');
    const user = raw
      ? (JSON.parse(raw) as { id: string; name: string })
      : null;
    const userId = user?.id || 'guest';
    const exists = db.getReviews().some((r) => r.courseId === courseId && r.studentId === userId);
    if (exists) return false;
    const added = db.addReview({
      courseId,
      courseName: db.getCourseById(courseId)?.title || '',
      studentId: userId,
      studentName: user?.name || userName || 'کاربر',
      rating,
      comment,
      date: new Date().toLocaleDateString('fa-IR'),
    });
    setReviews(db.getReviews().map(toContextReview));
    return !!added;
  }, []);

  const hasUserReviewed = useCallback(
    (courseId: string, userId: string) =>
      db.getReviews().some((r) => r.courseId === courseId && r.studentId === userId),
    []
  );

  const getAverageRating = useCallback(
    (courseId: string) => {
      const courseReviews = reviews.filter((r) => r.courseId === courseId);
      if (courseReviews.length === 0) return 0;
      return courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    },
    [reviews]
  );

  const getReviewCount = useCallback(
    (courseId: string) => reviews.filter((r) => r.courseId === courseId).length,
    [reviews]
  );

  return (
    <ReviewsContext.Provider value={{ getCourseReviews, addReview, hasUserReviewed, getAverageRating, getReviewCount }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within ReviewsProvider');
  return context;
}
